// Run with: npm test
// Drives the real Riot routes over HTTP: connect -> RSO callback -> link ->
// sync -> disconnect, plus sign-in with Riot. Riot's endpoints are faked; the
// Supabase fake enforces the real permission model (service_role: no table
// access, only the server functions).
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { installFakeSupabase } from './testing/fakeSupabase.js'

const SERVICE_KEY = 'service-role-test-key'
Object.assign(process.env, {
  SUPABASE_URL: 'http://supabase.test',
  SUPABASE_PUBLISHABLE_KEY: 'publishable-test-key',
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
  OPENROUTER_API_KEY: 'openrouter-test-key',
  RIOT_CLIENT_ID: 'riot-client-id',
  RIOT_CLIENT_SECRET: 'riot-client-secret',
  RIOT_REDIRECT_URI: 'http://localhost:5173/api/riot/callback',
  RIOT_API_KEY: 'riot-api-key',
})

// Real Supabase user ids are UUIDs (supabase-js validates this for admin calls).
const LOGINER_ID = '0b7f6c1e-4d2a-4c3b-9e8f-1a2b3c4d5e6f'
const USERS = {
  'tok-linker': { id: 'u-linker', email: 'linker@example.com', app_metadata: { provider: 'google' } },
  'tok-other': { id: 'u-other', email: 'other@example.com', app_metadata: { provider: 'discord' } },
  'tok-loginer': { id: LOGINER_ID, email: 'loginer@example.com', app_metadata: { provider: 'google' } },
}

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const riotCalls = []

// Fake Riot: code-X -> access token at-X -> account puuid-X.
function fakeRiot(url, init) {
  if (!url.hostname.endsWith('riotgames.com')) return null
  riotCalls.push(url.pathname)
  const bearer = new Headers(init.headers).get('authorization')
  if (url.hostname === 'auth.riotgames.com' && url.pathname === '/token') {
    const code = new URLSearchParams(init.body).get('code')
    const expectedBasic = 'Basic ' + Buffer.from('riot-client-id:riot-client-secret').toString('base64')
    if (bearer !== expectedBasic || !code.startsWith('code-')) return json({ error: 'invalid_grant' }, 400)
    return json({ access_token: `at-${code.slice(5)}` })
  }
  if (url.pathname === '/riot/account/v1/accounts/me') {
    const id = bearer?.replace('Bearer at-', '')
    return json({ puuid: `puuid-${id}`, gameName: `Player${id}`, tagLine: 'NA1' })
  }
  if (url.pathname.startsWith('/riot/account/v1/active-shards/')) return json({ activeShard: 'na' })
  if (url.pathname.startsWith('/val/match/v1/matchlists/by-puuid/')) {
    return json({ history: [{ matchId: 'm1', gameStartTimeMillis: 1 }] })
  }
  if (url.pathname === '/val/match/v1/matches/m1') {
    const puuid = lastSyncedPuuid
    return json({
      matchInfo: { matchId: 'm1', mapId: '/Game/Maps/Ascent/Ascent', queueId: 'competitive', gameStartMillis: 0 },
      players: [{ puuid, teamId: 'Red', characterId: 'AGENT-1', competitiveTier: 18, stats: { kills: 10, deaths: 5, assists: 2, score: 3000, roundsPlayed: 15 } }],
      teams: [{ teamId: 'Red', won: true }, { teamId: 'Blue', won: false }],
      roundResults: [],
    })
  }
  if (url.pathname === '/val/content/v1/contents') return json({ characters: [{ id: 'AGENT-1', name: 'Jett' }] })
  return json({ status: 'not found' }, 404)
}
let lastSyncedPuuid = null

const { db, log, realFetch } = installFakeSupabase({
  supabaseHost: 'supabase.test',
  serviceKey: SERVICE_KEY,
  users: USERS,
  handlers: [
    (url, init) => {
      if (url.pathname.startsWith('/val/match/v1/matchlists/by-puuid/')) lastSyncedPuuid = decodeURIComponent(url.pathname.split('/').pop())
      return fakeRiot(url, init)
    },
  ],
})

