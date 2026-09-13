import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Crosshair } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import './Auth.css'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await signIn(form)
    toast.success('Signed in')
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Crosshair size={22} strokeWidth={2.2} />
          <span>STRATIX</span>
        </Link>
        <h1 className="auth-heading">Sign in</h1>
        <p className="auth-sub">This is a frontend mock — any email and password will sign you in.</p>

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
          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-switch">
          New to STRATIX? <Link to="/create-account">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
