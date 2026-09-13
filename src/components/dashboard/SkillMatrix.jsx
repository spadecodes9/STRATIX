import { BarChart3 } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar.jsx'

function severity(score) {
  if (score < 60) return 'critical'
  if (score < 75) return 'moderate'
  return 'stable'
}

export default function SkillMatrix({ skills }) {
  return (
    <div className="panel">
      <div className="panel-title-row">
        <h3>Skill Matrix</h3>
        <BarChart3 size={18} className="panel-icon" />
      </div>
      <div className="skill-matrix-list">
        {skills.map((s) => (
          <div key={s.skill} className={`skill-row skill-row-${severity(s.score)}`}>
            <div className="skill-row-label">
              <span>{s.skill}</span>
              <span className="skill-row-score">{s.score}</span>
            </div>
            <ProgressBar percent={s.score} />
          </div>
        ))}
      </div>
    </div>
  )
}
