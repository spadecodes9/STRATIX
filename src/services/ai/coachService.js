import { generateCoachReply } from './mockCoachEngine.js'
import { ACTIVE_GAME } from '../../data/coachKnowledge.js'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * AI Coach service abstraction.
 *
 * This is the ONLY function the AI Coach page calls to get a reply. Right
 * now it delegates to `generateCoachReply`, a rule-based mock — no network
 * request, no API key, nothing leaves the browser.
 *
 * To swap in a real provider later: replace the body of this function with
 * a real call (e.g. POST { history, userText, gameId } to a backend route
 * that talks to a model), while returning the same shape below. Nothing in
 * AICoach.jsx needs to change for that swap — it only depends on this
 * function's signature and return shape, not on how the reply is produced.
 *
 * @param {object} params
 * @param {Array}  params.history  - prior chat messages this session
 * @param {string} params.userText - the player's new message
 * @param {object} params.user     - current mock user profile
 * @param {string} [params.gameId] - which game's coach this is for (v1: 'valorant' only)
 *
 * @returns {Promise<{
 *   category: string,
 *   intro: string,
 *   points: string[],
 *   recommendation: { type: 'course'|'lesson'|'guide', id: string, courseId?: string, title: string, subtitle: string } | null,
 *   followUp: string | null
 * }>}
 */
export async function getCoachResponse({ history, userText, user, gameId = ACTIVE_GAME }) {
  // Simulated "thinking" delay so the typing indicator reads as real latency.
  await wait(550 + Math.random() * 450)

  // v1 only ships a VALORANT knowledge base. `gameId` is threaded through now
  // so a future multi-game version can route to a per-game engine/knowledge
  // base here without touching the UI or this function's contract.
  return generateCoachReply({ history, userText, user, gameId })
}
