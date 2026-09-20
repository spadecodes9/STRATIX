import { useEffect, useRef, useState } from 'react'
import { Bot, Lock, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getCoachResponse } from '../services/ai/coachService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePremium } from '../context/PremiumContext.jsx'
import { useAICoachUsage } from '../hooks/useAICoachUsage.js'
import Button from '../components/ui/Button.jsx'
import './AICoach.css'

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const COMPOSER_MAX_HEIGHT = 160

// react-markdown never renders raw HTML/scripts from the source text by
// default (no rehype-raw, no dangerouslySetInnerHTML anywhere here) — this
// only adds an extra guard on links, since a markdown link's URL can still
// contain something like `javascript:`. Anything that isn't a plain
// relative path, http(s), or mailto link renders as inert text instead.
function isSafeHref(href) {
  if (!href) return false
  if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) return true
  return /^(https?:|mailto:)/i.test(href)
}

function MarkdownLink({ href, children, ...props }) {
  if (!isSafeHref(href)) return <span>{children}</span>
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

const markdownComponents = { a: MarkdownLink }

export default function AICoach() {
  const { user } = useAuth()
  const { isPremium, isLoading: isPremiumLoading } = usePremium()
  // Server-backed rate limit: the real gate is the check_and_consume RPC,
  // called from sendMessage before any AI request goes out. This hook only
  // reconstructs/displays that server state — it never grants access itself.
  const usage = useAICoachUsage(user?.id, isPremium, isPremiumLoading)
  const chatLimitReached = !isPremium && usage.status === 'locked'
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  // Auto-grow the composer as the player types, capped at COMPOSER_MAX_HEIGHT.
  // Also runs when `input` is cleared after sending, which collapses it
  // back down to its minimum height.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_HEIGHT)}px`
  }, [input])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return
    if (chatLimitReached) return

    // Authoritative gate: Free users must clear the server-side atomic
    // check BEFORE any AI request goes out. If it's not allowed, stop here
    // — OpenRouter is never called, and no message is appended.
    if (!isPremium) {
      const result = await usage.checkAndConsume()
      if (!result.allowed) return
    }

    // Snapshot history before appending the new user message — this is what
    // gets sent to the backend as conversation context.
    const history = messages

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    try {
      const reply = await getCoachResponse({ history, userText: trimmed, user })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'coach', text: reply }])
    } catch (err) {
      // The AI request failed before producing a response — refund the
      // message this attempt consumed so a failed attempt doesn't cost the
      // user one of their 3 free messages.
      if (!isPremium) await usage.refund()
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'coach', text: err.message || 'Something went wrong. Try again.' },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleComposerKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="page-shell ai-coach-shell">
      <div className="page-header">
        <span className="eyebrow">AI Coach</span>
        <h1>Ask your coach</h1>
        <p>Get personalized VALORANT coaching based on your gameplay, progress, and goals.</p>
        {isPremium && <span className="ai-coach-unlimited-badge">Unlimited conversations · Premium</span>}
      </div>

      <div className="coach-conversation">
        {messages.map((m) => (
          <div key={m.id} className={`coach-message coach-message-${m.role}`}>
            <div className="coach-avatar">
              {m.role === 'coach' ? <Bot size={16} /> : <span>{user.avatarInitials}</span>}
            </div>
            {m.role === 'coach' ? (
              <div className="md-content">
                <ReactMarkdown components={markdownComponents}>{m.text}</ReactMarkdown>
              </div>
            ) : (
              <p>{m.text}</p>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="coach-message coach-message-coach">
            <div className="coach-avatar"><Bot size={16} /></div>
            <p className="coach-typing">Thinking…</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="coach-composer-wrap">
        {chatLimitReached ? (
          <div className="ai-coach-limit-reached">
            <Lock size={16} />
            <div>
              <strong>Free AI Coach limit reached</strong>
              <p>You've used 3 of 3 free AI Coach messages.</p>
              <div className="ai-coach-countdown">
                <span className="ai-coach-countdown-label">Next messages available in</span>
                <span className="ai-coach-countdown-value">{formatCountdown(usage.remainingMs)}</span>
              </div>
            </div>
            <Button variant="primary" to="/premium">Upgrade to Premium</Button>
          </div>
        ) : (
          <form
            className="coach-composer"
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
          >
            <textarea
              ref={textareaRef}
              className="coach-composer-textarea"
              placeholder="Ask about aim, utility, positioning…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleComposerKeyDown}
              disabled={isTyping || (!isPremium && usage.status === 'loading')}
              rows={1}
            />
            <div className="coach-composer-actions">
              <span className="coach-composer-hint">Enter to send · Shift+Enter for a new line</span>
              <button
                type="submit"
                className="coach-send-btn"
                aria-label="Send message"
                disabled={isTyping || !input.trim() || (!isPremium && usage.status === 'loading')}
              >
                <Send size={17} />
              </button>
            </div>
          </form>
        )}

        <p className="ai-coach-footnote">
          STRATIX AI Coach can make mistakes. Confirm high-stakes calls with a coach or teammate.
        </p>
      </div>
    </div>
  )
}
