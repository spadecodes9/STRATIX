import { Calendar, LogOut, UserPen } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { RiotStatusBlock } from '../riot/Riot.jsx'
import { PremiumBadge, UpgradeButton } from '../premium/PremiumGate.jsx'
import { usePremium } from '../../context/PremiumContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function ProfileHeader({ user, joinDate, onSignOut }) {
  const { isPremium } = usePremium()
  const { theme } = useTheme()

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
            <h1>{user.username}</h1>
            <div className="profile-meta-row">
              <span className="profile-status-label"><i /> Online / Active</span>
              <span><Calendar size={13} /> Joined {joinDate}</span>
            </div>
            <Button variant="secondary" icon={UserPen} disabled className="profile-edit-btn">
              Edit Profile <span className="coming-soon-badge">Coming soon</span>
            </Button>
          </div>
        </div>

        <div className="profile-rank-card">
          <RiotStatusBlock />
        </div>

        <div className="profile-plan-card">
          <div className="profile-plan-card-top">
            <span className="eyebrow">Plan</span>
          </div>
          {isPremium ? (
            <>
              <PremiumBadge>Premium · Active</PremiumBadge>
              <span className="profile-plan-theme">Theme: {theme[0].toUpperCase() + theme.slice(1)}</span>
              <Button variant="secondary" disabled>
                Manage Subscription <span className="coming-soon-badge">Coming soon</span>
              </Button>
            </>
          ) : (
            <>
              <div className="profile-plan-status">FREE PLAN</div>
              <UpgradeButton />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
