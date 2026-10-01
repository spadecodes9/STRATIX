import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { getCategoryLabel, getDifficulty, guides } from '../../data/guides.js'
import { getCategoryMeta } from './categoryMeta.js'

export default function FeaturedGuide({ guide }) {
  const [ref, isVisible] = useScrollReveal()
  const Icon = getCategoryMeta(guide.category).icon
  const difficulty = getDifficulty(guide.difficulty)
  const code = String(guides.indexOf(guide) + 1).padStart(2, '0')

  return (
    <Link
      to={`/guides/${guide.id}`}
      ref={ref}
      className={`featured-guide ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="featured-guide-visual" aria-hidden="true">
        <div className="featured-guide-scanline" />
        <div className="featured-guide-emblem">
          <span className="featured-guide-ring featured-guide-ring-outer" />
          <span className="featured-guide-ring featured-guide-ring-inner" />
          <Icon className="featured-guide-icon" size={44} strokeWidth={1.25} />
        </div>
        <div className="featured-guide-corner featured-guide-corner-tl" />
        <div className="featured-guide-corner featured-guide-corner-br" />
        <span className="featured-guide-code">GUIDE {code} // {getCategoryLabel(guide.category).toUpperCase()}</span>
      </div>

      <div className="featured-guide-content">
        <span className="eyebrow">Featured briefing</span>
        <div className="featured-guide-meta">
          <span className="guide-card-category">
            <Icon size={13} aria-hidden="true" />
            {getCategoryLabel(guide.category)}
          </span>
          <span className={`guide-card-difficulty tier-${difficulty.tier}`}>
            {[1, 2, 3].map((n) => (
              <span key={n} className={`tier-bar ${n <= difficulty.tier ? 'tier-bar-filled' : ''}`} />
            ))}
            {difficulty.label}
          </span>
        </div>
        <h2>{guide.title}</h2>
        <p>{guide.excerpt}</p>

        <span className="featured-guide-cta">
          Read Guide <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  )
}
