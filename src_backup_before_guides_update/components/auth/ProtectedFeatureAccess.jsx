import { Link, useLocation } from 'react-router-dom'
import { Crosshair } from 'lucide-react'
import '../../pages/Auth.css'

/**
 * Rendered by ProtectedRoute in place of the protected page when a visitor
 * is signed out. Stays on the original URL — no redirect — so the person
 * immediately sees what they were trying to reach and why sign-in is
 * required, per feature. Reuses the existing .auth-shell/.auth-card
 * surface from Auth.css rather than introducing new styling.
 */
export default function ProtectedFeatureAccess({ feature, description }) {
  const location = useLocation()
  // Where to send the visitor back to once they're authenticated.
  const from = location.pathname

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <Crosshair size={22} strokeWidth={2.2} />
          <span>STRATIX</span>
        </Link>

        <span className="eyebrow auth-gate-eyebrow">{feature}</span>
        <h1 className="auth-heading">Sign in to continue</h1>
        <p className="auth-sub">{description}</p>

        <div className="auth-gate-actions">
          <Link to="/sign-in" state={{ from }} className="btn btn-primary">
            Sign in
          </Link>
          <Link to="/create-account" state={{ from }} className="btn btn-secondary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
