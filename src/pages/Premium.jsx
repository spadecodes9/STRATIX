import { Sparkles } from 'lucide-react'
import { usePremium } from '../context/PremiumContext.jsx'
import { premiumFeatures } from '../data/premiumFeatures.js'
import PremiumFeatureCard from '../components/premium/PremiumFeatureCard.jsx'
import ThemeSelector from '../components/premium/ThemeSelector.jsx'
import PremiumQuizzes from '../components/premium/PremiumQuizzes.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import '../components/premium/premium.css'
import './Premium.css'

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
        {!isLoading && (
          isPremium
            ? <Badge variant="gold">Premium active</Badge>
            : (
              <Button variant="primary" disabled>
                Upgrade to Premium <span className="coming-soon-badge">Coming soon</span>
              </Button>
            )
        )}
      </div>

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
