import { Sparkles, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import Button from '../ui/Button.jsx'

const RING_R = 42
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R

export default function TrainingProgress({ trainingObjective, recommendedNext }) {
  const progressPercent = Math.max(0, Math.min(100, trainingObjective?.progressPercent ?? 0))
  const dashOffset = RING_CIRCUMFERENCE * (1 - progressPercent / 100)
  const checklist = trainingObjective?.checklist ?? []

  const lessonHref = '/guides'

  return (
    <div className="panel training-progress-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Live training analysis</span><h3>Training Progress</h3></div>
        <Sparkles size={20} className="panel-icon" />
      </div>

      <div className="training-progress-ring-row">
        <div className="training-progress-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={RING_R} className="training-ring-track" />
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              className="training-ring-fill"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="training-progress-ring-copy">
            <strong>{progressPercent}%</strong>
            <span>Complete</span>
          </div>
        </div>

        <div className="training-objective">
          <span className="training-objective-label">Current Objective</span>
          <strong>{trainingObjective?.title || 'No active objective set'}</strong>

          <ul className="training-checklist">
            {checklist.map((item) => (
              <li key={item.label} className={item.complete ? 'is-complete' : ''}>
                {item.complete ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {recommendedNext && (
        <div className="training-next-action">
          <div>
            <span>Next Recommended Action</span>
            <strong>{recommendedNext.title}</strong>
          </div>
          <Button to={lessonHref} variant="secondary" icon={ArrowRight}>Continue</Button>
        </div>
      )}
    </div>
  )
}
