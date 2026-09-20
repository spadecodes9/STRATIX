import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

const ThemeContext = createContext(null)

const VALID_THEMES = ['red', 'blue', 'green', 'gold']
const DEFAULT_THEME = 'red'

export function ThemeProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [theme, setThemeState] = useState(DEFAULT_THEME)
  const [isSaving, setIsSaving] = useState(false)

  // Load the signed-in user's saved theme once auth resolves. Signed-out
  // visitors always see the default theme.
  useEffect(() => {
    if (!isAuthenticated) {
      setThemeState(DEFAULT_THEME)
      return
    }

    const savedTheme = user?.preferences?.theme
    setThemeState(VALID_THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME)
  }, [isAuthenticated, user?.preferences?.theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = async (nextTheme) => {
    if (!VALID_THEMES.includes(nextTheme)) return

    document.documentElement.classList.add('theme-transitioning')
    setThemeState(nextTheme)
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 500)

    if (!isAuthenticated || !user?.id) return

    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ theme: nextTheme }).eq('id', user.id)
    setIsSaving(false)

    if (error) {
      console.error('Failed to save STRATIX theme preference:', error)
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
