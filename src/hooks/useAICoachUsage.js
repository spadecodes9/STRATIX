import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const TICK_MS = 1000

/**
 * Server-backed AI Coach rate-limit state for Free users. The 3-message /
 * 24-hour window lives entirely in the `ai_coach_usage` table, read here
 * (RLS-protected, own row only) to reconstruct the locked/unlocked state on
 * mount, and mutated exclusively through the `check_and_consume_ai_coach_message`
 * / `refund_ai_coach_message` RPCs — this hook never writes the table
 * directly, and never invents its own 24h timer as the source of truth.
 *
 * Premium users never touch the table: `status` resolves straight to
 * 'unlocked' and `checkAndConsume`/`refund` are no-ops.
 */
export function useAICoachUsage(userId, isPremium, isPremiumLoading) {
  const [state, setState] = useState({ status: 'loading', resetAt: null, messageCount: null })
  const [remainingMs, setRemainingMs] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => () => { mountedRef.current = false }, [])

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
        const locked = withinWindow && data.message_count >= 3

        setState({
          status: locked ? 'locked' : 'unlocked',
          resetAt: withinWindow ? new Date(resetAtMs).toISOString() : null,
          messageCount: data.message_count,
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

  const checkAndConsume = useCallback(async () => {
    if (isPremium) return { allowed: true }

    const { data, error } = await supabase.rpc('check_and_consume_ai_coach_message')

    if (error || !data) {
      // Fail closed: an unreadable usage check should not grant a message.
      return { allowed: false, error: error ?? new Error('No response from usage check') }
    }

    setState({
      status: data.allowed ? 'unlocked' : 'locked',
      resetAt: data.reset_at,
      messageCount: data.message_count,
    })

    return { allowed: data.allowed, resetAt: data.reset_at }
  }, [isPremium])

  const refund = useCallback(async () => {
    if (isPremium) return
    const { error } = await supabase.rpc('refund_ai_coach_message')
    if (error) {
      console.error('Failed to refund AI Coach usage after a failed request:', error)
      return
    }
    loadUsage()
  }, [isPremium, loadUsage])

  return {
    status: state.status,
    messageCount: state.messageCount,
    resetAt: state.resetAt,
    remainingMs,
    checkAndConsume,
    refund,
  }
}
