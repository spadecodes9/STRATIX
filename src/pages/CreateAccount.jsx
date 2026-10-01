import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Crosshair } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth, getAuthErrorMessage } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import OAuthButtons from '../components/auth/OAuthButtons.jsx'
import { useRiotRedirectToast } from '../context/RiotContext.jsx'
import './Auth.css'

export default function CreateAccount() {
  const { signUp, signInWithGoogle, signInWithDiscord, signInWithRiot } = useAuth()
  useRiotRedirectToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState(null)

  const redirectTo = location.state?.from || '/dashboard'

  // See SignIn.jsx for why this is needed: bfcache can restore this page
  // with a stale "Redirecting…" button still showing after the player
  // starts an OAuth flow and comes back via the browser Back button.
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
      await signUp(form)
      toast.success('Account created')
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
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Start training with a free STRATIX account.</p>

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
            {submitting ? 'Creating account…' : 'Create Account'}
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
          Already training with us? <Link to="/sign-in" state={{ from: redirectTo }}>Sign in</Link>
        </p>

        <p className="auth-footnote">
          Your STRATIX account powers your AI Coach, tracks your progress, and unlocks the full training platform.
        </p>
      </div>
    </div>
  )
}
