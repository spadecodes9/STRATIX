import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getCourseById } from '../data/courses.js'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import QuickStatsStrip from '../components/profile/QuickStatsStrip.jsx'
import PerformanceStats from '../components/profile/PerformanceStats.jsx'
import WeaknessPanel from '../components/profile/WeaknessPanel.jsx'
import SkillRadar from '../components/profile/SkillRadar.jsx'
import RecentMatches from '../components/profile/RecentMatches.jsx'
import TrainingProgress from '../components/profile/TrainingProgress.jsx'
import RankProgression from '../components/profile/RankProgression.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import ProfileActions from '../components/profile/ProfileActions.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import '../pages/Dashboard.css'
import './Profile.css'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const joinDate = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : '—'

  const courseProgress = user.courseProgress || {}
  const skillMatrix = user.skillMatrix || []

  const weakestSkill = skillMatrix.length > 0
    ? skillMatrix.reduce((lowest, skill) => (skill.score < lowest.score ? skill : lowest))
    : null

  const activeCourses = Object.entries(courseProgress)
    .map(([id, pct]) => ({ course: getCourseById(id), pct }))
    .filter((c) => c.course)

  return (
    <div className="page-shell dashboard profile-page">
      <ProfileHeader user={user} joinDate={joinDate} onSignOut={handleSignOut} />

      <QuickStatsStrip user={user} />

      <PerformanceStats stats={user.performanceStats} />

      <div className="two-col-panels profile-command-row">
        <SkillRadar skills={skillMatrix} weakestSkill={weakestSkill} />
        {weakestSkill && (
          <WeaknessPanel weakestSkill={weakestSkill} recommendedNext={user.recommendedNext} />
        )}
      </div>

      <div className="two-col-panels">
        <RecentMatches matches={user.recentMatches} />
        <TrainingProgress
          trainingObjective={user.trainingObjective}
          recommendedNext={user.recommendedNext}
        />
      </div>

      <div className="two-col-panels">
        <RankProgression rank={user.rank} />
        <RecentActivity activity={user.recentActivity || []} />
      </div>

      {activeCourses.length > 0 && (
        <div className="panel course-progress-panel">
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
      )}

      <ProfileActions recommendedNext={user.recommendedNext} />
    </div>
  )
}
