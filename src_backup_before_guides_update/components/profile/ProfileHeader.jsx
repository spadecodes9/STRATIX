import { Calendar, LogOut, UserPen, Diamond } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar.jsx'
import Button from '../ui/Button.jsx'

export default function ProfileHeader({ user, joinDate, onSignOut }) {
  const rr = Number(user.rank?.rr) || 0
  const rrToNext = Math.max(0, 100 - rr)
  const nextDivision = user.rank?.division ? Number(user.rank.division) + 1 : null

  return (
    <div className="profile-hero panel">
      <div className="profile-hero-topbar">
        <Button variant="ghost" icon={LogOut} onClick={onSignOut} className="profile-signout-btn">
          Sign Out
        </Button>
      </div>

      <div className="profile-hero-grid">
        <div className="profile-hero-identity">
          <div className="profile-avatar">
            <span>{user.avatarInitials}</span>
            <i className="profile-status-dot" aria-hidden="true" />
          </div>
          <div className="profile-identity-copy">
            <h1>
              {user.username}
              <span className="profile-tag">{user.tag}</span>
            </h1>
            <div className="profile-meta-row">
              <span className="profile-status-label"><i /> Online / Active</span>
              <span><Calendar size={13} /> Joined {joinDate}</span>
              <span>Peak rank: {user.rank?.peak || '—'}</span>
            </div>
            {user.tacticalQuote && <p className="profile-quote">&ldquo;{user.tacticalQuote}&rdquo;</p>}
            <Button variant="secondary" icon={UserPen} disabled className="profile-edit-btn">
              Edit Profile <span className="coming-soon-badge">Coming soon</span>
            </Button>
          </div>
        </div>

        <div className="profile-rank-card">
          <div className="profile-rank-card-top">
            <span className="eyebrow">Current Rank</span>
            <span className="profile-rank-emblem"><Diamond size={16} strokeWidth={2.4} /></span>
          </div>
          <div className="profile-rank-card-tier">{user.rank?.tier || 'Unranked'} {user.rank?.division ?? ''}</div>
          <div className="profile-rank-card-rr-row">
            <span className="profile-rank-card-rr">{rr} RR</span>
          </div>
          <ProgressBar percent={rr} />
          <span className="profile-rank-card-caption">
            {rrToNext} RR to {user.rank?.tier || ''} {nextDivision || 'next rank'}
          </span>
        </div>
      </div>
    </div>
  )
}
