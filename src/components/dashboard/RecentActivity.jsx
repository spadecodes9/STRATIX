import { Activity, CheckCircle2, BookOpen, Bot, GraduationCap } from 'lucide-react'

const iconByType = {
  lesson_complete: CheckCircle2,
  guide_read: BookOpen,
  ai_session: Bot,
  course_start: GraduationCap,
}

export default function RecentActivity({ activity }) {
  return (
    <div className="panel">
      <div className="panel-title-row">
        <h3>Recent Activity</h3>
        <Activity size={18} className="panel-icon" />
      </div>
      <ul className="activity-list">
        {activity.map((item) => {
          const Icon = iconByType[item.type] || Activity
          return (
            <li key={item.id} className="activity-item">
              <span className="activity-icon-wrap">
                <Icon size={15} className="activity-icon" />
              </span>
              <div className="activity-text">
                <p className="activity-title">{item.title}</p>
                <span className="activity-meta">{item.meta} · {item.time}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
