import { useEffect, useRef, useState } from 'react'
import { Bot, Lock, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getCoachResponse } from '../services/ai/coachService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePremium } from '../context/PremiumContext.jsx'
import Button from '../components/ui/Button.jsx'
import './AICoach.css'

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
  const { isPremium } = usePremium()
  const FREE_CHAT_LIMIT = 3
  // TEMPORARY: this counter is client-side React state only — it resets on
  // reload and is not abuse-resistant. It exists to demonstrate the paywall
  // UX. isPremium above is the real, server-verified entitlement check and
  // is never affected by this counter. Real enforcement needs a
  // server-persisted usage count checked by server/index.js before it calls
  // OpenRouter — see docs/superpowers/specs/2026-09-20-premium-hub-and-theme-system-design.md §4.
  const [freeChatCount, setFreeChatCount] = useState(0)
  const chatLimitReached = !isPremium && freeChatCount >= FREE_CHAT_LIMIT
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

    // Snapshot history before appending the new user message — this is what
    // gets sent to the backend as conversation context.
    const history = messages

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed }])
    if (!isPremium) setFreeChatCount((count) => count + 1)
    setInput('')
    setIsTyping(true)

    try {
      const reply = await getCoachResponse({ history, userText: trimmed, user })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'coach', text: reply }])
    } catch (err) {
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
              <strong>Free chat limit reached</strong>
              <p>You've used your 3 free AI Coach chats. Upgrade to Premium for unlimited conversations.</p>
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
              disabled={isTyping}
              rows={1}
            />
            <div className="coach-composer-actions">
              <span className="coach-composer-hint">Enter to send · Shift+Enter for a new line</span>
              <button
                type="submit"
                className="coach-send-btn"
                aria-label="Send message"
                disabled={isTyping || !input.trim()}
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
