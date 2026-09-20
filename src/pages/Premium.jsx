import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { usePremium } from '../context/PremiumContext.jsx'
import { premiumFeatures } from '../data/premiumFeatures.js'
import { CURRENT_VALORANT_PATCH } from '../data/patch.js'
import PremiumFeatureCard from '../components/premium/PremiumFeatureCard.jsx'
import ThemeSelector from '../components/premium/ThemeSelector.jsx'
import PremiumQuizzes from '../components/premium/PremiumQuizzes.jsx'
import PremiumUpgradeModal from '../components/premium/PremiumUpgradeModal.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import '../components/premium/premium.css'
import './Premium.css'

export default function Premium() {
  const { isPremium, isLoading, entitlementType } = usePremium()
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  return (
    <div className="page-shell premium-page">
      <div className="premium-hero">
        <span className="eyebrow premium-hero-eyebrow"><Sparkles size={14} /> STRATIX PREMIUM</span>
        <h1>Unlock STRATIX Premium</h1>
        <p>
          Premium unlocks advanced tools, deeper analysis, full customization, and exclusive
          content across the entire training platform.
        </p>
        {!isLoading && (
          isPremium
            ? (
              <div className="premium-hero-status">
                <Badge variant="gold">Premium active</Badge>
                {entitlementType === 'patch' && (
                  <span className="premium-hero-patch-note">Active for Patch {CURRENT_VALORANT_PATCH}</span>
                )}
              </div>
            )
            : (
              <Button variant="primary" onClick={() => setIsUpgradeModalOpen(true)}>
                Upgrade to Premium
              </Button>
            )
        )}
        {!isLoading && !isPremium && (
          <p className="premium-hero-patch-note premium-hero-patch-note-free">
            Premium access is sold per VALORANT patch — currently Patch {CURRENT_VALORANT_PATCH}.
          </p>
        )}
      </div>

      <PremiumUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />

      <div className="premium-feature-grid">
        {premiumFeatures.map((feature) => (
          <PremiumFeatureCard key={feature.id} feature={feature} />
        ))}
      </div>

      <ThemeSelector />
      <PremiumQuizzes />
    </div>
  )
}
