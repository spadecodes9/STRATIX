import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'
import { canAccess, canUseTheme, computeIsPremium } from '../lib/entitlement.js'

const PremiumContext = createContext(null)

const DEFAULT_STATE = { plan: 'free', status: 'none', entitlement_type: 'patch', patch_version: null }

// Display only — the server re-derives Premium itself from the same
// subscriptions row before granting anything (see server/aiCoachUsage.js).
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

  const isPremium = computeIsPremium(state)

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        // Components ask these instead of hardcoding access. Display only —
        // each gated feature is enforced again on the server.
        canAccess: (feature) => canAccess(feature, isPremium),
        canUseTheme: (theme) => canUseTheme(theme, isPremium),
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
