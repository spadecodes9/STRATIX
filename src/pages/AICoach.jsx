import { useEffect, useRef, useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { suggestedPrompts, seedConversation, getMockCoachReply } from '../data/aiCoach.js'
import { useAuth } from '../context/AuthContext.jsx'
import './AICoach.css'

export default function AICoach() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(seedConversation)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const reply = getMockCoachReply(trimmed)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'coach', text: reply }])
      setIsTyping(false)
    }, 700)
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
