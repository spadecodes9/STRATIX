// Test-only fake of the Supabase edges the server talks to, enforcing the SAME
// permission model as the real project (verified live on 2026-10-01):
//
//   service_role   — NO table privileges on public tables (REST -> 403 42501);
//                    EXECUTE only on the server functions below; Auth admin API ok.
//   authenticated  — SELECT on its own rows only (RLS); no table writes; may NOT
//                    execute any server function.
//   anon           — nothing.
//
// The SQL functions are emulated with the same semantics as the migrations
// (20261001000200 / 20261001000400), which were exercised on the live DB.
// Install before importing server code; returns the in-memory store.

const SERVICE_ONLY_FUNCTIONS = new Set([
  'consume_ai_coach_message_for_user',
  'refund_ai_coach_message_for_user',
  'set_profile_theme_for_user',
  'find_user_by_riot_puuid',
  'link_riot_account_for_user',
  'get_riot_connection_for_user',
  'save_riot_player_data_for_user',
  'disconnect_riot_account_for_user',
  'find_riot_only_user',
])
const USER_READABLE_TABLES = new Set(['profiles', 'subscriptions', 'ai_coach_usage', 'riot_connections', 'riot_player_data'])
const THEMES = ['red', 'blue', 'green', 'gold']
const SHARDS = ['na', 'eu', 'ap', 'kr', 'latam', 'br']
const LIMIT = 3
const WINDOW_MS = 24 * 60 * 60 * 1000

