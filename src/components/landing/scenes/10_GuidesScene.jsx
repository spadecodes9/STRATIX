import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Eye, Clock, Bookmark } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

const GUIDE_CATEGORIES = [
  'AIM',
  'MOVEMENT',
  'AGENTS',
  'MAPS',
  'UTILITY',
  'POSITIONING',
  'GAME SENSE',
]

export default function GuidesScene({ progress, isVisible }) {
  const guideScale = 0.92 + progress * 0.08
  const guideY = (1 - progress) * 35

  return (
    <div className="scene-container guides-scene">
      <CinematicHUDOverlay
        sceneNumber="10"
        sector="PLAYBOOK // SITUATIONAL GUIDES"
        systemStatus="85+ GUIDES INDEXED"
        progress={progress}
      />

      {/* Editorial Featured Tactical Guide Showcase */}
      <div
        className="editorial-guide-showcase"
        style={{
          transform: `translateY(${guideY}px) scale(${guideScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        <div className="editorial-guide-card">
          <div className="guide-card-top-tag">
            <span className="text-red">FEATURED TACTICAL PLAYBOOK</span>
            <span className="guide-read-time"><Clock size={13} /> 6 MIN READ</span>
          </div>

          <h3 className="guide-headline">
            Post-Plant Crossfire Geometry on Ascent A-Site
          </h3>

          <p className="guide-summary">
            A comprehensive breakdown of Heaven/Hell isolation angles, defender defuse timing
            traps, and how to hold against 2-man retake pinches without over-peeking.
          </p>

          <div className="guide-tactical-diagram-preview">
            <div className="diagram-grid-bg" />
            <div className="diagram-callout">
              <span className="diagram-pin text-red">◆ ANGLE-A1</span>
              <span>Heaven Isolation (52m)</span>
            </div>
            <div className="diagram-callout">
              <span className="diagram-pin text-success">◆ CROSSFIRE-B</span>
              <span>Hell Retake Trap</span>
            </div>
          </div>

          <div className="guide-footer-row">
            <div className="guide-tags-row">
              <span className="guide-tag">ASCENT</span>
              <span className="guide-tag">POST-PLANT</span>
              <span className="guide-tag">CROSSFIRE</span>
            </div>
            <Link to="/guides" className="guide-read-link">
              Read Guide <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal UI Content & Categories */}
      <div className="scene-content guides-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">08 // SITUATIONAL PLAYBOOKS</span>
        </div>

        <h2 className="scene-title-xl">
          READ THE GAME <br />
          <span className="text-glow-red">DIFFERENTLY.</span>
        </h2>

        <p className="scene-desc-md">
          Between queues, sharpen your tactical playbook. Short, highly dense situational guides
          covering site executes, anti-eco traps, and post-plant setups for every map.
        </p>

        {/* Category Pills List */}
        <div className="guide-categories-grid">
          {GUIDE_CATEGORIES.map((cat, i) => (
            <Link
              key={cat}
              to={`/guides?category=${cat.toLowerCase()}`}
              className="guide-cat-pill"
              style={{
                opacity: Math.min(1, 0.3 + (progress - i * 0.05) * 2),
              }}
            >
              <span>{cat}</span>
            </Link>
          ))}
        </div>

        <div className="guides-action-row">
          <Button variant="secondary" to="/guides" icon={BookOpen}>
            Explore All Guides
          </Button>
        </div>
      </div>
    </div>
  )
}
