import Badge from '../ui/Badge.jsx'

export default function PremiumFeatureCard({ feature }) {
  const Icon = feature.icon

  return (
    <div className="premium-feature-card">
      <div className="premium-feature-card-top">
        <span className="premium-feature-icon"><Icon size={20} /></span>
        {feature.status === 'coming-soon' && <Badge variant="default">Coming soon</Badge>}
      </div>
      <h3>{feature.title}</h3>
      <div className="premium-feature-tier">
        <span className="premium-feature-tier-label">Free</span>
        <span>{feature.freeDescription}</span>
      </div>
      <div className="premium-feature-tier premium-feature-tier-gold">
        <span className="premium-feature-tier-label">Premium</span>
        <span>{feature.premiumDescription}</span>
      </div>
    </div>
  )
}
