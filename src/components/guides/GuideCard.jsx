import { Link } from 'react-router-dom'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { usePremium } from '../../context/PremiumContext.jsx'
import { getCategoryLabel, getDifficulty } from '../../data/guides.js'
import { getCategoryMeta } from './categoryMeta.js'

export default function GuideCard({ guide, index = 0 }) {
  const [ref, isVisible] = useScrollReveal()
  const { canAccess } = usePremium()
  const Icon = getCategoryMeta(guide.category).icon
  const difficulty = getDifficulty(guide.difficulty)
  const isLocked = guide.premium && !canAccess('premium-guides')

  return (
    <Link
      to={`/guides/${guide.id}`}
      ref={ref}
      className={`guide-card ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${Math.min(index, 6) * 60}ms` : '0ms' }}
    >
      <Icon className="guide-card-watermark" strokeWidth={1} aria-hidden="true" />
      <span className="guide-card-corner" aria-hidden="true" />

      <div className="guide-card-top">
        <span className="guide-card-category">
          <Icon size={13} aria-hidden="true" />
          {getCategoryLabel(guide.category)}
        </span>
        {guide.premium && (
          <span className="guide-card-lock">
            {isLocked ? <Lock size={12} aria-label="Locked" /> : <Sparkles size={12} aria-hidden="true" />} Premium
          </span>
        )}
      </div>

      <h3>{guide.title}</h3>
      <p>{guide.excerpt}</p>

      <div className="guide-card-footer">
        <span className={`guide-card-difficulty tier-${difficulty.tier}`} aria-label={`Difficulty: ${difficulty.label}`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`tier-bar ${n <= difficulty.tier ? 'tier-bar-filled' : ''}`} />
          ))}
          {difficulty.label}
        </span>
        <span className="guide-card-cta">Read guide <ArrowRight size={14} /></span>
      </div>
    </Link>
  )
}
