// STRATIX backend: AI Coach proxy + Riot Sign On routes.
//
// /api/ai-coach pipeline (every step server-side, nothing trusted from the
// browser except the chat text itself):
//   verify Supabase session -> per-user rate limit -> validate body
//   -> Premium from the user's subscriptions row -> Free: consume 1 of 3
//      (server-side SQL, rejects at the limit) -> build player context from
//      DB for THAT user -> OpenRouter -> reply (refund the count on failure)
// The OpenRouter key never reaches the browser.
//
// Run standalone with `npm run dev:server`, or alongside the Vite dev
// server with `npm run dev:all` (see package.json).

// Must be the first import: ES modules evaluate imports before this file's
// body, so config.js / riot.js would otherwise read process.env before .env
// is loaded.
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  OPENROUTER_MODEL,
  OPENROUTER_API_URL,
  SYSTEM_PROMPT,
  MAX_HISTORY_MESSAGES,
} from './config.js'
import { fileURLToPath } from 'node:url'
import { APP_URL, NO_PLAYER_DATA, registerRiotRoutes, getCoachPlayerContext } from './riot.js'
import { getUserFromRequest } from './supabase.js'
import { consumeFreeMessage, hasServiceRole, publicUsage, refundFreeMessage } from './aiCoachUsage.js'
import { isPremiumUser, registerPremiumRoutes } from './premium.js'
import { canAccess } from '../src/lib/entitlement.js'

export const app = express()
// Browsers may only call this API from the STRATIX frontend (dev uses the
// same-origin Vite proxy, so this never blocks local development).
app.use(cors({ origin: APP_URL }))
app.use(express.json({ limit: '100kb' }))

const MAX_INCOMING_MESSAGES = 50
const MAX_MESSAGE_CHARS = 12000

// ponytail: in-memory per-user limiter — per process, resets on restart.
// Move to the DB (or Redis) if the server ever runs as multiple instances.
// Abuse protection only; the Free-plan 3-per-24h quota is separate.
const RATE_LIMIT = { max: 8, windowMs: 60_000 }
const recentRequests = new Map()

export function rateLimited(userId, now = Date.now()) {
  const recent = (recentRequests.get(userId) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  const limited = recent.length >= RATE_LIMIT.max
  if (!limited) recent.push(now)
  recentRequests.set(userId, recent)
  return limited
}

// Accepts only { messages: [{ role: 'user'|'assistant', content: string }] }
// ending in a user message. Any other body fields (riotConnected, playerData,
// userId, context, isPremium, messageCount, resetAt, ...) are ignored —
// never read.
function parseMessages(body) {
  const messages = body && typeof body === 'object' ? body.messages : null
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_INCOMING_MESSAGES) return null
  const valid = messages.every(
    (m) =>
      m &&
      typeof m === 'object' &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0 &&
      m.content.length <= MAX_MESSAGE_CHARS
  )
  if (!valid || messages.at(-1).role !== 'user') return null
  return messages.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({ role, content }))
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:5178'

app.post('/api/ai-coach', async (req, res) => {
  // 1. Authenticate. The user's identity comes only from the verified
  //    Supabase session token, never from the request body.
  const auth = await getUserFromRequest(req).catch(() => null)
  if (!auth) {
    return res.status(401).json({ error: 'Sign in to use AI Coach.' })
  }

  // 2. Per-user abuse protection.
  if (rateLimited(auth.user.id)) {
    return res.status(429).json({ error: "You're sending messages too fast. Wait a minute and try again." })
  }

  // 3. Validate.
  const chatMessages = parseMessages(req.body)
  if (!chatMessages) {
    return res.status(400).json({ error: 'That message could not be sent. Try a shorter message.' })
  }

  if (!OPENROUTER_API_KEY) {
    console.error('[ai-coach] Missing OPENROUTER_API_KEY — set it in your .env file.')
    return res.status(500).json({
      error: "AI Coach isn't configured yet — the server is missing its OpenRouter API key.",
    })
  }

  // 4. Free-plan quota. Premium status and the count both come from the
  //    database, never from the request.
  const premium = canAccess('ai-coach-unlimited', await isPremiumUser(auth))
  let usage = null
  if (!premium) {
    if (!hasServiceRole()) {
      console.error('[ai-coach] SUPABASE_SERVICE_ROLE_KEY is not set — cannot enforce the Free limit, refusing.')
      return res.status(503).json({ error: "AI Coach isn't fully configured yet. Try again later." })
    }
    try {
      usage = await consumeFreeMessage(auth.user.id)
    } catch (err) {
      console.error('[ai-coach] Usage check failed:', err.message)
      return res.status(503).json({ error: "Couldn't verify your AI Coach usage. Try again in a moment." })
    }
    if (!usage.allowed) {
      return res.status(429).json({
        error: "You've used all 3 free AI Coach messages for now.",
        code: 'free_limit_reached',
        usage: publicUsage(usage),
      })
    }
  }
  const usageForClient = premium ? { plan: 'premium' } : publicUsage(usage)

  // 5. Player context, built from the DB for the verified user only — the
  //    model sees server-verified Riot data or an explicit "no player data".
  let playerContext
  try {
    playerContext = await getCoachPlayerContext(auth)
  } catch (err) {
    console.error('[ai-coach] Failed to load player context:', err.message)
    playerContext = NO_PLAYER_DATA
  }
  const systemPrompt = `${SYSTEM_PROMPT}

Player context (authoritative, server-verified):
${JSON.stringify(playerContext)}`

  // The counted message is refunded (server-side) if no reply is delivered.
  let delivered = false
  try {
    const upstream = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': 'STRATIX AI Coach',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      console.error('[ai-coach] OpenRouter error', upstream.status, detail.slice(0, 500))

      if (upstream.status === 401 || upstream.status === 403) {
        return res.status(502).json({
          error: "AI Coach couldn't authenticate with its model provider. Check the server's API key.",
        })
      }
      if (upstream.status === 429) {
        return res.status(429).json({
          error: 'AI Coach is getting rate-limited right now. Wait a moment and try again.',
        })
      }
      return res.status(502).json({
        error: "AI Coach couldn't reach its model provider. Try again in a moment.",
      })
    }

    const data = await upstream.json().catch(() => null)
    const reply = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      console.error('[ai-coach] Empty or malformed response from OpenRouter')
      return res.status(502).json({
        error: 'AI Coach got an empty response back. Try rephrasing your question.',
      })
    }

    delivered = true
    return res.json({ reply, usage: usageForClient })
  } catch (err) {
    console.error('[ai-coach] Request failed:', err.message)
    return res.status(500).json({
      error: 'AI Coach ran into an unexpected error. Try again.',
    })
  } finally {
    if (usage && !delivered) await refundFreeMessage(auth.user.id)
  }
})

registerRiotRoutes(app)
registerPremiumRoutes(app)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Listen only when run directly (tests import `app` without binding a port).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 8787
  app.listen(PORT, () => {
    console.log(`STRATIX AI Coach backend listening on http://localhost:${PORT}`)
  })
}
