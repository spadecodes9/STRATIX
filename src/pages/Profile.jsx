import { useNavigate } from 'react-router-dom'
import { Calendar, LogOut, GraduationCap, BookOpen, Flame, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getCourseById } from '../data/courses.js'
import SkillMatrix from '../components/dashboard/SkillMatrix.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Button from '../components/ui/Button.jsx'
import '../pages/Dashboard.css'
import './Profile.css'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const joinDate = new Date(user.joinDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  })

  const activeCourses = Object.entries(user.courseProgress)
    .map(([id, pct]) => ({ course: getCourseById(id), pct }))
    .filter((c) => c.course)

  return (
    <div className="page-shell dashboard">
      <div className="profile-header panel">
        <div className="profile-identity">
          <div className="profile-avatar">{user.avatarInitials}</div>
          <div>
            <h1>{user.username}<span className="profile-tag">{user.tag}</span></h1>
            <div className="profile-meta-row">
              <span><Calendar size={13} /> Joined {joinDate}</span>
              <span>Peak rank: {user.rank.peak}</span>
            </div>
          </div>
        </div>
        <div className="profile-header-actions">
          <div className="rank-card-rr">
            <span className="rr-value">{user.rank.tier} {user.rank.division}</span>
            <span className="rr-label">{user.rank.rr} RR</span>
          </div>
          <Button variant="secondary" icon={LogOut} onClick={handleSignOut}>Sign Out</Button>
        </div>
      </div>

      <div className="stat-row">
        <StatCard icon={GraduationCap} value={user.stats.coursesCompleted} label="Courses completed" />
        <StatCard icon={BookOpen} value={user.stats.guidesRead} label="Guides read" />
        <StatCard icon={Flame} value={`${user.stats.streakDays} days`} label="Training streak" />
        <StatCard icon={Clock} value={`${user.stats.hoursTrained}h`} label="Hours trained" />
      </div>

      <div className="panel">
        <div className="panel-title-row">
          <h3>Course Progress</h3>
        </div>
        <div className="profile-course-progress-list">
          {activeCourses.map(({ course, pct }) => (
            <div key={course.id} className="profile-progress-row">
              <div className="profile-progress-row-top">
                <span>{course.title}</span>
                <span>{pct}%</span>
              </div>
              <ProgressBar percent={pct} />
            </div>
          ))}
        </div>
      </div>

      <div className="two-col-panels">
        <SkillMatrix skills={user.skillMatrix} />
        <RecentActivity activity={user.recentActivity} />
      </div>
    </div>
  )
}
