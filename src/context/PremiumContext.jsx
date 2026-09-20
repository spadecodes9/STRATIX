import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'
import { CURRENT_VALORANT_PATCH } from '../data/patch.js'

const PremiumContext = createContext(null)

const DEFAULT_STATE = { plan: 'free', status: 'none', entitlement_type: 'patch', patch_version: null }

// A lifetime entitlement is valid regardless of patch. A normal ("patch")
// entitlement is only valid while its patch_version matches the patch
// STRATIX is currently selling Premium for. Both branches require
// status === 'active' — the actual privilege-granting fact always comes
// from the RLS-protected subscriptions row, never from frontend state.
function computeIsPremium(state) {
  if (state.status !== 'active') return false
  return state.entitlement_type === 'lifetime'
    ? true
    : state.patch_version === CURRENT_VALORANT_PATCH
}

export function PremiumProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState(DEFAULT_STATE)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated || !user?.id) {
      setState(DEFAULT_STATE)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    supabase
      .from('subscriptions')
      .select('plan, status, entitlement_type, patch_version')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) {
          console.error('Failed to load STRATIX subscription state:', error)
          setState(DEFAULT_STATE)
        } else {
          setState(data ?? DEFAULT_STATE)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        if (!mounted) return
        console.error('Failed to load STRATIX subscription state:', error)
        setState(DEFAULT_STATE)
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id])

  return (
    <PremiumContext.Provider
      value={{
        isPremium: computeIsPremium(state),
        plan: state.plan,
        status: state.status,
        entitlementType: state.entitlement_type,
        patchVersion: state.patch_version,
        isLoading,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)

  if (!ctx) {
    throw new Error('usePremium must be used within PremiumProvider')
  }

  return ctx
}
