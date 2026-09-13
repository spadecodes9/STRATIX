import { Flame, GraduationCap, BookOpen, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import WelcomeHeader from '../components/dashboard/WelcomeHeader.jsx'
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx'
import SkillMatrix from '../components/dashboard/SkillMatrix.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page-shell dashboard">
      <WelcomeHeader user={user} />

      <div className="stat-row">
        <StatCard icon={GraduationCap} value={user.stats.coursesCompleted} label="Courses completed" />
        <StatCard icon={BookOpen} value={user.stats.guidesRead} label="Guides read" />
        <StatCard icon={Flame} value={`${user.stats.streakDays} days`} label="Training streak" />
        <StatCard icon={Clock} value={`${user.stats.hoursTrained}h`} label="Hours trained" />
      </div>

      <ContinueLearning courseProgress={user.courseProgress} recommendedNext={user.recommendedNext} />

      <div className="two-col-panels">
        <SkillMatrix skills={user.skillMatrix} />
        <RecentActivity activity={user.recentActivity} />
      </div>
    </div>
  )
}
