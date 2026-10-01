import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { usePremium } from './PremiumContext.jsx'
import { FREE_THEMES, THEMES } from '../lib/entitlement.js'
import { saveTheme } from '../services/premiumApi.js'

const ThemeContext = createContext(null)

const DEFAULT_THEME = FREE_THEMES[0]

export function ThemeProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const { canUseTheme, isLoading: isEntitlementLoading } = usePremium()
  const [theme, setThemeState] = useState(DEFAULT_THEME)
  const [isSaving, setIsSaving] = useState(false)

  // Load the signed-in user's saved theme once auth and entitlement resolve.
  // A saved Premium theme only applies while the user still has Premium (it
  // stays saved, so it comes back if they renew). Signed-out visitors always
  // see the default theme.
  const savedTheme = user?.preferences?.theme
  const savedThemeAllowed = THEMES.includes(savedTheme) && canUseTheme(savedTheme)
  useEffect(() => {
    if (!isAuthenticated || isEntitlementLoading) {
      setThemeState(DEFAULT_THEME)
      return
    }
    setThemeState(savedThemeAllowed ? savedTheme : DEFAULT_THEME)
  }, [isAuthenticated, isEntitlementLoading, savedTheme, savedThemeAllowed])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Saved through the server, which re-checks Premium (profiles.theme isn't
  // client-writable). Reverts if the server refuses. Returns true on success.
  const setTheme = async (nextTheme) => {
    if (!THEMES.includes(nextTheme) || !canUseTheme(nextTheme)) return false
    const previous = theme

    document.documentElement.classList.add('theme-transitioning')
    setThemeState(nextTheme)
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 500)

    if (!isAuthenticated || !user?.id) return true

    setIsSaving(true)
    try {
      await saveTheme(nextTheme)
      return true
    } catch (error) {
      console.error('Failed to save STRATIX theme preference:', error.message)
      setThemeState(previous)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isSaving }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)

  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return ctx
}
