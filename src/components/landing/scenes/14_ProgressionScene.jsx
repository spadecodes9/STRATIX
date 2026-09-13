import { TrendingUp, Award, Zap, Shield } from 'lucide-react'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

const PROGRESSION_METRICS = [
  { label: 'Aim Precision', baseline: 54, current: 78, delta: '+24%', color: '#ff3b4e' },
  { label: 'Game Sense', baseline: 42, current: 61, delta: '+19%', color: '#3ddc84' },
  { label: 'Utility Leverage', baseline: 48, current: 82, delta: '+34%', color: '#ffb648' },
  { label: 'Positioning Index', baseline: 36, current: 57, delta: '+21%', color: '#ff5c6d' },
]

export default function ProgressionScene({ progress, isVisible }) {
  const chartScale = 0.92 + progress * 0.08
  const chartY = (1 - progress) * 35

  // Generate dynamic line graph points
  const points = [
    { x: 0, y: 160 },
    { x: 80, y: 145 },
    { x: 160, y: 120 },
    { x: 240, y: 95 },
    { x: 320, y: 65 },
    { x: 400, y: 40 },
  ]

  const polylineStr = points
    .map((p) => `${p.x},${p.y + (1 - progress) * (200 - p.y)}`)
    .join(' ')

  return (
    <div className="scene-container progression-scene">
      <CinematicHUDOverlay
        sceneNumber="14"
        sector="TELEMETRY // HISTORICAL PROGRESSION"
        systemStatus="MMR TRAJECTORY // ASCENDING"
        progress={progress}
      />

      {/* Dynamic Animated Growth Graph */}
      <div
        className="progression-graph-wrapper"
        style={{
          transform: `translateY(${chartY}px) scale(${chartScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        <div className="graph-header-meta">
          <div className="graph-tag">
            <TrendingUp size={16} className="text-red" />
            <span>30-DAY SKILL VECTOR ACCELERATION</span>
          </div>
          <span className="graph-badge-ascendant">PROMOTION TRAJECTORY: +380 RR</span>
        </div>

        {/* SVG Curve Visualization */}
        <div className="svg-chart-box">
          <svg viewBox="0 0 400 200" className="progression-svg" fill="none">
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Background Horizontal Grid Lines */}
            {[40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="400"
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Gradient Area Fill */}
            <polygon
              points={`0,200 ${polylineStr} 400,200`}
              fill="url(#chartGrad)"
            />

            {/* Primary Glowing Curve */}
            <polyline
              points={polylineStr}
              stroke="#ff3b4e"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Active Data Node */}
            <g transform={`translate(400, ${40 + (1 - progress) * 160})`}>
              <circle cx="0" cy="0" r="7" fill="#ff3b4e" stroke="#f2f1ee" strokeWidth="2" />
              <text x="-40" y="-12" fill="#ff3b4e" fontSize="11" fontWeight="700">
                IMMORTAL 1
              </text>
            </g>
          </svg>
        </div>

        {/* 4 Skill Metric Deltas */}
        <div className="progression-metrics-grid">
          {PROGRESSION_METRICS.map((m) => {
            const currentVal = Math.round(m.baseline + progress * (m.current - m.baseline))
            return (
              <div key={m.label} className="prog-metric-card">
                <span className="prog-metric-label">{m.label}</span>
                <div className="prog-metric-val-row">
                  <strong className="prog-metric-val">{currentVal}</strong>
                  <span className="prog-metric-delta text-success">{m.delta}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${currentVal}%`, background: m.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content progression-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">12 // MEASURABLE EVOLUTION</span>
        </div>

        <h2 className="scene-title-xl">
          SEE THE PLAYER <br />
          <span className="text-glow-red">YOU ARE BECOMING.</span>
        </h2>

        <p className="scene-desc-md">
          Track tangible mechanical growth week over week. Watch your first-bullet accuracy climb,
          your utility leverage multiply, and your rank follow naturally.
        </p>

        <div className="progression-tier-timeline">
          <span className="tier-step tier-passed">GOLD</span>
          <span className="tier-arrow">→</span>
          <span className="tier-step tier-passed">PLATINUM</span>
          <span className="tier-arrow">→</span>
          <span className="tier-step tier-active">DIAMOND 2</span>
          <span className="tier-arrow">→</span>
          <span className="tier-step tier-projected">ASCENDANT</span>
        </div>
      </div>
    </div>
  )
}
