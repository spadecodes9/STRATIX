import { Link } from 'react-router-dom'
import { Clock, BarChart2, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { getCategoryMeta } from './categoryMeta.js'

export default function FeaturedGuide({ guide }) {
  const [ref, isVisible] = useScrollReveal()
  const meta = getCategoryMeta(guide.category)
  const WatermarkIcon = meta.icon

  return (
    <Link
      to={`/guides/${guide.id}`}
      ref={ref}
      className={`featured-guide ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="featured-guide-visual" aria-hidden="true">
        <div className="featured-guide-scanline" />
        <WatermarkIcon className="featured-guide-watermark" strokeWidth={1} />
        <div className="featured-guide-corner featured-guide-corner-tl" />
        <div className="featured-guide-corner featured-guide-corner-br" />
        <span className="featured-guide-code">GUIDE // {guide.id.slice(0, 4).toUpperCase()}</span>
      </div>

      <div className="featured-guide-content">
        <span className="eyebrow">Featured // Tactical Briefing</span>
        <h2>{guide.title}</h2>
        <p>{guide.excerpt}</p>

        <div className="featured-guide-meta">
          <Badge variant="red">{guide.category}</Badge>
          <span><BarChart2 size={13} /> {guide.difficulty}</span>
          <span><Clock size={13} /> {guide.readTime}</span>
          {guide.tags[0] && <span className="featured-guide-tag">{guide.tags[0]}</span>}
        </div>

        <span className="featured-guide-cta">
          Read Guide <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  )
}
