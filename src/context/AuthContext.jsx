import { createContext, useContext, useEffect, useState } from 'react'
import { currentUser } from '../data/user.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'stratix_auth_session'

/**
 * Mock auth provider. No backend, no real credential checking.
 * Swap the bodies of signIn/signUp/signOut for real API calls later —
 * every consumer of this context only depends on the shape below.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const persist = (userObj) => {
    setUser(userObj)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj))
  }

  const signIn = async ({ email }) => {
    // Mock: any credentials "work" and log the player into the demo profile.
    await new Promise((r) => setTimeout(r, 500))
    const sessionUser = { ...currentUser, email: email || currentUser.email }
    persist(sessionUser)
    return sessionUser
  }

  const signUp = async ({ username, email }) => {
    await new Promise((r) => setTimeout(r, 600))
    const sessionUser = {
      ...currentUser,
      username: username || currentUser.username,
      email: email || currentUser.email,
      isNewPlayer: true,
    }
    persist(sessionUser)
    return sessionUser
  }

  const signOut = () => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