const { app } = await import('./index.js')
let server, base
before(() => new Promise((resolve) => {
  server = app.listen(0, '127.0.0.1', () => {
    base = `http://127.0.0.1:${server.address().port}`
    resolve()
  })
}))
after(() => server.close())

const conn = (userId) => db.riot_connections.find((c) => c.user_id === userId)
const playerData = (userId) => db.riot_player_data.find((d) => d.user_id === userId)
const cookiePair = (res, name) => res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.startsWith(`${name}=`) && c.length > name.length + 1)

async function start(path, token) {
  const res = await realFetch(`${base}${path}`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} })
  assert.equal(res.status, 200)
  const { url } = await res.json()
  return { state: new URL(url).searchParams.get('state'), cookie: cookiePair(res, 'riot_oauth_nonce') }
}

async function callback({ state, cookie }, code) {
  const res = await realFetch(`${base}/api/riot/callback?code=${code}&state=${encodeURIComponent(state)}`, {
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  })
  return { status: res.status, location: res.headers.get('location'), res }
}

const noDirectTableWrites = () => assert.deepEqual(log.tableDenials.filter((d) => d.role === 'service_role'), [], 'server attempted a direct table access as service_role')

test('link: connect -> callback links the Riot account to the SAME STRATIX user and syncs data', async () => {
  const flow = await start('/api/riot/connect', 'tok-linker')
  const { status, location } = await callback(flow, 'code-A')
  assert.equal(status, 302)
  assert.equal(location, 'http://localhost:5173/profile?riot=connected')

  assert.deepEqual(conn('u-linker'), { user_id: 'u-linker', puuid: 'puuid-A', game_name: 'PlayerA', tag_line: 'NA1', shard: 'na' })
  assert.equal(playerData('u-linker').puuid, 'puuid-A')
  assert.equal(playerData('u-linker').data.stats.matches, 1)
  assert.equal(playerData('u-linker').data.rank.name, 'Diamond 1')
  assert.equal(db.authUsers.size, Object.keys(USERS).length, 'no new STRATIX user was created')
  for (const fn of ['find_user_by_riot_puuid', 'link_riot_account_for_user', 'get_riot_connection_for_user', 'save_riot_player_data_for_user']) {
    assert.ok(log.rpc.some((c) => c.fn === fn && c.role === 'service_role'), fn)
  }
  noDirectTableWrites()
})

test('link: a Riot account already linked to another user is refused, nothing changes', async () => {
  const flow = await start('/api/riot/connect', 'tok-other')
  const { location } = await callback(flow, 'code-A')
  assert.equal(location, 'http://localhost:5173/profile?riot=already_linked')
  assert.equal(conn('u-other'), undefined)
  assert.equal(conn('u-linker').puuid, 'puuid-A')
})

test('callback: forged/missing browser nonce or cancelled consent never links', async () => {
  const before = log.rpc.length
  const flow = await start('/api/riot/connect', 'tok-other')
  assert.match((await callback({ ...flow, cookie: 'riot_oauth_nonce=forged' }, 'code-Z')).location, /riot=failed$/)
  assert.match((await callback({ ...flow, cookie: null }, 'code-Z')).location, /riot=failed$/)
  const cancelled = await realFetch(`${base}/api/riot/callback?error=access_denied&state=${encodeURIComponent(flow.state)}`, { headers: { cookie: flow.cookie }, redirect: 'manual' })
  assert.match(cancelled.headers.get('location'), /riot=cancelled$/)
  assert.equal(log.rpc.length, before, 'no database calls')
  assert.equal(conn('u-other'), undefined)
})

test('sync route refreshes data through the server function; signed-out is 401', async () => {
  db.riot_player_data = db.riot_player_data.filter((d) => d.user_id !== 'u-linker')
  const res = await realFetch(`${base}/api/riot/sync`, { method: 'POST', headers: { Authorization: 'Bearer tok-linker' } })
  assert.equal(res.status, 200)
  assert.equal(playerData('u-linker').data.mostPlayedAgent, 'Jett')
  assert.equal((await realFetch(`${base}/api/riot/sync`, { method: 'POST' })).status, 401)
  noDirectTableWrites()
})

