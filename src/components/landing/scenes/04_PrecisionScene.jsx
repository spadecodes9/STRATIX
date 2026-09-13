import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function PrecisionScene({ progress, isVisible }) {
  // Reticle moves between 3 target nodes as scroll advances:
  // Node 1: [0.00 - 0.33]
  // Node 2: [0.33 - 0.66]
  // Node 3: [0.66 - 1.00]

  const reticleX = progress < 0.33
    ? 30 + (progress / 0.33) * 20
    : progress < 0.66
    ? 50 + ((progress - 0.33) / 0.33) * 20
    : 70 - ((progress - 0.66) / 0.34) * 30

  const reticleY = progress < 0.33
    ? 45 - (progress / 0.33) * 10
    : progress < 0.66
    ? 35 + ((progress - 0.33) / 0.33) * 15
    : 50 - ((progress - 0.66) / 0.34) * 8

  const target1Locked = progress > 0.25
  const target2Locked = progress > 0.58
  const target3Locked = progress > 0.88

  const tracerActive = progress > 0.2 && progress < 0.95

  return (
    <div className="scene-container precision-scene">
      <CinematicHUDOverlay
        sceneNumber="04"
        sector="BALLISTICS // PRECISION RANGE"
        systemStatus={target3Locked ? 'TARGET ACQUIRED // 3/3 HIT' : 'CALIBRATING MICRO-ADJUST'}
        progress={progress}
      />

      {/* Grid Alignment Plane */}
      <div className="precision-grid-plane" aria-hidden="true" />

      {/* 3 Holographic Target Dummies */}
      <div className="precision-targets-layer" aria-hidden="true">
        {/* Target 1 */}
        <div
          className={`precision-target-orb target-1 ${target1Locked ? 'target-locked' : ''}`}
          style={{ top: '35%', left: '30%' }}
        >
          <div className="target-ring" />
          <div className="target-core" />
          <div className="target-readout">
            <span>T-01 // LONG</span>
            <strong className="text-red">145 DMG</strong>
          </div>
        </div>

        {/* Target 2 */}
        <div
          className={`precision-target-orb target-2 ${target2Locked ? 'target-locked' : ''}`}
          style={{ top: '50%', left: '50%' }}
        >
          <div className="target-ring" />
          <div className="target-core" />
          <div className="target-readout">
            <span>T-02 // MID</span>
            <strong className="text-success">160 DMG [HEAD]</strong>
          </div>
        </div>

        {/* Target 3 */}
        <div
          className={`precision-target-orb target-3 ${target3Locked ? 'target-locked' : ''}`}
          style={{ top: '42%', left: '70%' }}
        >
          <div className="target-ring" />
          <div className="target-core" />
          <div className="target-readout">
            <span>T-03 // SHORT</span>
            <strong className="text-red">145 DMG</strong>
          </div>
        </div>
      </div>

      {/* Supersonic Tracer Vector Line */}
      {tracerActive && (
        <svg
          className="precision-tracer-svg"
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="50"
            y1="95"
            x2={reticleX}
            y2={reticleY}
            stroke="#ff3b4e"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
        </svg>
      )}

      {/* Precision Dynamic Aim Reticle */}
      <div
        className="tactical-aim-reticle"
        style={{
          left: `${reticleX}%`,
          top: `${reticleY}%`,
          transform: `translate(-50%, -50%) rotate(${progress * 90}deg)`,
        }}
        aria-hidden="true"
      >
        <div className="reticle-outer-bracket bracket-tl" />
        <div className="reticle-outer-bracket bracket-tr" />
        <div className="reticle-outer-bracket bracket-bl" />
        <div className="reticle-outer-bracket bracket-br" />
        <div className="reticle-center-dot" />
        <div className="reticle-angle-dial">
          <span>{Math.round(progress * 180)}°</span>
        </div>
      </div>

      {/* Minimal Tactical Content */}
      <div className="scene-content precision-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">02 // PRECISION MECHANICS</span>
        </div>

        <h2 className="scene-title-xl">
          TRAIN WHAT YOU <span className="text-glow-red">MISS.</span>
        </h2>

        <p className="scene-desc-md">
          Raw aim is not lucky flicks. It is repeatable angle isolation, micro-crosshair adjustment,
          and consistent elevation discipline under pressure.
        </p>

        {/* Live Precision Stats */}
        <div className="tactical-metrics-row">
          <div className="metric-box">
            <span className="metric-box-title">HEADSHOT RATIO</span>
            <span className="metric-box-value text-success">38.4%</span>
            <span className="metric-box-sub">Top 1.2% benchmark</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">MICRO-CORRECTION</span>
            <span className="metric-box-value text-red">84ms</span>
            <span className="metric-box-sub">Target acquisition</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">FIRST BULLET ACCURACY</span>
            <span className="metric-box-value">96.8%</span>
            <span className="metric-box-sub">Zero spray error</span>
          </div>
        </div>
      </div>
    </div>
  )
}
