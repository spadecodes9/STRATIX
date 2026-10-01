// Riot Sign On (RSO) + VALORANT player-data layer.
//
// Server-only. Every Riot credential and every Riot API call lives here —
// React code never talks to Riot. Flow:
//
//   STRATIX user -> riot_connections (via RSO) -> Riot identity (puuid)
//     -> syncPlayerData (Riot API) -> riot_player_data -> UI / AI Coach
//
// RSO access tokens are used once at callback time to read the player's
// identity and are never stored, logged, or put in a URL. Match data is
// read with the server's RIOT_API_KEY by puuid, so no user token is needed
// afterwards (and there is no token to leak or refresh).
//
// Without RIOT_* / SUPABASE_SERVICE_ROLE_KEY env vars every route answers
// "not configured" and the rest of STRATIX keeps working.

import crypto from 'node:crypto'
import { adminClient as admin, getUserFromRequest, hasServiceRole, userClient } from './supabase.js'

const env = process.env
export const APP_URL = (env.APP_URL || 'http://localhost:5173').replace(/\/$/, '')
const ACCOUNT_REGION = env.RIOT_ACCOUNT_REGION || 'americas'
const MATCHES_TO_SYNC = 10
const STATE_TTL_MS = 10 * 60 * 1000
const VAL_SHARDS = new Set(['na', 'eu', 'ap', 'kr', 'latam', 'br'])
// ponytail: synthetic email for Riot-only accounts (Supabase Auth needs one
// to mint a session). Never emailed. Swap for a real domain you own if
// Supabase email validation ever rejects .invalid.
const RIOT_ONLY_EMAIL_DOMAIN = 'riot-users.stratix.invalid'

export const rsoConfigured = () =>
  Boolean(env.RIOT_CLIENT_ID && env.RIOT_CLIENT_SECRET && env.RIOT_REDIRECT_URI && hasServiceRole())

// ---------------------------------------------------------------------------
// OAuth state: HMAC-signed payload + a nonce that must also match an
// httpOnly cookie, so the callback only completes in the browser that
// started the flow (blocks linking-CSRF).
// ---------------------------------------------------------------------------

const b64url = (buf) => Buffer.from(buf).toString('base64url')

export function signState(payload, secret) {
  const body = b64url(JSON.stringify(payload))
  const mac = b64url(crypto.createHmac('sha256', secret).update(body).digest())
  return `${body}.${mac}`
}

export function verifyState(state, cookieNonce, secret, now = Date.now()) {
  if (typeof state !== 'string' || !cookieNonce) return null
  const [body, mac] = state.split('.')
  if (!body || !mac) return null
  const expected = b64url(crypto.createHmac('sha256', secret).update(body).digest())
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  let payload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  } catch {
    return null
  }
  if (payload.nonce !== cookieNonce || !(payload.exp > now)) return null
  return payload
}

function readCookie(req, name) {
  const match = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(name + '='))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function setCookie(res, name, value, maxAgeSec) {
  const secure = APP_URL.startsWith('https://') ? '; Secure' : ''
  res.append('Set-Cookie', `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/api/riot; Max-Age=${maxAgeSec}${secure}`)
}

// ---------------------------------------------------------------------------
// Riot API
// ---------------------------------------------------------------------------

class RiotApiError extends Error {
  constructor(status) {
    super(`Riot API responded ${status}`)
    this.status = status
  }
}

async function riotGet(url, headers) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new RiotApiError(res.status)
  return res.json()
}

const apiKeyHeaders = () => ({ 'X-Riot-Token': env.RIOT_API_KEY })

