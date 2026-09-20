// STRATIX AI Coach backend.
//
// The ONLY thing this server does is: receive a conversation from the
// frontend, attach the STRATIX system prompt, and call OpenRouter with the
// server-side API key. The key never reaches the browser. The frontend only
// ever talks to this server, never to OpenRouter directly.
//
// Run standalone with `npm run dev:server`, or alongside the Vite dev
// server with `npm run dev:all` (see package.json).

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  OPENROUTER_MODEL,
  OPENROUTER_API_URL,
  SYSTEM_PROMPT,
  MAX_HISTORY_MESSAGES,
} from './config.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:5178'

app.post('/api/ai-coach', async (req, res) => {
  if (!OPENROUTER_API_KEY) {
    console.error('[ai-coach] Missing OPENROUTER_API_KEY — set it in your .env file.')
    return res.status(500).json({
      error: "AI Coach isn't configured yet — the server is missing its OpenRouter API key.",
    })
  }

  const { messages, context } = req.body || {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'A message is required.' })
  }

  const chatMessages = messages
    .filter(
      (m) =>
        m &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0 &&
        (m.role === 'user' || m.role === 'assistant')
    )
    .slice(-MAX_HISTORY_MESSAGES)

  if (chatMessages.length === 0) {
    return res.status(400).json({ error: 'A message is required.' })
  }

  let systemPrompt = SYSTEM_PROMPT
  if (context && typeof context === 'object' && Object.keys(context).length > 0) {
    systemPrompt += `\n\nKnown player context for this session (only reference this if it's actually relevant to the question — do not invent anything beyond it):\n${JSON.stringify(
      context
    )}`
  }

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
      console.error('[ai-coach] OpenRouter error', upstream.status, detail)

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
      console.error('[ai-coach] Empty or malformed response from OpenRouter:', data)
      return res.status(502).json({
        error: 'AI Coach got an empty response back. Try rephrasing your question.',
      })
    }

    return res.json({ reply })
  } catch (err) {
    console.error('[ai-coach] Request failed:', err)
    return res.status(500).json({
      error: 'AI Coach ran into an unexpected error. Try again.',
    })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 8787
app.listen(PORT, () => {
  console.log(`STRATIX AI Coach backend listening on http://localhost:${PORT}`)
})
