import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crosshair } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import './Auth.css'

export default function CreateAccount() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await signUp(form)
    toast.success('Account created')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Crosshair size={22} strokeWidth={2.2} />
          <span>STRATIX</span>
        </Link>
        <h1 className="auth-heading">Start training</h1>
        <p className="auth-sub">This is a frontend mock — no data leaves your browser yet.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Riot ID</span>
            <input
              type="text"
              required
              placeholder="ShadowStrike#NA1"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>
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
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-switch">
          Already training with us? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
