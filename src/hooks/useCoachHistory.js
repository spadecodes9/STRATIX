import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// ponytail: shows the latest 200 messages; add "load earlier" paging if
// conversations ever get that long. The full history stays in the DB.
const HISTORY_LIMIT = 200

const toChatMessage = (row) => ({ id: row.id, role: row.role === 'assistant' ? 'coach' : 'user', text: row.content })

/**
 * The signed-in user's saved AI Coach conversation (their latest one), read
 * with their own session — RLS only ever returns their rows. Writes happen
 * on the server (/api/ai-coach saves each exchange), never from here.
 *
 * status: 'loading' | 'ready' | 'error'. On error the messages already on
 * screen are kept, never cleared. State is tagged with the user it belongs
 * to, so a different account never sees the previous one's chat.
 */
export function useCoachHistory(userId) {
  const [state, setState] = useState({ userId: null, status: 'loading', messages: [] })

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    supabase
      .from('ai_coach_messages')
      .select('id, role, content, conversation_id')
      .eq('user_id', userId)
      .order('id', { ascending: false })
      .limit(HISTORY_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load AI Coach history:', error.message)
          setState((s) => ({ userId, status: 'error', messages: s.userId === userId ? s.messages : [] }))
          return
        }
        const latest = data[0]?.conversation_id
        setState({ userId, status: 'ready', messages: data.filter((m) => m.conversation_id === latest).reverse().map(toChatMessage) })
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const setMessages = useCallback(
    (update) => setState((s) => ({ ...s, messages: typeof update === 'function' ? update(s.messages) : update })),
    []
  )

  const current = state.userId === userId
  return { status: current ? state.status : 'loading', messages: current ? state.messages : [], setMessages }
}
