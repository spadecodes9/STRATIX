// Persistent AI Coach history (migration 20261002000100_ai_coach_history.sql).
// Reads run AS the user (RLS: own rows only). The one write is a
// service-role-only SQL function that stores a user message + reply exactly
// once per request id. The user id always comes from the verified session.
import { adminClient, userClient } from './supabase.js'

// The user's most recent messages in their latest conversation, oldest
// first: [{ role: 'user' | 'assistant', content, request_id }]. Throws on
// failure — callers decide whether to continue without history.
export async function loadRecentMessages(auth, limit) {
  const { data, error } = await userClient(auth.token)
    .from('ai_coach_messages')
    .select('role, content, request_id, conversation_id')
    .eq('user_id', auth.user.id)
    .order('id', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  const latest = data[0]?.conversation_id
  return data.filter((m) => m.conversation_id === latest).reverse()
}

// Returns { inserted, reply }. inserted = false: this request id was already
// saved (retry / double submit) and `reply` is the stored reply.
export async function saveExchange(userId, requestId, userContent, reply) {
  const { data, error } = await adminClient().rpc('save_ai_coach_exchange_for_user', {
    p_user_id: userId,
    p_request_id: requestId,
    p_user_content: userContent,
    p_assistant_content: reply,
  })
  if (error || !data) throw new Error(error?.message || 'empty save response')
  return data
}
