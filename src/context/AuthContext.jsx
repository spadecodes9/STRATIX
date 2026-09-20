import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { currentUser } from '../data/user.js'

const AuthContext = createContext(null)

/**
 * Turns a raw Supabase Auth error into a clean, user-facing message.
 * Recognizes common, documented Supabase/GoTrue error shapes — rate
 * limits, duplicate signups, bad credentials, unconfirmed email — and
 * gives each a plain-language message. Anything unrecognized falls back
 * to a generic message rather than surfacing raw internal error text
 * (which could include implementation details we don't want exposed).
 */
export function getAuthErrorMessage(error) {
  if (!error) return 'Something went wrong. Try again.'

  const status = error.status
  const message = (error.message || '').toLowerCase()

  if (status === 429 || message.includes('rate limit')) {
    return message.includes('email')
      ? "You've requested too many emails — wait a few minutes before trying again."
      : "You're doing that a bit too fast. Wait a moment and try again."
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'An account with that email already exists. Try signing in instead.'
  }

  if (message.includes('invalid login credentials')) {
    return "That email and password don't match our records."
  }

  if (message.includes('password should be at least') || message.includes('password is too short')) {
    return 'Choose a longer password — at least 6 characters.'
  }

  if (message.includes('invalid email') || message.includes('unable to validate email')) {
    return 'Enter a valid email address.'
  }

  if (message.includes('email not confirmed')) {
    return 'Confirm your email first — check your inbox for the verification link.'
  }

  if (error instanceof TypeError || message.includes('failed to fetch') || message.includes('network')) {
    return "Couldn't reach the server. Check your connection and try again."
  }

  // Unrecognized shape — don't surface raw internal error text.
  return 'Something went wrong. Try again in a moment.'
}

function mapUser(authUser, profile = null) {
  if (!authUser) return null

  return {
    ...currentUser,
    id: authUser.id,
    email: authUser.email ?? '',
    username:
      profile?.display_name ??
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      currentUser.username,
    avatarUrl:
      profile?.avatar_url ??
      authUser.user_metadata?.avatar_url ??
      null,
    avatarInitials: (
      profile?.display_name ??
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      currentUser.username ??
      'S'
    )
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),

    riotTag: profile?.riot_tag ?? currentUser.riotTag,
    rank: {
      tier: profile?.rank_tier ?? currentUser.rank?.tier,
      division: profile?.rank_division ?? currentUser.rank?.division,
      rr: profile?.rank_rr ?? currentUser.rank?.rr,
      peak: profile?.peak_rank ?? currentUser.rank?.peak,
    },

    onboardingComplete:
      profile?.onboarding_complete ?? false,

    preferences: {
      ...(profile?.preferences ?? {}),
      theme: profile?.theme ?? 'red',
    },

    authProvider: authUser.app_metadata?.provider ?? 'google',
  }
}

async function getOrCreateProfile(authUser) {
  const { data: profile, error: readError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle()

  if (readError) {
    throw readError
  }

  if (profile) {
    return profile
  }

  const displayName =
    authUser.user_metadata?.full_name ??
    authUser.user_metadata?.name ??
    authUser.email?.split('@')[0] ??
    currentUser.username

  const newProfile = {
    id: authUser.id,
    display_name: displayName,
    avatar_url:
      authUser.user_metadata?.avatar_url ??
      authUser.user_metadata?.picture ??
      null,
    riot_tag: null,
    rank_tier: currentUser.rank?.tier ?? null,
    rank_division: currentUser.rank?.division ?? null,
    rank_rr: currentUser.rank?.rr ?? null,
    peak_rank: currentUser.rank?.peak ?? null,
    onboarding_complete: false,
    preferences: {},
  }

  const { data: createdProfile, error: createError } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single()

  if (createError) {
    throw createError
  }

  return createdProfile
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      if (!session?.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const profile = await getOrCreateProfile(session.user)

        if (mounted) {
          setUser(mapUser(session.user, profile))
        }
      } catch (error) {
        console.error('Failed to load STRATIX profile:', error)

        if (mounted) {
          setUser(mapUser(session.user))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      if (!session?.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const profile = await getOrCreateProfile(session.user)

        if (mounted) {
          setUser(mapUser(session.user, profile))
        }
      } catch (error) {
        console.error('Failed to sync STRATIX profile:', error)

        if (mounted) {
          setUser(mapUser(session.user))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw error
    }
  }

  const signUp = async ({ email, password }) => {
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      throw error
    }
  }

  const signInWithGoogle = async (redirectPath = '/dashboard') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`,
        // Forces Google's account chooser instead of silently reusing
        // whatever Google session is already active in the browser. Not
        // One Tap, not auto sign-in — this only takes effect once the user
        // has already clicked "Continue with Google".
        queryParams: {
          prompt: 'select_account',
        },
      },
    })

    if (error) {
      throw error
    }
  }

  const signInWithDiscord = async (redirectPath = '/dashboard') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`,
      },
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithDiscord,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}