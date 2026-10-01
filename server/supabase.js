// Server-side Supabase access. Two kinds of client, never mixed up:
//
//   userClient(token) — acts AS the signed-in user: RLS applies, so it can
//                        only read that user's own rows. Safe to trust for
//                        tables users cannot write (subscriptions, Riot data).
//   adminClient()     — service role, bypasses RLS. Server-only writes
//                        (usage counting, Riot linking). The key never leaves
//                        this process.
import { createClient } from '@supabase/supabase-js'

const env = process.env
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY

export const hasSupabase = () => Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
export const hasServiceRole = () => Boolean(SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)

const NO_SESSION = { persistSession: false, autoRefreshToken: false }

export const adminClient = () => createClient(SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: NO_SESSION })

export const userClient = (token) =>
  createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: NO_SESSION,
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

// Verifies the request's Supabase access token with Supabase Auth. Returns
// { user, token } or null. The user's identity comes only from here.
export async function getUserFromRequest(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token || !hasSupabase()) return null
  const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: NO_SESSION })
  const { data, error } = await client.auth.getUser(token)
  return error || !data?.user ? null : { user: data.user, token }
}
