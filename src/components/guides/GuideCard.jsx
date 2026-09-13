import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { getCategoryMeta } from './categoryMeta.js'

const TIER_BY_DIFFICULTY = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export default function GuideCard({ guide, index = 0 }) {
  const [ref, isVisible] = useScrollReveal()
  const meta = getCategoryMeta(guide.category)
  const WatermarkIcon = meta.icon
  const tier = TIER_BY_DIFFICULTY[guide.difficulty] || 1

  return (
    <Link
      to={`/guides/${guide.id}`}
      ref={ref}
      className={`guide-card ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${Math.min(index, 6) * 60}ms` : '0ms' }}
    >
      <WatermarkIcon className="guide-card-watermark" strokeWidth={1} aria-hidden="true" />

      <div className="guide-card-top">
        <Badge variant="red">{guide.category}</Badge>
        {guide.tags[0] && <span className="guide-card-tag">{guide.tags[0]}</span>}
      </div>
      <h3>{guide.title}</h3>
      <p>{guide.excerpt}</p>
      <div className="guide-card-footer">
        <span className="guide-card-difficulty" aria-label={`Difficulty: ${guide.difficulty}`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`tier-bar ${n <= tier ? 'tier-bar-filled' : ''}`} />
          ))}
          {guide.difficulty}
        </span>
        <span><Clock size={13} /> {guide.readTime}</span>
      </div>
      <span className="guide-card-cta">Read guide <ArrowRight size={14} /></span>
    </Link>
  )
}
