import { TriangleAlert, ArrowRight } from 'lucide-react'
import Button from '../ui/Button.jsx'

const ANALYSIS_BY_SKILL = {
  'Positioning': 'Overextending during mid-round rotations and holding predictable angles after picks.',
  'Game Sense': 'Slow to react to enemy rotations, giving up information after early engagements.',
  'Communication': 'Inconsistent callouts during retakes and post-plant situations.',
  'Economy Mgmt': 'Buying inconsistently round to round, weakening force-buy and eco discipline.',
  'Aim & Mechanics': 'Crosshair placement drifts off common angles during holds.',
  'Utility Usage': 'Utility thrown reactively instead of on setup timings.',
}

export default function WeaknessPanel({ weakestSkill, recommendedNext }) {
  if (!weakestSkill) return null

  const analysis = ANALYSIS_BY_SKILL[weakestSkill.skill]
    || 'This skill is trailing the rest of your profile and is the highest-leverage area to train next.'

  const lessonHref = recommendedNext?.courseId && recommendedNext?.lessonId
    ? `/courses/${recommendedNext.courseId}/lessons/${recommendedNext.lessonId}`
    : recommendedNext?.courseId
      ? `/courses/${recommendedNext.courseId}`
      : '/courses'

  return (
    <div className="panel weakness-panel">
      <div className="weakness-panel-header">
        <span className="eyebrow weakness-eyebrow"><TriangleAlert size={14} /> Weakness Detected</span>
      </div>

      <div className="weakness-flow">
        <div className="weakness-flow-step weakness-flow-problem">
          <span className="weakness-flow-label">Problem</span>
          <strong className="weakness-flow-skill">{weakestSkill.skill}</strong>
        </div>

        <div className="weakness-flow-step weakness-flow-signal">
          <span className="weakness-flow-label">Signal</span>
          <div className="weakness-signal-row">
            <strong className="weakness-signal">{weakestSkill.score}<em>/100</em></strong>
            <div className="weakness-signal-track">
              <div className="weakness-signal-fill" style={{ width: `${Math.max(0, Math.min(100, weakestSkill.score))}%` }} />
            </div>
          </div>
        </div>

        <div className="weakness-flow-step weakness-flow-analysis">
          <span className="weakness-flow-label">Analysis</span>
          <p>{analysis}</p>
        </div>

        <div className="weakness-flow-step weakness-flow-action">
          <span className="weakness-flow-label">Next Action</span>
          <p>Complete {weakestSkill.skill.toLowerCase()} drills and review scenario training to close this gap.</p>
          <Button to={lessonHref} variant="primary" icon={ArrowRight} className="weakness-cta">Train This Skill</Button>
        </div>
      </div>
    </div>
  )
}
