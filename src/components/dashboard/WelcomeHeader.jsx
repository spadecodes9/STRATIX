import { Shield } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar.jsx'

export default function WelcomeHeader({ user }) {
  const xpPercent = Math.round((user.xp / user.xpToNextLevel) * 100)

  return (
    <section className="welcome-header">
      <div className="welcome-text">
        <div className="welcome-status">
          <span className="status-dot" />
          <span>Player session // Active</span>
        </div>
        <span className="eyebrow">Welcome back</span>
        <h1>{user.username}</h1>
        <p>Peak rank {user.rank.peak} · Training for {user.stats.hoursTrained}h this season</p>
      </div>

      <div className="rank-card">
        <Shield size={130} strokeWidth={1} className="card-watermark rank-card-watermark" />
        <div className="rank-card-top">
          <div className="rank-card-tier">
            <span className="eyebrow">Current Rank</span>
            <h3>{user.rank.tier} {user.rank.division}</h3>
          </div>
          <div className="rank-card-rr">
            <span className="rr-value">{user.rank.rr}</span>
            <span className="rr-label">RR</span>
          </div>
        </div>
        <div className="rank-card-xp">
          <div className="rank-card-xp-row">
            <span>Level {user.level}</span>
            <span>{user.xp} / {user.xpToNextLevel} XP</span>
          </div>
          <ProgressBar percent={xpPercent} />
        </div>
      </div>
    </section>
  )
}
