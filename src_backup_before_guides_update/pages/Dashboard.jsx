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
  const weakestSkill = user.skillMatrix.reduce((lowest, skill) => (
    skill.score < lowest.score ? skill : lowest
  ))

  return (
    <div className="page-shell dashboard">
      <WelcomeHeader user={user} />
      <section className="dashboard-overview" aria-label="Training overview">
        <div className="section-heading">
          <span className="eyebrow">Season command center</span>
          <p>Turn your next session into measurable rank progress.</p>
        </div>
        <div className="stat-row">
          <StatCard icon={Flame} value={`${user.stats.streakDays} days`} label="Training streak" />
          <StatCard icon={Clock} value={`${user.stats.hoursTrained}h`} label="Hours trained" />
          <StatCard icon={GraduationCap} value={user.stats.coursesCompleted} label="Courses completed" />
          <StatCard icon={BookOpen} value={user.stats.guidesRead} label="Guides read" />
        </div>
      </section>
      <ContinueLearning courseProgress={user.courseProgress} recommendedNext={user.recommendedNext} recentActivity={user.recentActivity} weakestSkill={weakestSkill} />
      <div className="two-col-panels dashboard-detail-grid">
        <SkillMatrix skills={user.skillMatrix} weakestSkill={weakestSkill} />
        <RecentActivity activity={user.recentActivity} />
      </div>
    </div>
  )
}
