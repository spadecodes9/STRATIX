import { Link } from 'react-router-dom'
import { Target, ArrowRight, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getGuideForSkill, SKILL_GAP_LABELS } from '../../data/guides.js'
import Button from '../ui/Button.jsx'

function severity(score) {
  if (score < 60) return 'critical'
  if (score < 75) return 'moderate'
  return 'stable'
}

export default function RecommendedGuides() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="recommended-guides recommended-guides-locked">
        <Lock size={18} />
        <p>Sign in to see a personalized training path pulled from your own skill matrix.</p>
        <Button to="/sign-in" variant="secondary">Sign In</Button>
      </div>
    )
  }

  const ranked = [...user.skillMatrix].sort((a, b) => a.score - b.score)
  const matches = []
  for (const skill of ranked) {
    const guide = getGuideForSkill(skill.skill)
    if (guide && !matches.find((m) => m.guide.id === guide.id)) {
      matches.push({ guide, skill })
    }
    if (matches.length >= 3) break
  }

  return (
    <div className="recommended-guides">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">Training Path // Tactical Gaps Detected</span>
          <h2>Recommended for your training</h2>
        </div>
        <Target size={20} className="panel-icon" />
      </div>

      {matches.length === 0 ? (
        <div className="recommended-guides-clear">
          <CheckCircle2 size={18} />
          <p>No major gaps flagged in your skill matrix right now — browse the library above to keep sharpening.</p>
        </div>
      ) : (
        <>
          <p className="recommended-guides-sub">
            Based on your current skill matrix — lowest scores surfaced first.
          </p>
          <div className="recommended-guides-list">
            {matches.map(({ guide, skill }, i) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.id}`}
                className={`recommended-guide-row severity-${severity(skill.score)}`}
              >
                <span className="recommended-guide-severity-bar" />
                <span className="recommended-guide-number">{String(i + 1).padStart(2, '0')}</span>
                <div className="recommended-guide-skill">
                  <span className="recommended-guide-skill-name">{skill.skill}</span>
                  <span className="recommended-guide-skill-score">{skill.score}</span>
                </div>
                <div className="recommended-guide-info">
                  <span className="recommended-guide-gap-label">
                    {SKILL_GAP_LABELS[skill.skill] || 'Close this gap'}
                  </span>
                  <span className="recommended-guide-title">{guide.title}</span>
                  <span className="recommended-guide-meta">{guide.category} · {guide.readTime}</span>
                </div>
                <ArrowRight size={16} className="recommended-guide-arrow" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
