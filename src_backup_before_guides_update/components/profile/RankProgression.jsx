import { Shield, Diamond } from 'lucide-react'

const RANK_LADDER = ['Platinum 3', 'Diamond 1', 'Diamond 2', 'Diamond 3', 'Ascendant 1']

export default function RankProgression({ rank }) {
  const currentLabel = `${rank?.tier ?? ''} ${rank?.division ?? ''}`.trim()
  const currentIndex = RANK_LADDER.findIndex((step) => step === currentLabel)
  const rr = Number(rank?.rr) || 0

  return (
    <div className="panel rank-progression-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Season ladder</span><h3>Rank Progression</h3></div>
        <Shield size={20} className="panel-icon" />
      </div>

      <div className="rank-ladder">
        {RANK_LADDER.map((step, index) => {
          const isCurrent = index === currentIndex
          const isPast = currentIndex >= 0 && index < currentIndex
          return (
            <div
              key={step}
              className={
                'rank-ladder-step' +
                (isCurrent ? ' rank-ladder-step-current' : '') +
                (isPast ? ' rank-ladder-step-past' : '')
              }
            >
              <span className="rank-ladder-dot">{isCurrent && <Diamond size={9} strokeWidth={3} />}</span>
              <span className="rank-ladder-label">{step}</span>
            </div>
          )
        })}
      </div>

      <div className="rank-ladder-progress">
        <div className="rank-ladder-progress-row">
          <span>{currentLabel || 'Unranked'}</span>
          <span>{rr} / 100 RR</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={rr} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, rr))}%` }} />
        </div>
        <span className="rank-ladder-caption">
          {Math.max(0, 100 - rr)} RR to {RANK_LADDER[currentIndex + 1] || 'next rank'}
        </span>
      </div>
    </div>
  )
}
