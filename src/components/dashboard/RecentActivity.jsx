import { Activity, ArrowUpRight, CheckCircle2, BookOpen, Bot, GraduationCap } from 'lucide-react'

const iconByType = {
  lesson_complete: CheckCircle2,
  guide_read: BookOpen,
  ai_session: Bot,
  session_start: GraduationCap,
}

export default function RecentActivity({ activity }) {
  return (
    <div className="panel activity-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Momentum log</span><h3>Recent Activity</h3></div>
        <Activity size={20} className="panel-icon" />
      </div>
      <p className="activity-intro">Your latest work feeds the plan above — keep the chain unbroken.</p>
      <ul className="activity-list">
        {activity.map((item, index) => {
          const Icon = iconByType[item.type] || Activity
          return (
            <li key={item.id} className={`activity-item ${index === 0 ? 'activity-item-latest' : ''}`}>
              <span className="activity-icon"><Icon size={16} /></span>
              <div className="activity-text">
                <p className="activity-title">{item.title}</p>
                <span className="activity-meta">{item.meta} <i /> {item.time}</span>
              </div>
              {index === 0 && <ArrowUpRight size={15} className="activity-latest-icon" />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