test('sync for a user with no Riot connection reports not_connected and writes nothing', async () => {
  const res = await realFetch(`${base}/api/riot/sync`, { method: 'POST', headers: { Authorization: 'Bearer tok-other' } })
  assert.equal(res.status, 502)
  assert.equal((await res.json()).code, 'not_connected')
  assert.equal(playerData('u-other'), undefined)
})

test('sign in with Riot: an already-linked Riot account signs into that existing user', async () => {
  // Link puuid-B to the loginer first.
  assert.match((await callback(await start('/api/riot/connect', 'tok-loginer'), 'code-B')).location, /riot=connected$/)
  const createsBefore = log.authAdmin.filter((c) => c === 'POST /auth/v1/admin/users').length

  const { status, location, res } = await callback(await start('/api/riot/login'), 'code-B')
  assert.equal(status, 302)
  assert.equal(location, 'http://localhost:5173/auth/riot')
  const ticket = cookiePair(res, 'riot_login_token')
  assert.equal(decodeURIComponent(ticket.split('=')[1]), 'hashed-for-loginer@example.com')
  assert.equal(log.authAdmin.filter((c) => c === 'POST /auth/v1/admin/users').length, createsBefore, 'no duplicate user')

  const session = await realFetch(`${base}/api/riot/session`, { method: 'POST', headers: { cookie: ticket } })
  assert.deepEqual(await session.json(), { tokenHash: 'hashed-for-loginer@example.com' })
})

test('sign in with Riot: a new Riot account creates one STRATIX user and links it', async () => {
  const { location } = await callback(await start('/api/riot/login'), 'code-C')
  assert.equal(location, 'http://localhost:5173/auth/riot')
  const created = [...db.authUsers.values()].find((u) => u.app_metadata?.stratix_auth_provider === 'riot')
  assert.ok(created)
  assert.equal(conn(created.id).puuid, 'puuid-C')
  noDirectTableWrites()
})

test('disconnect removes the connection and its synced data; repeating is harmless', async () => {
  assert.ok(conn('u-linker') && playerData('u-linker'))
  const res = await realFetch(`${base}/api/riot/disconnect`, { method: 'POST', headers: { Authorization: 'Bearer tok-linker' } })
  assert.equal(res.status, 200)
  assert.equal(conn('u-linker'), undefined)
  assert.equal(playerData('u-linker'), undefined)
  assert.equal((await realFetch(`${base}/api/riot/disconnect`, { method: 'POST', headers: { Authorization: 'Bearer tok-linker' } })).status, 200)
  assert.equal((await realFetch(`${base}/api/riot/disconnect`, { method: 'POST' })).status, 401)
  noDirectTableWrites()
})

test('a signed-in user cannot call the Riot server functions or write Riot tables directly', async () => {
  const call = (path, body, method = 'POST') => fetch(`http://supabase.test${path}`, {
    method,
    headers: { Authorization: 'Bearer tok-other', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  for (const [fn, args] of [
    ['link_riot_account_for_user', { p_user_id: 'u-other', p_puuid: 'puuid-B', p_game_name: 'x', p_tag_line: 'y', p_shard: 'na' }],
    ['save_riot_player_data_for_user', { p_user_id: 'u-other', p_puuid: 'x', p_shard: null, p_data: { stats: { matches: 99 } } }],
    ['disconnect_riot_account_for_user', { p_user_id: LOGINER_ID }],
    ['find_user_by_riot_puuid', { p_puuid: 'puuid-B' }],
    ['get_riot_connection_for_user', { p_user_id: LOGINER_ID }],
  ]) {
    assert.equal((await call(`/rest/v1/rpc/${fn}`, args)).status, 403, fn)
  }
  assert.equal((await call('/rest/v1/riot_connections', { user_id: 'u-other', puuid: 'puuid-X' })).status, 403)
  assert.equal(conn(LOGINER_ID).puuid, 'puuid-B', 'other user unaffected')
  assert.equal(conn('u-other'), undefined)
})
