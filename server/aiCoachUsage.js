// Free-plan AI Coach quota, enforced on the server. Nothing here is read
// from the request body: Premium comes from the user's `subscriptions` row
// (users can read but never write it), and counting/reset/refund happen in
// SQL functions only the service role may execute (see migration
// 20261001000200_server_enforced_ai_coach_usage.sql).
import { adminClient, hasServiceRole } from './supabase.js'

export { hasServiceRole }

// Atomically counts one message (creating the row for a new user, resetting
// an expired window). Returns { allowed, message_count, limit, reset_at }.
// Throws if the quota can't be verified — callers must fail closed.
export async function consumeFreeMessage(userId) {
  const { data, error } = await adminClient().rpc('consume_ai_coach_message_for_user', { p_user_id: userId })
  if (error || !data) throw new Error(error?.message || 'empty usage response')
  return data
}

export async function refundFreeMessage(userId) {
  const { error } = await adminClient().rpc('refund_ai_coach_message_for_user', { p_user_id: userId })
  if (error) console.error('[ai-coach] Usage refund failed:', error.message)
}

// What the browser is told — display only, never read back.
export const publicUsage = (u) => ({
  plan: 'free',
  messageCount: u.message_count,
  limit: u.limit,
  resetAt: u.reset_at,
})
