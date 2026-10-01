import { Radar as RadarIcon, AlertTriangle } from 'lucide-react'
import '../riot/riot.css'

// Static competitive benchmark line — not user data, used only as a
// reference overlay on the radar so the player can see relative standing.
const COMPETITIVE_AVG = {
  'Aim & Mechanics': 68,
  'Game Sense': 64,
  'Utility Usage': 70,
  'Positioning': 66,
  'Communication': 60,
  'Economy Mgmt': 63,
}

const SHORT_LABEL = {
  'Aim & Mechanics': 'Aim',
  'Game Sense': 'Game Sense',
  'Utility Usage': 'Utility Usage',
  'Positioning': 'Positioning',
  'Communication': 'Communication',
  'Economy Mgmt': 'Economy Mgmt',
}

const SIZE = 300
const CENTER = SIZE / 2
const MAX_R = 78
const LABEL_R_FRACTION = 1.22
const RINGS = [0.25, 0.5, 0.75, 1]

function pointAt(index, total, fraction) {
  const angle = -Math.PI / 2 + index * ((2 * Math.PI) / total)
  const r = MAX_R * fraction
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

function polygonPath(values, total) {
  return values
    .map((value, index) => pointAt(index, total, Math.max(0, Math.min(100, value)) / 100).join(','))
    .join(' ')
}

export default function SkillRadar({ skills, weakestSkill }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="panel skill-radar-panel">
        <div className="panel-title-row">
          <div><span className="eyebrow">Skill analysis</span><h3>Skill Matrix</h3></div>
          <RadarIcon size={20} className="panel-icon" />
        </div>
        <div className="riot-empty"><strong>No skill scores yet</strong><p>Skill scoring isn&apos;t live yet. STRATIX shows nothing here rather than estimated scores.</p></div>
      </div>
    )
  }

  const total = skills.length
  const userValues = skills.map((s) => s.score)
  const avgValues = skills.map((s) => COMPETITIVE_AVG[s.skill] ?? 65)

  return (
    <div className="panel skill-radar-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Skill analysis</span><h3>Skill Matrix</h3></div>
        <RadarIcon size={20} className="panel-icon" />
      </div>

      {weakestSkill && (
        <div className="weak-skill-callout">
          <AlertTriangle size={18} />
          <div>
            <span>Priority improvement</span>
            <strong>{weakestSkill.skill} <em>{weakestSkill.score}/100</em></strong>
          </div>
        </div>
      )}

      <div className="skill-radar-body">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="skill-radar-svg" role="img" aria-label="Skill radar chart">
          {RINGS.map((fraction) => (
            <polygon
              key={fraction}
              points={skills.map((_, index) => pointAt(index, total, fraction).join(',')).join(' ')}
              className="skill-radar-ring"
            />
          ))}

          {skills.map((skill, index) => {
            const [x, y] = pointAt(index, total, 1)
            return <line key={skill.skill} x1={CENTER} y1={CENTER} x2={x} y2={y} className="skill-radar-axis" />
          })}

          <polygon points={polygonPath(avgValues, total)} className="skill-radar-avg-polygon" />
          <polygon points={polygonPath(userValues, total)} className="skill-radar-user-polygon" />

          {skills.map((skill, index) => {
            const [x, y] = pointAt(index, total, skill.score / 100)
            const isWeakest = weakestSkill && skill.skill === weakestSkill.skill
            return (
              <circle
                key={skill.skill}
                cx={x}
                cy={y}
                r={isWeakest ? 5 : 3.5}
                className={'skill-radar-point' + (isWeakest ? ' skill-radar-point-priority' : '')}
              />
            )
          })}

          {skills.map((skill, index) => {
            const [x, y] = pointAt(index, total, LABEL_R_FRACTION)
            const isWeakest = weakestSkill && skill.skill === weakestSkill.skill
            return (
              <text
                key={skill.skill}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={'skill-radar-label' + (isWeakest ? ' skill-radar-label-priority' : '')}
              >
                {SHORT_LABEL[skill.skill] || skill.skill}
                <tspan className="skill-radar-value" x={x} dy="11">{skill.score}</tspan>
              </text>
            )
          })}
        </svg>

        <div className="skill-radar-legend">
          <span className="skill-radar-legend-item"><i className="skill-radar-legend-dot skill-radar-legend-dot-user" /> Your Stats</span>
          <span className="skill-radar-legend-item"><i className="skill-radar-legend-dot skill-radar-legend-dot-avg" /> Competitive Avg</span>
        </div>
      </div>
    </div>
  )
}
