import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

// Landing point after "Continue with Riot". The backend has already verified
// the RSO callback; this trades its one-time httpOnly ticket for a session.
export default function RiotAuthComplete() {
  const { completeRiotSignIn } = useAuth()
  const navigate = useNavigate()
  const started = useRef(false)

  useEffect(() => {
    // The ticket is single-use: don't let StrictMode's double effect burn it.
    if (started.current) return
    started.current = true
    completeRiotSignIn()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((error) => {
        toast.error(error.message || "Riot sign-in didn't complete. Try again.")
        navigate('/sign-in', { replace: true })
      })
  }, [completeRiotSignIn, navigate])

  return (
    <div className="auth-shell">
      <div className="auth-card" role="status">
        <p className="auth-sub">Signing you in with Riot…</p>
      </div>
    </div>
  )
}
