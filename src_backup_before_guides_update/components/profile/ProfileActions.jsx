import { PlayCircle, BarChart3, UserPen, Settings2 } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function ProfileActions({ recommendedNext }) {
  const lessonHref = recommendedNext?.courseId && recommendedNext?.lessonId
    ? `/courses/${recommendedNext.courseId}/lessons/${recommendedNext.lessonId}`
    : '/courses'

  return (
    <div className="panel profile-actions-panel">
      <div className="panel-title-row">
        <h3>Profile Actions</h3>
      </div>
      <div className="profile-actions-body">
        <div className="profile-actions-row">
          <Button to={lessonHref} variant="primary" icon={PlayCircle} className="profile-actions-primary">
            Continue Training
          </Button>
          <Button to="/ai-coach" variant="secondary" icon={BarChart3}>View Match Analysis</Button>
          <Button variant="ghost" icon={UserPen} disabled>
            Edit Profile <span className="coming-soon-badge">Coming soon</span>
          </Button>
          <Button variant="ghost" icon={Settings2} disabled>
            Settings <span className="coming-soon-badge">Coming soon</span>
          </Button>
        </div>
        <p className="profile-actions-message">Small improvements every day lead to big ranks.</p>
      </div>
    </div>
  )
}