async function exchangeCode(code) {
  const basic = Buffer.from(`${env.RIOT_CLIENT_ID}:${env.RIOT_CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://auth.riotgames.com/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: env.RIOT_REDIRECT_URI }),
  })
  if (!res.ok) throw new RiotApiError(res.status)
  const data = await res.json()
  return data.access_token
}

async function fetchActiveShard(puuid) {
  if (!env.RIOT_API_KEY) return null
  try {
    const data = await riotGet(
      `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/active-shards/by-game/val/by-puuid/${encodeURIComponent(puuid)}`,
      apiKeyHeaders()
    )
    return VAL_SHARDS.has(data.activeShard) ? data.activeShard : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Match data -> player summary (pure, tested in riot.test.js)
// ---------------------------------------------------------------------------

const TIER_GROUPS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal']

export function tierName(tier) {
  if (tier === 27) return 'Radiant'
  if (!Number.isInteger(tier) || tier < 3 || tier > 26) return null
  return `${TIER_GROUPS[Math.floor((tier - 3) / 3)]} ${((tier - 3) % 3) + 1}`
}

const MAP_CODENAMES = {
  Duality: 'Bind', Triad: 'Haven', Bonsai: 'Split', Port: 'Icebox', Foxtrot: 'Breeze',
  Canyon: 'Fracture', Pitt: 'Pearl', Jam: 'Lotus', Juliett: 'Sunset', Infinity: 'Abyss',
}

export function mapName(mapId) {
  const code = String(mapId || '').split('/').filter(Boolean).pop() || ''
  return MAP_CODENAMES[code] || code || 'Unknown'
}

export function summarizeMatches(puuid, matches, agentNames = {}) {
  const recentMatches = []
  let kills = 0, deaths = 0, score = 0, rounds = 0, wins = 0, hs = 0, shots = 0
  let rank = null
  const agentCounts = {}

  for (const match of matches) {
    const player = match.players?.find((p) => p.puuid === puuid)
    if (!player?.stats) continue
    const team = match.teams?.find((t) => t.teamId === player.teamId)
    const result = !team ? 'unknown' : team.won ? 'win' : match.teams.some((t) => t.won) ? 'loss' : 'draw'
    const { kills: k = 0, deaths: d = 0, assists: a = 0, score: s = 0, roundsPlayed: r = 0 } = player.stats
    const agent = agentNames[String(player.characterId).toLowerCase()] || null

    for (const round of match.roundResults || []) {
      for (const ps of round.playerStats || []) {
        if (ps.puuid !== puuid) continue
        for (const dmg of ps.damage || []) {
          hs += dmg.headshots || 0
          shots += (dmg.headshots || 0) + (dmg.bodyshots || 0) + (dmg.legshots || 0)
        }
      }
    }

    kills += k; deaths += d; score += s; rounds += r
    if (result === 'win') wins += 1
    if (agent) agentCounts[agent] = (agentCounts[agent] || 0) + 1
    // Matches arrive newest first: the first competitive one sets the rank.
    if (!rank && match.matchInfo?.queueId === 'competitive') {
      const name = tierName(player.competitiveTier)
      if (name) rank = { tier: player.competitiveTier, name }
    }

    recentMatches.push({
      id: match.matchInfo?.matchId,
      map: mapName(match.matchInfo?.mapId),
      queue: match.matchInfo?.queueId || null,
      agent,
      result,
      kills: k,
      deaths: d,
      assists: a,
      acs: r ? Math.round(s / r) : null,
      startedAt: match.matchInfo?.gameStartMillis ? new Date(match.matchInfo.gameStartMillis).toISOString() : null,
    })
  }

  const count = recentMatches.length
  const mostPlayedAgent = Object.entries(agentCounts).sort((x, y) => y[1] - x[1])[0]?.[0] || null

  return {
    rank,
    mostPlayedAgent,
    stats: count
      ? {
          matches: count,
          winRate: Math.round((wins / count) * 100),
          kd: Math.round((kills / Math.max(deaths, 1)) * 100) / 100,
          acs: rounds ? Math.round(score / rounds) : null,
          headshotPct: shots ? Math.round((hs / shots) * 100) : null,
        }
      : null,
    recentMatches,
  }
}

async function fetchAgentNames(shard) {
  try {
    const content = await riotGet(`https://${shard}.api.riotgames.com/val/content/v1/contents?locale=en-US`, apiKeyHeaders())
    return Object.fromEntries((content.characters || []).map((c) => [String(c.id).toLowerCase(), c.name]))
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// Database access. service_role has NO table privileges in this project, so
// every server write goes through a narrow SECURITY DEFINER function that only
// service_role may execute (migration 20261001000400_server_write_functions).
// ---------------------------------------------------------------------------

async function rpc(fn, args) {
  const { data, error } = await admin().rpc(fn, args)
  if (error) throw new Error(`${fn} failed (${error.code ?? 'no code'})`)
  return data
}

// Returns { ok: true } or { ok: false, code } where code is one of:
// not_connected | api_unavailable | unsupported_region | rate_limited | riot_error
export async function syncPlayerData(userId) {
  try {
    const conn = (await rpc('get_riot_connection_for_user', { p_user_id: userId }))?.[0]
    if (!conn) return { ok: false, code: 'not_connected' }
    if (!env.RIOT_API_KEY) return { ok: false, code: 'api_unavailable' }

    const shard = conn.shard || (await fetchActiveShard(conn.puuid))
    if (!shard) return { ok: false, code: 'unsupported_region' }

    const host = `https://${shard}.api.riotgames.com`
    const list = await riotGet(`${host}/val/match/v1/matchlists/by-puuid/${encodeURIComponent(conn.puuid)}`, apiKeyHeaders())
    const ids = (list.history || [])
      .sort((a, b) => b.gameStartTimeMillis - a.gameStartTimeMillis)
      .slice(0, MATCHES_TO_SYNC)
      .map((h) => h.matchId)
    const [matches, agentNames] = await Promise.all([
      Promise.all(ids.map((id) => riotGet(`${host}/val/match/v1/matches/${encodeURIComponent(id)}`, apiKeyHeaders()))),
      fetchAgentNames(shard),
    ])

    const summary = summarizeMatches(conn.puuid, matches, agentNames)
    // false = the account was disconnected or re-linked while we were syncing.
    const saved = await rpc('save_riot_player_data_for_user', {
      p_user_id: userId,
      p_puuid: conn.puuid,
      p_shard: shard,
      p_data: summary,
    })
    return saved ? { ok: true } : { ok: false, code: 'not_connected' }
  } catch (err) {
    if (err instanceof RiotApiError) {
      console.error('[riot] sync failed with status', err.status)
      if (err.status === 429) return { ok: false, code: 'rate_limited' }
      if (err.status === 401 || err.status === 403) return { ok: false, code: 'api_unavailable' }
      return { ok: false, code: 'riot_error' }
    }
    console.error('[riot] sync failed:', err.message)
    return { ok: false, code: 'riot_error' }
  }
}

// ---------------------------------------------------------------------------
// AI Coach context — built server-side from the DB, never from the client.
// ---------------------------------------------------------------------------

export const NO_PLAYER_DATA = Object.freeze({ riotConnected: false, playerDataAvailable: false, playerData: null })

// `auth` must come from getUserFromRequest (a server-verified session). Reads
// are RLS-scoped to that user, so it can only ever see its own Riot rows.
// Any read failure fails closed to NO_PLAYER_DATA.
export async function getCoachPlayerContext(auth) {
  if (!auth) return NO_PLAYER_DATA
  const db = userClient(auth.token)
  const [{ data: conn }, { data: player }] = await Promise.all([
    db.from('riot_connections').select('game_name, tag_line').eq('user_id', auth.user.id).maybeSingle(),
    db.from('riot_player_data').select('data, synced_at').eq('user_id', auth.user.id).maybeSingle(),
  ])
  if (!conn) return NO_PLAYER_DATA
  const hasStats = Boolean(player?.data?.stats)
  return {
    riotConnected: true,
    playerDataAvailable: hasStats,
    playerData: hasStats
      ? {
          riotId: `${conn.game_name}#${conn.tag_line}`,
          syncedAt: player.synced_at,
          rankAtLastCompetitiveMatch: player.data.rank?.name ?? null,
          mostPlayedAgent: player.data.mostPlayedAgent,
          lastMatchesSummary: player.data.stats,
          recentMatches: player.data.recentMatches,
        }
      : null,
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

function startFlow(res, mode, userId = null) {
  const nonce = b64url(crypto.randomBytes(24))
  const state = signState({ mode, userId, nonce, exp: Date.now() + STATE_TTL_MS }, env.RIOT_CLIENT_SECRET)
  setCookie(res, 'riot_oauth_nonce', nonce, STATE_TTL_MS / 1000)
  const url = new URL('https://auth.riotgames.com/authorize')
  url.search = new URLSearchParams({
    client_id: env.RIOT_CLIENT_ID,
    redirect_uri: env.RIOT_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid',
    state,
  })
  res.json({ url: url.toString() })
}

const notConfigured = (res) =>
  res.status(503).json({ error: "Riot sign-on isn't available yet. Riot account linking is coming soon." })

export function registerRiotRoutes(app) {
  // Link Riot to the signed-in STRATIX account (no new user is created).
  app.post('/api/riot/connect', async (req, res) => {
    if (!rsoConfigured()) return notConfigured(res)
    const auth = await getUserFromRequest(req)
    if (!auth) return res.status(401).json({ error: 'Your session expired. Sign in again.' })
    startFlow(res, 'link', auth.user.id)
  })

  // "Continue with Riot" on the sign-in / create-account pages.
  app.post('/api/riot/login', (_req, res) => {
    if (!rsoConfigured()) return notConfigured(res)
    startFlow(res, 'login')
  })

  app.get('/api/riot/callback', async (req, res) => {
    const nonce = readCookie(req, 'riot_oauth_nonce')
    setCookie(res, 'riot_oauth_nonce', '', 0)
    const state = rsoConfigured() ? verifyState(req.query.state, nonce, env.RIOT_CLIENT_SECRET) : null
    const back = (path, outcome) => res.redirect(`${APP_URL}${path}?riot=${outcome}`)
    const fallbackPath = state?.mode === 'login' ? '/sign-in' : '/profile'

    if (req.query.error) return back(fallbackPath, 'cancelled')
    if (!state || typeof req.query.code !== 'string') return back(fallbackPath, 'failed')

    try {
      const accessToken = await exchangeCode(req.query.code)
      const account = await riotGet(`https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/me`, {
        Authorization: `Bearer ${accessToken}`,
      })
      const db = admin() // Auth admin API only (createUser / getUserById / generateLink)
      const existingUserId = await rpc('find_user_by_riot_puuid', { p_puuid: account.puuid })

      let userId = state.userId
      if (state.mode === 'link') {
        if (existingUserId && existingUserId !== userId) return back('/profile', 'already_linked')
      } else {
        userId = existingUserId
        if (!userId) {
          const digest = crypto.createHash('sha256').update(account.puuid).digest('hex').slice(0, 32)
          const { data, error } = await db.auth.admin.createUser({
            email: `riot-${digest}@${RIOT_ONLY_EMAIL_DOMAIN}`,
            email_confirm: true,
            app_metadata: { stratix_auth_provider: 'riot' },
            user_metadata: { full_name: account.gameName },
          })
          if (error) throw error
          userId = data.user.id
        }
      }

      const linkResult = await rpc('link_riot_account_for_user', {
        p_user_id: userId,
        p_puuid: account.puuid,
        p_game_name: account.gameName,
        p_tag_line: account.tagLine,
        p_shard: await fetchActiveShard(account.puuid),
      })
      // Lost a race: another STRATIX user linked this Riot account first.
      if (linkResult === 'already_linked') {
        return state.mode === 'link' ? back('/profile', 'already_linked') : back('/sign-in', 'failed')
      }

      // Best effort: the profile shows "no match data yet" with a retry if this fails.
      await syncPlayerData(userId)

      if (state.mode === 'link') return back('/profile', 'connected')

      // Mint a one-time Supabase sign-in for this user. The hashed token goes
      // into a short-lived httpOnly cookie (never a URL); the frontend trades
      // it for a session via POST /api/riot/session.
      const { data: authUser } = await db.auth.admin.getUserById(userId)
      const { data: link, error: linkError } = await db.auth.admin.generateLink({
        type: 'magiclink',
        email: authUser.user.email,
      })
      if (linkError) throw linkError
      setCookie(res, 'riot_login_token', link.properties.hashed_token, 120)
      return res.redirect(`${APP_URL}/auth/riot`)
    } catch (err) {
      console.error('[riot] callback failed:', err instanceof RiotApiError ? `status ${err.status}` : err.message)
      return back(fallbackPath, 'failed')
    }
  })

  app.post('/api/riot/session', (req, res) => {
    const tokenHash = readCookie(req, 'riot_login_token')
    setCookie(res, 'riot_login_token', '', 0)
    if (!tokenHash) return res.status(400).json({ error: 'Riot sign-in expired. Try again.' })
    res.json({ tokenHash })
  })

  app.post('/api/riot/sync', async (req, res) => {
    if (!rsoConfigured()) return notConfigured(res)
    const auth = await getUserFromRequest(req)
    if (!auth) return res.status(401).json({ error: 'Your session expired. Sign in again.' })
    const result = await syncPlayerData(auth.user.id)
    res.status(result.ok ? 200 : result.code === 'rate_limited' ? 429 : 502).json(result)
  })

  app.post('/api/riot/disconnect', async (req, res) => {
    if (!rsoConfigured()) return notConfigured(res)
    const auth = await getUserFromRequest(req)
    if (!auth) return res.status(401).json({ error: 'Your session expired. Sign in again.' })
    // riot_player_data cascades from riot_connections.
    try {
      await rpc('disconnect_riot_account_for_user', { p_user_id: auth.user.id })
    } catch (err) {
      console.error('[riot] disconnect failed:', err.message)
      return res.status(500).json({ error: "Couldn't disconnect Riot. Try again." })
    }
    res.json({ ok: true })
  })
}
