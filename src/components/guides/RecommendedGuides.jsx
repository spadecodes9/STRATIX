import { Link } from 'react-router-dom'
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getGuideForSkill, getCategoryLabel, getDifficulty, SKILL_GAP_LABELS } from '../../data/guides.js'
import Button from '../ui/Button.jsx'

export default function RecommendedGuides() {
  const { isAuthenticated } = useAuth()
  // Real per-user skill scores aren't tracked yet. This stays empty (and the
  // honest notice below renders) until a real source feeds it — never sample data.
  const skillScores = []

  const matches = []
  if (isAuthenticated) {
    const ranked = [...skillScores].sort((a, b) => a.score - b.score)
    for (const skill of ranked) {
      const guide = getGuideForSkill(skill.skill)
      if (guide && !matches.find((m) => m.guide.id === guide.id)) {
        matches.push({ guide, skill })
      }
      if (matches.length >= 3) break
    }
  }

  return (
    <section className="training-queue" aria-labelledby="training-queue-title">
      <span className="tq-corner tq-corner-tl" aria-hidden="true" />
      <span className="tq-corner tq-corner-br" aria-hidden="true" />

      <header className="tq-header">
        <div className="tq-heading">
          <span className="tq-eyebrow">01 // Training priority</span>
          <h2 id="training-queue-title">What to study next</h2>
          <p className="tq-sub">
            Your lowest-scoring areas, paired with the guide that addresses them most directly.
          </p>
        </div>
        <span className="tq-status">
          <i className="tq-status-dot" aria-hidden="true" />
          Training matrix // {isAuthenticated ? 'Active' : 'Locked'}
        </span>
      </header>

      {!isAuthenticated ? (
        <div className="tq-notice">
          <Lock size={18} aria-hidden="true" />
          <p>Sign in to see a personalized training path pulled from your own skill matrix.</p>
          <Button to="/sign-in" variant="secondary">Sign In</Button>
        </div>
      ) : matches.length === 0 ? (
        <div className="tq-notice">
          <CheckCircle2 size={18} aria-hidden="true" />
          <p>Personalized priorities need skill scores, and skill scoring isn&apos;t live yet — browse the library above to keep sharpening.</p>
        </div>
      ) : (
        <ol className="tq-list">
          {matches.map(({ guide, skill }, i) => (
            <li key={guide.id}>
              <Link to={`/guides/${guide.id}`} className="tq-row">
                <span className="tq-rail" aria-hidden="true" />
                <span className="tq-bracket tq-bracket-tl" aria-hidden="true" />
                <span className="tq-bracket tq-bracket-br" aria-hidden="true" />

                <span className="tq-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>

                <span className="tq-skill">
                  <span className="tq-skill-name">{skill.skill}</span>
                  <span className="tq-score">
                    {skill.score}
                    <span className="tq-sr"> out of 100</span>
                  </span>
                  <span className="tq-score-bar" aria-hidden="true">
                    <i style={{ width: `${skill.score}%` }} />
                  </span>
                </span>

                <span className="tq-info">
                  <span className="tq-gap">{SKILL_GAP_LABELS[skill.skill] || 'Close this gap'}</span>
                  <span className="tq-guide">{guide.title}</span>
                  <span className="tq-meta">
                    {getCategoryLabel(guide.category)} · {getDifficulty(guide.difficulty).label}
                  </span>
                </span>

                <span className="tq-open">
                  <span className="tq-open-label">Open guide</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
