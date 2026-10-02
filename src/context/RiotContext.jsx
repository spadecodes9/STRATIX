import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

// The ONLY place React reads Riot/VALORANT player state. Components never
// call Riot or the Riot backend routes directly.
//
//   status: 'loading' | 'disconnected' | 'connected' | 'error'
//   playerData: synced Riot data ({ rank, stats, recentMatches, mostPlayedAgent })
//               or null — never a placeholder.
const RiotContext = createContext(null)

const EMPTY = { status: 'disconnected', connection: null, playerData: null, syncedAt: null }

const SYNC_MESSAGES = {
  api_unavailable: "Riot match data isn't available to STRATIX yet.",
  unsupported_region: "Your Riot account's region isn't supported yet.",
  rate_limited: 'Riot is rate-limiting requests right now. Try again in a minute.',
  not_connected: 'Riot account not connected.',
  riot_error: 'Unable to load Riot data. Try again.',
}

const formatWait = (seconds) =>
  seconds >= 90 ? `${Math.ceil(seconds / 60)} minutes` : `${Math.max(1, seconds)} seconds`

// The server decides cooldowns; this only words what it reported.
function syncErrorMessage(data) {
  const wait = data?.retryAfterSeconds
  if (data?.code === 'sync_cooldown') return `You synced recently. You can sync again in ${formatWait(wait ?? 60)}.`
  if (data?.code === 'rate_limited' && wait) return `Riot is rate-limiting requests right now. Try again in ${formatWait(wait)}.`
  return SYNC_MESSAGES[data?.code] || data?.error || SYNC_MESSAGES.riot_error
}

// Tables not created yet (migration pending) means "nothing connected",
// not an error worth showing.
const isMissingTable = (error) => error?.code === 'PGRST205' || error?.code === '42P01'

async function riotApi(path) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  try {
    const res = await fetch(`/api/riot/${path}`, {
      method: 'POST',
      headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
    })
    return { ok: res.ok, data: await res.json().catch(() => null) }
  } catch {
    return { ok: false, data: { error: "Couldn't reach STRATIX. Check your connection and try again." } }
  }
}

export function RiotProvider({ children }) {
  const { user } = useAuth()
  const [state, setState] = useState({ ...EMPTY, status: 'loading' })
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)

  const reload = useCallback(async () => {
    if (!user?.id) {
      setState(EMPTY)
      return
    }
    setState((prev) => ({ ...prev, status: 'loading' }))
    const [conn, player] = await Promise.all([
      supabase.from('riot_connections').select('game_name, tag_line, shard').eq('user_id', user.id).maybeSingle(),
      supabase.from('riot_player_data').select('data, synced_at').eq('user_id', user.id).maybeSingle(),
    ])
    if (conn.error) {
      if (isMissingTable(conn.error)) return setState(EMPTY)
      console.error('Failed to load Riot connection:', conn.error)
      return setState({ ...EMPTY, status: 'error' })
    }
    if (!conn.data) return setState(EMPTY)
    setState({
      status: 'connected',
      connection: {
        gameName: conn.data.game_name,
        tagLine: conn.data.tag_line,
        riotId: `${conn.data.game_name}#${conn.data.tag_line}`,
        shard: conn.data.shard,
      },
      playerData: player.data?.data ?? null,
      syncedAt: player.data?.synced_at ?? null,
    })
  }, [user?.id])

  useEffect(() => {
    reload()
  }, [reload])

  const connect = async () => {
    const { ok, data } = await riotApi('connect')
    if (ok && data?.url) return window.location.assign(data.url)
    toast.error(data?.error || "Couldn't start Riot sign-on. Try again.")
  }

  const disconnect = async () => {
    const { ok, data } = await riotApi('disconnect')
    if (!ok) return toast.error(data?.error || "Couldn't disconnect Riot. Try again.")
    // Riot-created accounts keep working: "Continue with Riot" signs them back
    // into this same account (and re-links Riot) — see find_riot_only_user.
    toast.success(
      user?.authProvider === 'riot'
        ? 'Riot account disconnected. Use "Continue with Riot" to sign back in to this account.'
        : 'Riot account disconnected'
    )
    setSyncError(null)
    reload()
  }

  const sync = async () => {
    setSyncing(true)
    setSyncError(null)
    const { ok, data } = await riotApi('sync')
    if (!ok) setSyncError(syncErrorMessage(data))
    await reload()
    setSyncing(false)
  }

  return (
    <RiotContext.Provider value={{ ...state, syncing, syncError, connect, disconnect, sync, reload }}>
      {children}
    </RiotContext.Provider>
  )
}

export function useRiot() {
  const ctx = useContext(RiotContext)
  if (!ctx) throw new Error('useRiot must be used within RiotProvider')
  return ctx
}

const REDIRECT_TOASTS = {
  connected: ['success', 'Riot account connected'],
  already_linked: ['error', 'That Riot account is already linked to a different STRATIX account.'],
  cancelled: ['message', 'Riot sign-on was cancelled.'],
  failed: ['error', "Riot sign-on didn't complete. Try again."],
}

// Shows the outcome the backend RSO callback reports via ?riot=..., once.
export function useRiotRedirectToast() {
  const [params, setParams] = useSearchParams()
  const outcome = params.get('riot')
  useEffect(() => {
    if (!outcome) return
    const [kind, message] = REDIRECT_TOASTS[outcome] || REDIRECT_TOASTS.failed
    toast[kind](message)
    params.delete('riot')
    setParams(params, { replace: true })
  }, [outcome, params, setParams])
}
