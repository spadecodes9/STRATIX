import { supabase } from '../../lib/supabase.js'

const AI_COACH_ENDPOINT = '/api/ai-coach'

/**
 * AI Coach service abstraction.
 *
 * This is the ONLY function the AI Coach page calls to get a reply. It posts
 * the conversation to STRATIX's own backend (server/index.js), which adds
 * the system prompt and calls OpenRouter server-side. No model provider is
 * ever called directly from the browser, and no API key ever reaches
 * client code.
 *
 * No player data is sent from here. The backend builds the player context
 * itself from the caller's verified session — real Riot data if a Riot
 * account is connected, an explicit `riotConnected: false` otherwise.
 *
 * Only the new message is sent: the server builds the conversation context
 * from the user's saved history and saves this exchange once it has a reply.
 *
 * @param {object} params
 * @param {string} params.userText  - the player's new message
 * @param {string} params.requestId - a UUID per send; a retry with the same id
 *                                    is answered and stored only once
 *
 * The server also enforces the Free-plan limit and reports usage back.
 * That usage is for display only; the browser never sends it.
 *
 * @returns {Promise<{ reply: string, usage: object | null }>}
 * @throws {Error} with a user-facing message if the request fails. When the
 *   Free limit is reached, the error has `code: 'free_limit_reached'` and
 *   `usage` (server-provided count + reset time).
 */
export async function getCoachResponse({ userText, requestId }) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let response
  try {
    response = await fetch(AI_COACH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: userText }], requestId }),
    })
  } catch {
    throw new Error("Couldn't reach the AI Coach. Check your connection and try again.")
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Leave data as null — handled by the checks below.
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'AI Coach ran into an issue. Try again in a moment.')
    error.code = data?.code ?? null
    error.usage = data?.usage ?? null
    throw error
  }

  if (!data?.reply) {
    throw new Error('AI Coach did not return a response. Try again.')
  }

  return { reply: data.reply, usage: data.usage ?? null }
}
