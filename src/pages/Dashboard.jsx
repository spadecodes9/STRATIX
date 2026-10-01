import { useAuth } from '../context/AuthContext.jsx'
import WelcomeHeader from '../components/dashboard/WelcomeHeader.jsx'
import SkillMatrix from '../components/dashboard/SkillMatrix.jsx'
import PerformanceStats from '../components/profile/PerformanceStats.jsx'
import RecentMatches from '../components/profile/RecentMatches.jsx'
import './Dashboard.css'
import './Profile.css'

// Player-specific panels read only real data: Riot stats/matches from
// RiotContext, and STRATIX skill scores (none tracked yet -> empty state).
export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page-shell dashboard">
      <WelcomeHeader user={user} />
      <PerformanceStats />
      <div className="two-col-panels dashboard-detail-grid">
        <RecentMatches />
        <SkillMatrix skills={[]} weakestSkill={null} />
      </div>
    </div>
  )
}
