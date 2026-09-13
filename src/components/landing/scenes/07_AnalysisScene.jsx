import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

const SKILL_AXES = [
  { name: 'AIM', score: 78, angle: -90, status: 'OPTIMAL' },
  { name: 'DECISION MAKING', score: 82, angle: -18, status: 'STRONG' },
  { name: 'GAME SENSE', score: 88, angle: 54, status: 'EXCELLENT' },
  { name: 'UTILITY', score: 64, angle: 126, status: 'ADEQUATE' },
  { name: 'POSITIONING', score: 57, angle: 198, status: 'CRITICAL GAP', isGap: true },
]

export default function AnalysisScene({ progress, isVisible }) {
  // Radar expansion and gap highlight
  // [0.00 - 0.50]: Radar polygon grows to full values
  // [0.50 - 1.00]: Positioning axis pulses in warning crimson, diagnostic telemetry details expand

  const radarScale = 0.3 + progress * 0.7
  const gapAlertActive = progress > 0.45

  // Compute SVG polygon points for 5 axes
  const center = 180
  const maxRadius = 130

  const polygonPoints = SKILL_AXES.map((axis) => {
    const currentScore = progress * axis.score
    const rad = (axis.angle * Math.PI) / 180
    const r = (currentScore / 100) * maxRadius
    const x = center + r * Math.cos(rad)
    const y = center + r * Math.sin(rad)
    return `${x},${y}`
  }).join(' ')

  const outerPoints = SKILL_AXES.map((axis) => {
    const rad = (axis.angle * Math.PI) / 180
    const x = center + maxRadius * Math.cos(rad)
    const y = center + maxRadius * Math.sin(rad)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="scene-container analysis-scene">
      <CinematicHUDOverlay
        sceneNumber="07"
        sector="NEURAL // DIAGNOSTIC MATRIX"
        systemStatus={gapAlertActive ? 'BOTTLENECK DETECTED // POSITIONING' : 'ANALYZING TELEMETRY'}
        progress={progress}
      />

      {/* Spider/Radar Polygon Visualizer */}
      <div
        className="diagnostic-radar-wrapper"
        style={{
          transform: `scale(${radarScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.8),
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 360 360" className="diagnostic-radar-svg">
          <defs>
            <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0.05" />
            </radialGradient>
            <filter id="gapGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Reference Rings */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
            <polygon
              key={ratio}
              points={SKILL_AXES.map((axis) => {
                const rad = (axis.angle * Math.PI) / 180
                const r = ratio * maxRadius
                return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`
              }).join(' ')}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Radial Spokes */}
          {SKILL_AXES.map((axis) => {
            const rad = (axis.angle * Math.PI) / 180
            const x = center + maxRadius * Math.cos(rad)
            const y = center + maxRadius * Math.sin(rad)
            return (
              <line
                key={axis.name}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={axis.isGap ? '#ff3b4e' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={axis.isGap ? '2' : '1'}
                strokeDasharray={axis.isGap ? '4 2' : 'none'}
              />
            )
          })}

          {/* Filled Skill Polygon */}
          <polygon
            points={polygonPoints}
            fill="url(#radarFillGrad)"
            stroke="#ff3b4e"
            strokeWidth="2.5"
          />

          {/* Data Vertices */}
          {SKILL_AXES.map((axis) => {
            const currentScore = progress * axis.score
            const rad = (axis.angle * Math.PI) / 180
            const r = (currentScore / 100) * maxRadius
            const x = center + r * Math.cos(rad)
            const y = center + r * Math.sin(rad)
            return (
              <g key={axis.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={axis.isGap ? 7 : 5}
                  fill={axis.isGap ? '#ff3b4e' : '#f2f1ee'}
                  stroke="#08080a"
                  strokeWidth="2"
                  filter={axis.isGap ? 'url(#gapGlow)' : undefined}
                />
              </g>
            )
          })}
        </svg>

        {/* Highlighted Gap Alert Card */}
        {gapAlertActive && (
          <div className="gap-alert-floating-badge">
            <div className="gap-badge-pulse" />
            <div className="gap-badge-text">
              <span className="gap-title">PRIMARY BOTTLENECK</span>
              <strong className="text-red">POSITIONING // 57 / 100 SIGNAL</strong>
              <p>Exposed crossfire angles & over-peeking in post-plant scenarios.</p>
            </div>
          </div>
        )}
      </div>

      {/* Analysis UI Content */}
      <div className="scene-content analysis-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">05 // TELEMETRY DIAGNOSTICS</span>
        </div>

        <h2 className="scene-title-xl">
          FIND WHAT IS <br />
          <span className="text-glow-red">HOLDING YOU BACK.</span>
        </h2>

        <p className="scene-desc-md">
          Most players grind aim trainers when their problem is positioning. STRATIX continuously
          isolates your skill matrix to pinpoint the exact failure modes costing you rounds.
        </p>

        {/* 5-Axis Score Breakdown List */}
        <div className="skill-breakdown-list">
          {SKILL_AXES.map((axis) => (
            <div
              key={axis.name}
              className={`skill-breakdown-item ${axis.isGap ? 'skill-item-gap' : ''}`}
            >
              <div className="skill-item-header">
                <span className="skill-item-name">{axis.name}</span>
                <span className={`skill-item-score ${axis.isGap ? 'text-red' : 'text-white'}`}>
                  {Math.round(progress * axis.score)} / 100
                </span>
              </div>
              <div className="skill-item-track">
                <div
                  className="skill-item-fill"
                  style={{
                    width: `${progress * axis.score}%`,
                    background: axis.isGap ? 'var(--red)' : 'linear-gradient(90deg, #4a4a5e, #9a9aa4)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
