import { Check, Clock, Minus, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { usePremium } from '../context/PremiumContext.jsx'
import { premiumFeatures } from '../data/premiumFeatures.js'
import { CURRENT_VALORANT_PATCH } from '../data/patch.js'
import ThemeSelector from '../components/premium/ThemeSelector.jsx'
import PremiumQuizzes from '../components/premium/PremiumQuizzes.jsx'
import { PremiumBadge, UpgradeButton } from '../components/premium/PremiumGate.jsx'
import Button from '../components/ui/Button.jsx'
import '../components/premium/premium.css'
import './Premium.css'

// Plan state comes only from PremiumContext (centralized entitlement rules).
// Checkout isn't live yet: UpgradeButton opens the "launching soon" panel.
function PlanStatus() {
  const { isAuthenticated } = useAuth()
  const { isPremium, isLoading, entitlementType } = usePremium()

  if (!isAuthenticated) {
    return (
      <div className="premium-plan-status" role="status">
        <span className="premium-plan-label">Your plan</span>
        <strong>Not signed in</strong>
        <p>Sign in to see your plan and use your Free AI Coach messages.</p>
        <Button variant="secondary" to="/sign-in">Sign in</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="premium-plan-status" role="status">
        <span className="premium-plan-label">Your plan</span>
        <p>Checking your plan…</p>
      </div>
    )
  }

  return (
    <div className={'premium-plan-status' + (isPremium ? ' is-premium' : '')} role="status">
      <span className="premium-plan-label">Your plan</span>
      {isPremium ? (
        <>
          <strong><ShieldCheck size={18} aria-hidden="true" /> Premium · Active</strong>
          <p>
            {entitlementType === 'lifetime'
              ? 'Lifetime access — every Premium feature, every patch.'
              : `Active for Patch ${CURRENT_VALORANT_PATCH}. Every Premium feature is unlocked.`}
          </p>
        </>
      ) : (
        <>
          <strong>Free</strong>
          <p>Core guides, quizzes, and limited AI Coach. Premium unlocks everything below.</p>
          <UpgradeButton />
        </>
      )}
    </div>
  )
}

function FeatureComparison() {
  const { canAccess, isPremium } = usePremium()

  return (
    <section className="premium-compare" aria-labelledby="premium-compare-title">
      <div className="premium-section-heading">
        <span className="eyebrow">Free vs Premium</span>
        <h2 id="premium-compare-title">Feature comparison</h2>
      </div>

      <div className="premium-compare-table" role="table" aria-label="Free and Premium features">
        <div className="premium-compare-row premium-compare-head" role="row">
          <span role="columnheader">Feature</span>
          <span role="columnheader">Free</span>
          <span role="columnheader" className="premium-compare-premium-col">
            Premium {isPremium && <Check size={13} aria-label="your plan" />}
          </span>
          <span role="columnheader">Status</span>
        </div>

        {premiumFeatures.map((feature) => {
          const Icon = feature.icon
          const live = feature.status === 'live'
          const unlocked = live && canAccess(feature.entitlement)
          const freeUnavailable = feature.freeDescription === 'Not available'
          return (
            <div key={feature.id} className="premium-compare-row" role="row">
              <span role="cell" className="premium-compare-feature">
                <span className="premium-compare-icon" aria-hidden="true"><Icon size={16} /></span>
                {feature.title}
              </span>
              <span role="cell" className={'premium-compare-free' + (freeUnavailable ? ' is-unavailable' : '')}>
                <span className="premium-compare-mobile-label">Free</span>
                {freeUnavailable && <Minus size={13} aria-hidden="true" />}
                {feature.freeDescription}
              </span>
              <span role="cell" className="premium-compare-premium">
                <span className="premium-compare-mobile-label">Premium</span>
                <Sparkles size={13} aria-hidden="true" />
                {feature.premiumDescription}
              </span>
              <span role="cell" className="premium-compare-status">
                {unlocked ? (
                  <PremiumBadge>Unlocked</PremiumBadge>
                ) : live ? (
                  <span className="premium-status-live"><i aria-hidden="true" /> Live</span>
                ) : (
                  <span className="premium-status-soon"><Clock size={12} aria-hidden="true" /> Coming soon</span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function Premium() {
  const { isPremium, isLoading } = usePremium()

  return (
    <div className="page-shell premium-page">
      <div className="premium-hero">
        <span className="eyebrow premium-hero-eyebrow"><Sparkles size={14} /> STRATIX PREMIUM</span>
        <h1>Unlock STRATIX Premium</h1>
        <p>
          Premium unlocks advanced tools, deeper analysis, full customization, and exclusive
          content across the entire training platform.
        </p>
        {!isLoading && !isPremium && (
          <p className="premium-hero-patch-note premium-hero-patch-note-free">
            Premium access is sold per VALORANT patch — currently Patch {CURRENT_VALORANT_PATCH}.
          </p>
        )}
      </div>

      <PlanStatus />
      <FeatureComparison />
      <ThemeSelector />
      <PremiumQuizzes />

      {!isLoading && !isPremium && (
        <section className="premium-cta-band">
          <div>
            <span className="eyebrow">Ready when you are</span>
            <h2>Train without limits.</h2>
            <p>Unlimited AI Coach, the full guides library, and every STRATIX theme.</p>
          </div>
          <UpgradeButton />
        </section>
      )}
    </div>
  )
}
