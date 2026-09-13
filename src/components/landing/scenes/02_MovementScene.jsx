import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function MovementScene({ progress, isVisible }) {
  // Movement from Right -> Left - FULL VIEWPORT CROSSING
  // 0% -> outside right (110vw), 100% -> outside left (-40vw)
  const charX = 110 - progress * 150 // Full crossing
  const charY = Math.sin(progress * Math.PI * 1.5) * 8 // Subtle vertical bob
  const charScale = 1.0 + Math.sin(progress * Math.PI) * 0.15
  const trailLength = Math.sin(progress * Math.PI) * 120
  const velocity = Math.round(180 + progress * 280)

  // Scene transition overlap - fade in early, fade out late
  const sceneOpacity = progress < 0.15
    ? progress / 0.15
    : progress > 0.85
    ? (1 - progress) / 0.15
    : 1

  return (
    <div className="scene-container movement-scene" style={{ opacity: sceneOpacity }}>
      <CinematicHUDOverlay
        sceneNumber="02"
        sector="KINETIC // MOVEMENT VECTOR"
        systemStatus="HIGH-VELOCITY INTERCEPT"
        progress={progress}
      />

      {/* Atmospheric Speed Distortion Lines */}
      <div className="speed-lines-container" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="speed-line"
            style={{
              top: `${12 + i * 11}%`,
              transform: `scaleX(${0.3 + progress * 1.2}) translateX(${(1 - progress) * (i % 2 === 0 ? 120 : -80)}px)`,
              opacity: 0.2 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      {/* Original Agile Tactical Character Silhouette - LARGE VIEWPORT SCALE */}
      <div
        className="tactical-operative-silhouette"
        style={{
          transform: `translate3d(${charX}vw, ${charY}vh, 0) scale(${charScale})`,
        }}
        aria-hidden="true"
      >
        {/* Trailing Speed Ghost Trails */}
        <div
          className="ghost-trail trail-1"
          style={{
            transform: `translateX(${trailLength * 0.4}px) scale(0.95)`,
            opacity: 0.4,
          }}
        />
        <div
          className="ghost-trail trail-2"
          style={{
            transform: `translateX(${trailLength * 0.8}px) scale(0.9)`,
            opacity: 0.2,
          }}
        />

        {/* Tactical Operative SVG */}
        <svg
          viewBox="0 0 300 400"
          className="operative-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="opGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c2c38" />
              <stop offset="50%" stopColor="#14141c" />
              <stop offset="100%" stopColor="#08080c" />
            </linearGradient>
            <linearGradient id="visorglow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff3b4e" />
              <stop offset="100%" stopColor="#ff7a88" />
            </linearGradient>
          </defs>

          {/* Dynamic Dashing Posture */}
          {/* Head & Helmet */}
          <path
            d="M 120 70 L 160 50 L 180 80 L 160 110 L 120 100 Z"
            fill="url(#opGrad)"
            stroke="#ff3b4e"
            strokeWidth="1.5"
          />
          {/* Angular Visor Blade */}
          <path
            d="M 115 75 L 145 68 L 135 85 Z"
            fill="url(#visorglow)"
          />
          {/* Torso & Tactical Armor Plates */}
          <path
            d="M 125 105 L 175 95 L 210 180 L 150 210 L 110 160 Z"
            fill="url(#opGrad)"
            stroke="#2e2e3c"
            strokeWidth="2"
          />
          {/* Kinetic Energy Conduit Lines */}
          <path
            d="M 140 115 L 165 145 L 140 185"
            stroke="#ff3b4e"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          {/* Forward Arm & Tactical Gripper */}
          <path
            d="M 175 110 L 230 140 L 260 135 L 270 145 L 230 160 L 180 140 Z"
            fill="url(#opGrad)"
            stroke="#3a3a4c"
            strokeWidth="1.5"
          />
          {/* Trailing Arm with Energy Ribbon */}
          <path
            d="M 115 130 L 70 170 L 40 210 L 30 200 L 60 160 Z"
            fill="url(#opGrad)"
            stroke="#ff3b4e"
            strokeWidth="1.2"
          />
          {/* Kinetic Trailing Streamers */}
          <path
            d="M 40 210 Q 10 240 -60 260"
            stroke="rgba(255, 59, 78, 0.7)"
            strokeWidth="2.5"
            strokeDasharray="8 4"
          />
          {/* Forward Dashing Leg */}
          <path
            d="M 160 200 L 220 260 L 250 340 L 225 350 L 195 285 L 145 220 Z"
            fill="url(#opGrad)"
            stroke="#2e2e3c"
            strokeWidth="1.5"
          />
          {/* Trailing Leg in Full Extension */}
          <path
            d="M 120 200 L 75 250 L 20 280 L 10 265 L 60 235 Z"
            fill="url(#opGrad)"
            stroke="#ff3b4e"
            strokeWidth="1.5"
          />
        </svg>

        {/* Telemetry Vector Tag attached to character */}
        <div className="char-telemetry-tag">
          <span className="text-red">◆ AGENT_VECTOR // ACTIVE</span>
          <span>VEL: {velocity} u/s</span>
        </div>
      </div>

      {/* Minimal UI Overlay */}
      <div className="scene-content movement-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">01 // MOVEMENT ENGINE</span>
        </div>

        <h2 className="scene-title-xl">
          READ THE <span className="text-glow-red">MOMENT.</span>
        </h2>

        <p className="scene-desc-md">
          In high-tier lobbies, gunfights are won before the first shot is fired.
          Master counter-strafing deadzones, peek geometry, and momentum preservation
          to make yourself impossible to hit.
        </p>

        {/* Live Vector Metrics Panel */}
        <div className="tactical-metrics-row">
          <div className="metric-box">
            <span className="metric-box-title">DEADZONE ERROR</span>
            <span className="metric-box-value text-success">&lt; 32ms</span>
            <span className="metric-box-sub">Sub-frame accuracy</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">PEEK ADVANTAGE</span>
            <span className="metric-box-value text-red">MAXIMUM</span>
            <span className="metric-box-sub">Geometric angle slice</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">COUNTER-STRAFE</span>
            <span className="metric-box-value">100% RECOVERY</span>
            <span className="metric-box-sub">Instant first-shot reset</span>
          </div>
        </div>
      </div>
    </div>
  )
}
