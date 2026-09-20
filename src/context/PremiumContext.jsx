import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

const PremiumContext = createContext(null)

const DEFAULT_STATE = { plan: 'free', status: 'none' }

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
      .select('plan, status')
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

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id])

  return (
    <PremiumContext.Provider
      value={{
        isPremium: state.status === 'active',
        plan: state.plan,
        status: state.status,
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
