import { useEffect, useRef, useState } from 'react'
import { Bot, Lock, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getCoachResponse } from '../services/ai/coachService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePremium } from '../context/PremiumContext.jsx'
import { useRiot } from '../context/RiotContext.jsx'
import { formatSyncedAt, RiotLinkDisclosure } from '../components/riot/Riot.jsx'
import { PremiumBadge, UpgradeButton } from '../components/premium/PremiumGate.jsx'
import { useAICoachUsage } from '../hooks/useAICoachUsage.js'
import { useCoachHistory } from '../hooks/useCoachHistory.js'
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

function formatResetIn(resetAt) {
  const minutes = Math.max(1, Math.round((new Date(resetAt).getTime() - Date.now()) / 60000))
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`
}

// Display-only Free allowance, from server-reported usage. The server enforces it.
function FreeUsageMeter({ usage }) {
  const used = Math.min(usage.messageCount ?? 0, usage.limit)
  const left = usage.limit - used
  return (
    <div className="ai-coach-usage-meter" role="status" aria-live="polite">
      <span className="ai-coach-usage-label">Free plan</span>
      <span className="ai-coach-usage-pips" aria-hidden="true">
        {Array.from({ length: usage.limit }, (_, i) => (
          <i key={i} className={i < used ? 'is-used' : ''} />
        ))}
      </span>
      <span className="ai-coach-usage-count">
        <strong>{left}</strong> of {usage.limit} messages left
        {usage.resetAt && used > 0 && <span className="ai-coach-usage-reset"> · resets in {formatResetIn(usage.resetAt)}</span>}
      </span>
      <UpgradeButton variant="ghost" className="ai-coach-usage-cta">Go unlimited</UpgradeButton>
    </div>
  )
}

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
  const { canAccess, isLoading: isPremiumLoading } = usePremium()
  const isPremium = canAccess('ai-coach-unlimited')
  const riot = useRiot()
  const hasPlayerData = riot.status === 'connected' && Boolean(riot.playerData?.stats)
  // Display-only view of the Free quota. /api/ai-coach enforces it
  // server-side (Premium and the count are decided there, not here).
  const usage = useAICoachUsage(user?.id, isPremium, isPremiumLoading)
  // Explicit states, not a single generic `disabled` condition — a
  // disabled composer must always have a matching, visible reason.
  // 'premium' and 'unlocked' both render the normal composer; 'loading'
  // and 'locked' each get their own explicit panel below.
  const usageDisplayState = isPremium
    ? 'premium'
    : usage.status === 'locked'
      ? 'locked'
      : usage.status === 'loading'
        ? 'loading'
        : 'unlocked'
  const chatLimitReached = usageDisplayState === 'locked'
  // Saved conversation for this account (loaded from Supabase, RLS-scoped).
  const { status: historyStatus, messages, setMessages } = useCoachHistory(user?.id)
  const historyLoading = historyStatus === 'loading'
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  // Synchronous guard: two clicks in the same tick both see isTyping=false.
  const sendingRef = useRef(false)
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
    if (!trimmed || isTyping || historyLoading || sendingRef.current) return
    // UX only: the server is the authority and rejects over-limit requests
    // itself (free_limit_reached) whatever this local state says.
    if (chatLimitReached) return

    sendingRef.current = true
    // Also the request id: the server answers and saves each id once.
    const pendingId = crypto.randomUUID()

    setMessages((prev) => [...prev, { id: pendingId, role: 'user', text: trimmed }])
    setInput('')
    setIsTyping(true)

    try {
      const { reply, usage: serverUsage } = await getCoachResponse({ userText: trimmed, requestId: pendingId })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'coach', text: reply }])
      usage.applyServerUsage(serverUsage)
    } catch (err) {
      if (err.code === 'free_limit_reached') {
        // Not sent: take the message back out and return it to the composer
        // so nothing is lost, then show the server-reported lock + countdown.
        setMessages((prev) => prev.filter((m) => m.id !== pendingId))
        setInput(trimmed)
        usage.applyServerUsage(err.usage)
        return
      }
      // Any count for a failed request is refunded server-side.
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'coach', text: err.message || 'Something went wrong. Try again.' },
      ])
    } finally {
      sendingRef.current = false
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
        {/* Mirrors the server-built coach context: player-specific analysis
            only when real Riot data exists, general coaching otherwise. */}
        {hasPlayerData ? (
          <p>
            Player-specific analysis uses your Riot data for {riot.connection.riotId}
            {riot.syncedAt ? ` (synced ${formatSyncedAt(riot.syncedAt)})` : ''}.
          </p>
        ) : (
          <p>
            General VALORANT coaching on aim, utility, positioning, and more.{' '}
            {riot.status === 'connected'
              ? 'Your Riot account is connected, but no match data has synced yet, so answers are general.'
              : 'Connect your Riot account to use player-specific analysis.'}
          </p>
        )}
        {!hasPlayerData && riot.status === 'disconnected' && (
          <>
            <Button variant="secondary" onClick={riot.connect}>Connect Riot</Button>
            <RiotLinkDisclosure />
          </>
        )}
        {isPremium && <PremiumBadge className="ai-coach-unlimited-badge">Unlimited conversations</PremiumBadge>}
      </div>

      <div className="coach-conversation">
        {historyLoading && <div className="ai-coach-usage-loading" role="status">Loading your conversation…</div>}
        {historyStatus === 'error' && (
          <div className="ai-coach-usage-loading" role="alert">
            Couldn&apos;t load your previous conversation. Refresh to try again.
          </div>
        )}
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
        {usageDisplayState === 'locked' && (
          <div className="ai-coach-limit-reached">
            <Lock size={16} />
            <div>
              <strong>Free AI Coach limit reached</strong>
              <p>You&apos;ve used {usage.limit} of {usage.limit} free AI Coach messages. Premium removes the limit.</p>
              <div className="ai-coach-countdown">
                <span className="ai-coach-countdown-label">Next messages available in</span>
                <span className="ai-coach-countdown-value">{formatCountdown(usage.remainingMs)}</span>
              </div>
            </div>
            <UpgradeButton />
          </div>
        )}

        {usageDisplayState === 'unlocked' && <FreeUsageMeter usage={usage} />}

        {usageDisplayState === 'loading' && (
          <div className="ai-coach-usage-loading">
            Checking your AI Coach usage…
          </div>
        )}

        {(usageDisplayState === 'unlocked' || usageDisplayState === 'premium') && (
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
              disabled={isTyping || historyLoading}
              rows={1}
            />
            <div className="coach-composer-actions">
              <span className="coach-composer-hint">Enter to send · Shift+Enter for a new line</span>
              <button
                type="submit"
                className="coach-send-btn"
                aria-label="Send message"
                disabled={isTyping || historyLoading || !input.trim()}
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
