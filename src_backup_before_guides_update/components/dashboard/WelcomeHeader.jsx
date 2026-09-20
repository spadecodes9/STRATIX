import { ChevronUp, Shield } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar.jsx'

export default function WelcomeHeader({ user }) {
  const xpPercent = Math.round((user.xp / user.xpToNextLevel) * 100)
  const rrToPromotion = Math.max(0, 100 - user.rank.rr)

  return (
    <section className="welcome-header">
      <div className="welcome-text dashboard-intro">
        <span className="eyebrow">Operator briefing</span>
        <h1>Welcome back, <span>{user.username}</span></h1>
        <p>Build on your {user.stats.streakDays}-day streak. Your next focused session can close the gap to promotion.</p>
        <div className="intro-status">
          <span className="status-dot" aria-hidden="true" />
          <span>Training plan ready</span><span className="intro-divider" aria-hidden="true" />
          <span>Peak rank: {user.rank.peak}</span>
        </div>
      </div>
      <div className="rank-card">
        <div className="rank-card-top">
          <div className="rank-card-tier">
            <span className="eyebrow">Current rank</span>
            <div className="rank-tier-line"><Shield size={20} /><h3>{user.rank.tier} {user.rank.division}</h3></div>
          </div>
          <div className="rank-card-rr">
            <span className="rr-value">{user.rank.rr}<small>RR</small></span>
            <span className="rr-label"><ChevronUp size={13} /> {rrToPromotion} to promotion</span>
          </div>
        </div>
        <div className="rank-card-xp">
          <div className="rank-card-xp-row">
            <span>Level {user.level}</span>
            <span>{user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <ProgressBar percent={xpPercent} />
          <span className="rank-xp-caption">{100 - xpPercent}% until your next account level</span>
        </div>
      </div>
    </section>
  )
}
