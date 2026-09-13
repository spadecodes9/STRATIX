import { useEffect, useRef, useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { suggestedPrompts, seedConversation } from '../data/aiCoach.js'
import { getCoachResponse } from '../services/ai/coachService.js'
import { useAuth } from '../context/AuthContext.jsx'
import './AICoach.css'

// Turns the structured { intro, points, recommendation, followUp } reply from
// coachService into the single display string the existing chat bubble UI
// expects, so the message-rendering markup below doesn't need to change.
function formatCoachReply({ intro, points, recommendation, followUp }) {
  const parts = [intro, ...(points || [])]
  if (recommendation) {
    parts.push(`Recommended: ${recommendation.title} — ${recommendation.subtitle}`)
  }
  if (followUp) parts.push(followUp)
  return parts.filter(Boolean).join(' ')
}

export default function AICoach() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(seedConversation)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    // Snapshot history before appending the new user message — coachService's
    // mock engine uses this to detect topic continuations across turns.
    const history = messages

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    try {
      const reply = await getCoachResponse({ history, userText: trimmed, user })
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'coach',
          text: formatCoachReply(reply),
          category: reply.category,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="page-shell ai-coach-shell">
      <div className="page-header">
        <span className="eyebrow">AI Coach · Preview</span>
        <h1>Ask your coach</h1>
        <p>Frontend mock for now — replies are pre-written based on keywords, not a live model.</p>
      </div>

      <div className="coach-panel">
        <div className="coach-messages" ref={scrollRef}>
          {messages.map((m) => (
            <div key={m.id} className={`coach-message coach-message-${m.role}`}>
              <div className="coach-avatar">
                {m.role === 'coach' ? <Bot size={16} /> : <span>{user.avatarInitials}</span>}
              </div>
              <p>{m.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="coach-message coach-message-coach">
              <div className="coach-avatar"><Bot size={16} /></div>
              <p className="coach-typing">Thinking…</p>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="prompt-suggestions">
            {suggestedPrompts.map((p) => (
              <button key={p} className="prompt-chip" onClick={() => sendMessage(p)}>
                {p}
              </button>
            ))}
          </div>
        )}

        <form
          className="coach-input-row"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
        >
          <input
            type="text"
            placeholder="Ask about aim, utility, positioning…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="coach-send-btn" aria-label="Send message">
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  )
}
