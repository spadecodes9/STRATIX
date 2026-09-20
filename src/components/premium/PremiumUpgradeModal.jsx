import { useEffect, useRef, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { premiumFeatures } from '../../data/premiumFeatures.js'
import Button from '../ui/Button.jsx'
import './PremiumUpgradeModal.css'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Centralized STRATIX Premium upgrade panel, reused by every current and
// future paywall trigger. No payment/checkout logic lives here — this is
// purely a "here's what you'd get, it isn't live yet" message. Entitlement
// state is never touched by this component.
export default function PremiumUpgradeModal({ isOpen, onClose }) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const panelRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement
      setIsRendered(true)
      setIsClosing(false)
      return
    }

    if (!isRendered) return

    if (prefersReducedMotion()) {
      setIsRendered(false)
      previouslyFocused.current?.focus?.()
    } else {
      setIsClosing(true)
    }
  }, [isOpen, isRendered])

  useEffect(() => {
    if (!isRendered) return

    panelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isRendered, onClose])

  const handlePanelAnimationEnd = () => {
    if (!isClosing) return
    setIsClosing(false)
    setIsRendered(false)
    previouslyFocused.current?.focus?.()
  }

  if (!isRendered) return null

  return (
    <div className={'premium-modal-overlay' + (isClosing ? ' is-closing' : '')} onClick={onClose}>
      <div
        ref={panelRef}
        className="premium-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={handlePanelAnimationEnd}
      >
        <button type="button" className="premium-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <span className="eyebrow premium-modal-eyebrow"><Sparkles size={14} /> STRATIX PREMIUM</span>
        <h2 id="premium-modal-title">Unlock the full STRATIX experience.</h2>

        <ul className="premium-modal-benefits">
          {premiumFeatures.map((feature) => (
            <li key={feature.id}>{feature.premiumDescription}</li>
          ))}
        </ul>

        <p className="premium-modal-launch-note">Premium subscriptions are launching soon.</p>

        <div className="premium-modal-actions">
          <Button variant="primary" disabled>Coming Soon</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