// `now` stands in for the database clock (synced_at), so tests can move time.
export function installFakeSupabase({ supabaseHost, serviceKey, users, seed = {}, handlers = [], now = () => Date.now() }) {
  const realFetch = globalThis.fetch
  const db = {
    profiles: seed.profiles ?? [],
    subscriptions: seed.subscriptions ?? [],
    riot_connections: seed.riot_connections ?? [],
    riot_player_data: seed.riot_player_data ?? [],
    usage: new Map(), // userId -> { count, windowStart }
    authUsers: new Map(Object.values(users).map((u) => [u.id, u])),
  }
  const log = { rpc: [], tableDenials: [], model: [], authAdmin: [] }

  const json = (body, status = 200) =>
    new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  const denied = (status = 403) => json({ code: '42501', message: 'permission denied' }, status)
  const sqlError = (code, message) => json({ code, message }, 400)

  // --- SQL function emulation (same semantics as the migrations) -----------
  const fns = {
    consume_ai_coach_message_for_user({ p_user_id }) {
      const now = Date.now()
      let row = db.usage.get(p_user_id)
      if (!row) db.usage.set(p_user_id, (row = { count: 0, windowStart: now }))
      const result = (allowed) => ({ allowed, message_count: row.count, limit: LIMIT, reset_at: new Date(row.windowStart + WINDOW_MS).toISOString() })
      if (now >= row.windowStart + WINDOW_MS) {
        row.count = 1
        row.windowStart = now
        return result(true)
      }
      if (row.count >= LIMIT) return result(false)
      row.count += 1
      return result(true)
    },
    refund_ai_coach_message_for_user({ p_user_id }) {
      const row = db.usage.get(p_user_id)
      if (row) row.count = Math.max(row.count - 1, 0)
      return null
    },
    set_profile_theme_for_user({ p_user_id, p_theme }) {
      if (!THEMES.includes(p_theme)) throw ['22023', 'invalid theme']
      const row = db.profiles.find((p) => p.id === p_user_id)
      if (!row) return false
      row.theme = p_theme
      return true
    },
    find_user_by_riot_puuid({ p_puuid }) {
      return db.riot_connections.find((c) => c.puuid === p_puuid)?.user_id ?? null
    },
    link_riot_account_for_user({ p_user_id, p_puuid, p_game_name, p_tag_line, p_shard }) {
      if (!p_user_id || !p_puuid?.trim()) throw ['22004', 'user id and puuid required']
      if (p_shard != null && !SHARDS.includes(p_shard)) throw ['22023', 'invalid shard']
      const owner = db.riot_connections.find((c) => c.puuid === p_puuid)
      if (owner && owner.user_id !== p_user_id) return 'already_linked'
      const mine = db.riot_connections.find((c) => c.user_id === p_user_id)
      if (mine) Object.assign(mine, { puuid: p_puuid, game_name: p_game_name, tag_line: p_tag_line, shard: p_shard ?? mine.shard })
      else db.riot_connections.push({ user_id: p_user_id, puuid: p_puuid, game_name: p_game_name, tag_line: p_tag_line, shard: p_shard })
      db.riot_player_data = db.riot_player_data.filter((d) => !(d.user_id === p_user_id && d.puuid !== p_puuid))
      return 'linked'
    },
    get_riot_connection_for_user({ p_user_id }) {
      return db.riot_connections.filter((c) => c.user_id === p_user_id).map(({ puuid, shard }) => ({ puuid, shard }))
    },
    save_riot_player_data_for_user({ p_user_id, p_puuid, p_shard, p_data }) {
      if (!p_data || typeof p_data !== 'object' || Array.isArray(p_data)) throw ['22023', 'player data must be a JSON object']
      if (p_shard != null && !SHARDS.includes(p_shard)) throw ['22023', 'invalid shard']
      const conn = db.riot_connections.find((c) => c.user_id === p_user_id && c.puuid === p_puuid)
      if (!conn) return false
      conn.shard = p_shard ?? conn.shard
      db.riot_player_data = db.riot_player_data.filter((d) => d.user_id !== p_user_id)
      db.riot_player_data.push({ user_id: p_user_id, puuid: p_puuid, data: p_data, synced_at: new Date(now()).toISOString() })
      return true
    },
    // Same rules as migration 20261001000500: placeholder domain AND created via Riot.
    find_riot_only_user({ p_email }) {
      const email = String(p_email).toLowerCase()
      if (!email.endsWith('@riot-users.stratix.invalid')) return null
      for (const u of db.authUsers.values()) {
        if (u.email === email && u.app_metadata?.stratix_auth_provider === 'riot') return u.id
      }
      return null
    },
    disconnect_riot_account_for_user({ p_user_id }) {
      const before = db.riot_connections.length
      db.riot_connections = db.riot_connections.filter((c) => c.user_id !== p_user_id)
      db.riot_player_data = db.riot_player_data.filter((d) => d.user_id !== p_user_id) // FK cascade
      return db.riot_connections.length < before
    },
  }

  const tableRows = (table) => (table === 'ai_coach_usage'
    ? [...db.usage].map(([user_id, r]) => ({ user_id, message_count: r.count, window_started_at: new Date(r.windowStart).toISOString() }))
    : db[table] ?? [])

  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url)
    if (url.hostname === '127.0.0.1') return realFetch(input, init)

    for (const handler of handlers) {
      const res = await handler(url, init)
      if (res) return res
    }

    if (url.hostname !== supabaseHost) throw new Error(`Unexpected outbound request: ${url}`)

    const token = new Headers(init.headers).get('authorization')?.replace('Bearer ', '')
    const role = token === serviceKey ? 'service_role' : users[token] ? 'authenticated' : 'anon'
    const user = users[token]
    const method = init.method || 'GET'
    const path = url.pathname

    // Supabase Auth
    if (path === '/auth/v1/user') return user ? json(user) : json({ msg: 'invalid JWT' }, 401)
    if (path.startsWith('/auth/v1/admin/')) {
      if (role !== 'service_role') return json({ msg: 'forbidden' }, 403)
      log.authAdmin.push(`${method} ${path}`)
      if (path === '/auth/v1/admin/users' && method === 'POST') {
        const body = JSON.parse(init.body)
        // Real Supabase Auth refuses a second user with the same email.
        if ([...db.authUsers.values()].some((u) => u.email === String(body.email).toLowerCase())) {
          return json({ code: 'email_exists', msg: 'A user with this email address has already been registered' }, 422)
        }
        const created = { id: crypto.randomUUID(), email: String(body.email).toLowerCase(), app_metadata: body.app_metadata, user_metadata: body.user_metadata }
        db.authUsers.set(created.id, created)
        return json(created)
      }
      const byId = path.match(/^\/auth\/v1\/admin\/users\/([^/]+)$/)
      if (byId && method === 'GET') {
        const found = db.authUsers.get(byId[1])
        return found ? json(found) : json({ msg: 'not found' }, 404)
      }
      if (path === '/auth/v1/admin/generate_link' && method === 'POST') {
        const body = JSON.parse(init.body)
        return json({ action_link: 'x', email_otp: 'x', hashed_token: `hashed-for-${body.email}`, redirect_to: '', verification_type: 'magiclink' })
      }
      return json({ msg: 'not found' }, 404)
    }

    // PostgREST functions
    if (path.startsWith('/rest/v1/rpc/')) {
      const fn = path.slice('/rest/v1/rpc/'.length)
      log.rpc.push({ fn, role })
      if (!SERVICE_ONLY_FUNCTIONS.has(fn) || role !== 'service_role') return denied(role === 'anon' ? 401 : 403)
      try {
        return json(fns[fn](JSON.parse(init.body || '{}')))
      } catch (e) {
        if (Array.isArray(e)) return sqlError(...e)
        throw e
      }
    }

    // PostgREST tables
    if (path.startsWith('/rest/v1/')) {
      const table = path.slice('/rest/v1/'.length)
      if (role !== 'authenticated' || method !== 'GET' || !USER_READABLE_TABLES.has(table)) {
        log.tableDenials.push({ table, role, method })
        return denied(role === 'anon' ? 401 : 403)
      }
      const ownKey = table === 'profiles' ? 'id' : 'user_id'
      return json(tableRows(table).filter((r) => r[ownKey] === user.id)) // RLS: own rows only
    }

    throw new Error(`Unexpected Supabase request: ${method} ${path}`)
  }

  return { db, log, realFetch }
}
