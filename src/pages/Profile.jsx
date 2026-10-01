import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useRiotRedirectToast } from '../context/RiotContext.jsx'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import PerformanceStats from '../components/profile/PerformanceStats.jsx'
import SkillRadar from '../components/profile/SkillRadar.jsx'
import RecentMatches from '../components/profile/RecentMatches.jsx'
import TrainingProgress from '../components/profile/TrainingProgress.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import ProfileActions from '../components/profile/ProfileActions.jsx'
import { RiotAccountPanel } from '../components/riot/Riot.jsx'
import '../pages/Dashboard.css'
import './Profile.css'

// Every player-specific panel here reads real data or shows an empty state:
// VALORANT data only from a connected Riot account (RiotContext); STRATIX
// skill scores, objectives and activity aren't tracked yet, so they're empty.
export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  useRiotRedirectToast()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const joinDate = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : '—'

  return (
    <div className="page-shell dashboard profile-page">
      <ProfileHeader user={user} joinDate={joinDate} onSignOut={handleSignOut} />

      <RiotAccountPanel />

      <PerformanceStats />

      <div className="two-col-panels profile-command-row">
        <SkillRadar skills={[]} weakestSkill={null} />
        <TrainingProgress trainingObjective={null} recommendedNext={null} />
      </div>

      <div className="two-col-panels">
        <RecentMatches />
        <RecentActivity activity={[]} />
      </div>

      <ProfileActions />
    </div>
  )
}
