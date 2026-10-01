// Shared Premium UI: badge, upgrade CTA, and the "Premium required" locked
// state. Access always comes from PremiumContext (the centralized
// entitlement rules) — never hardcoded here. These are presentation only;
// every gated feature is enforced again on the server.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { usePremium } from '../../context/PremiumContext.jsx'
import Button from '../ui/Button.jsx'
import PremiumUpgradeModal from './PremiumUpgradeModal.jsx'
import './premium.css'

export function PremiumBadge({ children = 'Premium', className = '' }) {
  return (
    <span className={`premium-badge ${className}`.trim()}>
      <Sparkles size={11} aria-hidden="true" />
      {children}
    </span>
  )
}

// Opens the shared upgrade panel. Renders nothing for Premium users, so a CTA
// can never be shown to someone who already has access.
export function UpgradeButton({ children = 'Upgrade to Premium', variant = 'primary', className = '', fullWidth = false }) {
  const { isPremium, isLoading } = usePremium()
  const [isOpen, setIsOpen] = useState(false)
  if (isLoading || isPremium) return null

  return (
    <>
      <Button variant={variant} icon={Sparkles} onClick={() => setIsOpen(true)} className={className} fullWidth={fullWidth}>
        {children}
      </Button>
      <PremiumUpgradeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

// "Premium required" locked/empty state. `layout="inline"` for a strip inside
// a panel, `layout="page"` for a full locked page.
export function PremiumLock({ title = 'Premium required', description, layout = 'inline', headingLevel = 3 }) {
  const { isAuthenticated } = useAuth()
  const Heading = `h${headingLevel}`

  return (
    <div className={`premium-lock premium-lock-${layout}`} role="region" aria-label={title}>
      <span className="premium-lock-icon" aria-hidden="true"><Lock size={layout === 'page' ? 20 : 16} /></span>
      <div className="premium-lock-copy">
        <PremiumBadge>Premium required</PremiumBadge>
        <Heading className="premium-lock-title">{title}</Heading>
        {description && <p>{description}</p>}
      </div>
      <div className="premium-lock-actions">
        {isAuthenticated ? (
          <UpgradeButton />
        ) : (
          <Button variant="primary" to="/sign-in">Sign in to continue</Button>
        )}
        <Link to="/premium" className="premium-lock-compare">Compare plans</Link>
      </div>
    </div>
  )
}
