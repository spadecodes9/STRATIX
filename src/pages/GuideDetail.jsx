import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  BarChart2,
  Calendar,
  Target,
  Layers,
  ListChecks,
  Compass,
  AlertTriangle,
  Radar,
  Dumbbell,
  Sparkles,
} from 'lucide-react'
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
  const updatedLabel = new Date(guide.updated).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const { content } = guide

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
          {(guide.maps || []).map((m) => <Badge key={`map-${m}`} variant="red">{m}</Badge>)}
          {guide.tags.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
      </div>

      <div className="guide-detail-divider" aria-hidden="true" />

      <article ref={articleRef} className="guide-body">
        <span className="eyebrow guide-body-eyebrow">Tactical Briefing</span>

        <section className="guide-section guide-section-why">
          <div className="guide-section-label">
            <Target size={15} />
            <span>Why This Matters</span>
          </div>
          <p>{content.whyItMatters}</p>
        </section>

        <section className="guide-section">
          <div className="guide-section-label">
            <Layers size={15} />
            <span>Core Concept</span>
          </div>
          <p>{content.coreConcept}</p>
        </section>

        <section className="guide-section">
          <div className="guide-section-label">
            <ListChecks size={15} />
            <span>Step-by-Step</span>
          </div>
          <ol className="guide-steps-list">
            {content.steps.map((step, i) => (
              <li key={i} className="guide-step">
                <span className="guide-step-index">{String(i + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="guide-section">
          <div className="guide-section-label">
            <Compass size={15} />
            <span>When to Use It</span>
          </div>
          <p>{content.whenToUseIt}</p>
        </section>

        <section className="guide-section guide-section-mistakes">
          <div className="guide-section-label">
            <AlertTriangle size={15} />
            <span>Common Mistakes</span>
          </div>
          <ul className="guide-mistakes-list">
            {content.commonMistakes.map((mistake, i) => (
              <li key={i} className="guide-mistake">{mistake}</li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <div className="guide-section-label">
            <Radar size={15} />
            <span>In-Game Example</span>
          </div>
          <div className="guide-example-box">
            <p>{content.example}</p>
          </div>
        </section>

        {content.drill && (
          <section className="guide-section">
            <div className="guide-section-label">
              <Dumbbell size={15} />
              <span>Practice Drill</span>
            </div>
            <div className="guide-drill-box">
              <p>{content.drill}</p>
            </div>
          </section>
        )}

        <section className="guide-section guide-section-takeaway">
          <div className="guide-takeaway-box">
            <Sparkles size={16} className="guide-takeaway-icon" />
            <div>
              <span className="guide-takeaway-label">Quick Takeaway</span>
              <p>{content.takeaway}</p>
            </div>
          </div>
        </section>
      </article>

      <div className="guide-detail-divider" aria-hidden="true" />

      <AiCoachBridge
        label="Want this broken down for your specific games?"
        prompt="Ask AI Coach about this"
      />

      {related.length > 0 && (
        <>
          <div className="guide-detail-divider" aria-hidden="true" />
          <div className="related-guides">
            <span className="eyebrow">Related Guides</span>
            <h3>More in {guide.category}</h3>
            <div className="guide-grid guide-grid-related">
              {related.map((g, i) => <GuideCard key={g.id} guide={g} index={i} />)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
