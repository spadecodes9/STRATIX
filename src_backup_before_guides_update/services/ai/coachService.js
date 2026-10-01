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
 * @param {object} params
 * @param {Array}  params.history  - prior chat messages this session, each
 *                                   shaped like `{ role: 'user' | 'coach', text: string }`
 * @param {string} params.userText - the player's new message
 * @param {object} [params.user]   - current user profile; only skillMatrix /
 *                                   courseProgress are forwarded, and only
 *                                   if present — nothing is fabricated
 *
 * @returns {Promise<string>} the coach's reply text
 * @throws {Error} with a user-facing message if the request fails
 */
export async function getCoachResponse({ history, userText, user }) {
  const messages = [
    ...history
      .filter((m) => (m.role === 'user' || m.role === 'coach') && m.text?.trim())
      .map((m) => ({ role: m.role === 'coach' ? 'assistant' : 'user', content: m.text })),
    { role: 'user', content: userText },
  ]

  const context = buildPlayerContext(user)

  let response
  try {
    response = await fetch(AI_COACH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
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
    throw new Error(data?.error || 'AI Coach ran into an issue. Try again in a moment.')
  }

  if (!data?.reply) {
    throw new Error('AI Coach did not return a response. Try again.')
  }

  return data.reply
}

// Only forwards player data that's actually known on the user object —
// never padded or invented, since the backend explicitly instructs the
// model not to assume anything beyond what's given here.
function buildPlayerContext(user) {
  if (!user) return null
  const context = {}
  if (Array.isArray(user.skillMatrix)) context.skillMatrix = user.skillMatrix
  if (user.courseProgress) context.courseProgress = user.courseProgress
  return Object.keys(context).length > 0 ? context : null
}
