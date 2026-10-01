import { AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'

export default function SkillMatrix({ skills, weakestSkill }) {
  return (
    <div className="panel skill-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Performance scan</span><h3>Skill Matrix</h3></div>
        <BarChart3 size={20} className="panel-icon" />
      </div>
      {weakestSkill && (
        <div className="weak-skill-callout">
          <AlertTriangle size={18} />
          <div><span>Priority improvement</span><strong>{weakestSkill.skill} <em>{weakestSkill.score}/100</em></strong></div>
          <Button to="/courses/map-control-mastery" variant="ghost" icon={ArrowRight}>Train</Button>
        </div>
      )}
      <div className="skill-matrix-list">
        {skills.map((skill) => {
          const isWeakest = weakestSkill && skill.skill === weakestSkill.skill
          return (
            <div key={skill.skill} className={`skill-row ${isWeakest ? 'skill-row-priority' : ''}`}>
              <div className="skill-row-label">
                <span>{skill.skill}{isWeakest && <small>Focus</small>}</span>
                <span className="skill-row-score">{skill.score}</span>
              </div>
              <ProgressBar percent={skill.score} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
