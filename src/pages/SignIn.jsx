import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Crosshair } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth, getAuthErrorMessage } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import OAuthButtons from '../components/auth/OAuthButtons.jsx'
import { useRiotRedirectToast } from '../context/RiotContext.jsx'
import './Auth.css'

export default function SignIn() {
  const { signIn, signInWithGoogle, signInWithDiscord, signInWithRiot } = useAuth()
  useRiotRedirectToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState(null)

  const redirectTo = location.state?.from || '/dashboard'

  // If the browser restores this page from bfcache (e.g. the player clicked
  // "Continue with Google", then hit Back before finishing), the page never
  // actually reloads — React state survives as-is, including a stale
  // "Redirecting…" button. Resetting on `pageshow` with `persisted: true`
  // is the standard fix for exactly this case.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setOauthProvider(null)
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await signIn(form)
      toast.success('Signed in')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleOAuth = async (provider) => {
    if (oauthProvider) return
    setOauthProvider(provider)
    try {
      if (provider === 'google') {
        await signInWithGoogle(redirectTo)
      } else if (provider === 'discord') {
        await signInWithDiscord(redirectTo)
      } else {
        await signInWithRiot()
      }
      // On success Supabase redirects the browser away to the provider, so
      // there's nothing further to render here — only the failure path
      // below needs to reset local state.
    } catch (error) {
      // Riot errors come from STRATIX's own backend and are already user-facing.
      toast.error(provider === 'riot' ? error.message : getAuthErrorMessage(error))
      setOauthProvider(null)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Crosshair size={22} strokeWidth={2.2} />
          <span>STRATIX</span>
        </Link>
        <h1 className="auth-heading">Sign in</h1>
        <p className="auth-sub">Sign in to pick up your training where you left off.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <Button type="submit" variant="primary" fullWidth disabled={submitting || !!oauthProvider}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <OAuthButtons
          onGoogle={() => handleOAuth('google')}
          onDiscord={() => handleOAuth('discord')}
          onRiot={() => handleOAuth('riot')}
          pendingProvider={oauthProvider}
          disabled={submitting}
        />

        <p className="auth-switch">
          New to STRATIX? <Link to="/create-account" state={{ from: redirectTo }}>Create an account</Link>
        </p>

        <p className="auth-footnote">
          One STRATIX account — sync your progress and AI Coach across every device.
        </p>
      </div>
    </div>
  )
}
