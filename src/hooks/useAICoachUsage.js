import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { FREE_AI_COACH_LIMIT } from '../lib/entitlement.js'

const TICK_MS = 1000

/**
 * DISPLAY-ONLY view of the Free-plan AI Coach quota (3 messages / 24h).
 *
 * Enforcement lives entirely on the server: /api/ai-coach decides Premium
 * from the subscriptions row and counts each message with a SQL function
 * only the backend can call. This hook never grants or consumes anything —
 * it reads the user's own ai_coach_usage row (RLS, read-only) on mount, and
 * applies the usage the server returns with each reply via `applyServerUsage`.
 */
export function useAICoachUsage(userId, isPremium, isPremiumLoading) {
  const [state, setState] = useState({ status: 'loading', resetAt: null, messageCount: null })
  const [remainingMs, setRemainingMs] = useState(0)
  const mountedRef = useRef(true)

  // Reset on every (re-)mount, not just on the initial useRef() value — under
  // React 18 StrictMode's dev-mode mount/cleanup/remount cycle, the synthetic
  // cleanup below flips this to false once; without resetting it here on the
  // remount, it stays false forever and every subsequent loadUsage() result
  // gets silently discarded, leaving `state` stuck at its initial 'loading'
  // value. This is what caused the composer to disable without the cooldown
  // panel ever rendering.
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const loadUsage = useCallback(() => {
    if (!userId) return

    supabase
      .from('ai_coach_usage')
      .select('message_count, window_started_at')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mountedRef.current) return

        if (error || !data) {
          setState({ status: 'unlocked', resetAt: null, messageCount: data?.message_count ?? 0 })
          return
        }

        const resetAtMs = new Date(data.window_started_at).getTime() + 24 * 60 * 60 * 1000
        const withinWindow = Date.now() < resetAtMs
        const locked = withinWindow && data.message_count >= FREE_AI_COACH_LIMIT

        // An expired window is a fresh allowance (the server resets it on the
        // next message), so don't show the stale count.
        setState({
          status: locked ? 'locked' : 'unlocked',
          resetAt: withinWindow ? new Date(resetAtMs).toISOString() : null,
          messageCount: withinWindow ? data.message_count : 0,
        })
      })
  }, [userId])

  useEffect(() => {
    if (isPremiumLoading) return

    if (isPremium) {
      setState({ status: 'unlocked', resetAt: null, messageCount: null })
      return
    }

    if (!userId) return

    setState({ status: 'loading', resetAt: null, messageCount: null })
    loadUsage()
  }, [isPremium, isPremiumLoading, userId, loadUsage])

  // Live countdown, ticking from the server-provided reset_at. When it
  // reaches zero, re-check the server state (per spec: "refresh/recheck",
  // not just trust the local clock) rather than optimistically unlocking.
  useEffect(() => {
    if (state.status !== 'locked' || !state.resetAt) {
      setRemainingMs(0)
      return
    }

    const resetAtMs = new Date(state.resetAt).getTime()
    const tick = () => {
      const remaining = resetAtMs - Date.now()
      setRemainingMs(Math.max(0, remaining))
      if (remaining <= 0) {
        loadUsage()
      }
    }

    tick()
    const interval = window.setInterval(tick, TICK_MS)
    return () => window.clearInterval(interval)
  }, [state.status, state.resetAt, loadUsage])

  // Usage reported by /api/ai-coach (after a reply, or with a
  // free_limit_reached rejection). Display only.
  const applyServerUsage = useCallback((usage) => {
    if (!usage || usage.plan !== 'free') return
    const withinWindow = usage.resetAt && Date.now() < new Date(usage.resetAt).getTime()
    setState({
      status: withinWindow && usage.messageCount >= usage.limit ? 'locked' : 'unlocked',
      resetAt: withinWindow ? usage.resetAt : null,
      messageCount: usage.messageCount,
    })
  }, [])

  return {
    status: state.status,
    messageCount: state.messageCount,
    limit: FREE_AI_COACH_LIMIT,
    resetAt: state.resetAt,
    remainingMs,
    applyServerUsage,
  }
}
