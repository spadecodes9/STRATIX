import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, BarChart2, Calendar } from 'lucide-react'
import { getGuideById, getRelatedGuides, guides } from '../data/guides.js'
import GuideCard from '../components/guides/GuideCard.jsx'
import AiCoachBridge from '../components/guides/AiCoachBridge.jsx'
import Badge from '../components/ui/Badge.jsx'
import './Guides.css'

export default function GuideDetail() {
  const { guideId } = useParams()
  const guide = getGuideById(guideId)
  const articleRef = useRef(null)
  const [readProgress, setReadProgress] = useState(0)

  useEffect(() => {
    if (!guide) return
    const handleScroll = () => {
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = rect.height - viewport * 0.5
      const scrolled = viewport * 0.5 - rect.top
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0
      setReadProgress(pct)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [guide])

  if (!guide) return <Navigate to="/guides" replace />

  const related = getRelatedGuides(guide)
  const caseCode = String(guides.findIndex((g) => g.id === guide.id) + 1).padStart(4, '0')
  const updatedLabel = new Date(guide.updated).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="page-shell guide-detail-shell">
      <div className="reading-progress-track" aria-hidden="true">
        <div className="reading-progress-fill" style={{ width: `${readProgress}%` }} />
      </div>

      <Link to="/guides" className="back-link back-link-tactical">
        <ArrowLeft size={15} /> All guides
      </Link>

      <div className="guide-detail-header">
        <span className="guide-case-code">Guide // {caseCode}</span>
        <Badge variant="red">{guide.category}</Badge>
        <h1>{guide.title}</h1>
        <p className="guide-detail-excerpt">{guide.excerpt}</p>
        <div className="guide-detail-meta">
          <span><Clock size={14} /> {guide.readTime} read</span>
          <span><BarChart2 size={14} /> {guide.difficulty}</span>
          <span><Calendar size={14} /> Updated {updatedLabel}</span>
        </div>
        <div className="guide-tag-row">
          {guide.tags.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
      </div>

      <div className="guide-hero-visual" aria-hidden="true">
        <div className="featured-guide-scanline" />
      </div>

      <article ref={articleRef} className="guide-body">
        <span className="eyebrow guide-body-eyebrow">Tactical Briefing</span>
        {guide.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>

      <AiCoachBridge
        label="Want this broken down for your specific games?"
        prompt="Ask AI Coach about this"
      />

      {related.length > 0 && (
        <div className="related-guides">
          <h3>More in {guide.category}</h3>
          <div className="guide-grid">
            {related.map((g, i) => <GuideCard key={g.id} guide={g} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}
