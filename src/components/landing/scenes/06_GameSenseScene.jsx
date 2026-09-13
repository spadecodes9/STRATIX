import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function GameSenseScene({ progress, isVisible }) {
  // Map simulation timeline:
  // [0.00 - 0.30]: Map layout vectors render
  // [0.30 - 0.60]: Defender sightline cones project and lock angles
  // [0.60 - 0.85]: Attacker execute vectors & spike plant initiate
  // [0.85 - 1.00]: Flank route triggers warning alarm -> transitions to Analysis

  const mapScale = 0.85 + progress * 0.25
  const mapRotateX = 25 - progress * 15
  const sightlineAngle = 45 + progress * 60

  const flankDetected = progress > 0.7

  return (
    <div className="scene-container game-sense-scene">
      <CinematicHUDOverlay
        sceneNumber="06"
        sector="RADAR // TACTICAL MAP-SPACE"
        systemStatus={flankDetected ? 'ALERT // RETRO-FLANK IDENTIFIED' : 'RADAR SCAN ACTIVE'}
        progress={progress}
      />

      {/* 2D/Isometric Tactical Map Space */}
      <div
        className="tactical-map-space"
        style={{
          transform: `perspective(800px) rotateX(${mapRotateX}deg) scale(${mapScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 600 450" className="tactical-map-svg" fill="none">
          <defs>
            <linearGradient id="mapWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c2c3a" />
              <stop offset="100%" stopColor="#14141e" />
            </linearGradient>
            <radialGradient id="sightCone" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#3ddc84" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#3ddc84" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3ddc84" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="threatCone" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#ff3b4e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
          <rect width="600" height="450" fill="url(#radarGrid)" />

          {/* Site Architecture Geometry */}
          {/* Site A Box */}
          <rect x="180" y="80" width="240" height="160" fill="url(#mapWallGrad)" stroke="#3a3a4c" strokeWidth="2" />
          <rect x="250" y="130" width="100" height="70" fill="#0c0c12" stroke="#ff3b4e" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="275" y="170" fill="#ff3b4e" fontSize="12" fontWeight="700" fontFamily="var(--font-display)">
            SITE A [PLANT]
          </text>

          {/* Chokepoint & Hallways */}
          {/* Main Corridor */}
          <path d="M 300 400 L 300 240 M 120 280 L 180 200 M 480 280 L 420 200" stroke="#4a4a5e" strokeWidth="3" />
          <path d="M 280 400 L 280 240 M 320 400 L 320 240" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="6 4" />

          {/* Heaven / High Ground Platform */}
          <rect x="360" y="90" width="50" height="40" fill="#1e1e28" stroke="#3ddc84" strokeWidth="1.5" />
          <text x="365" y="115" fill="#3ddc84" fontSize="9" fontFamily="var(--font-display)">
            HEAVEN
          </text>

          {/* Defender 1 (Site Anchor) with Dynamic Sightline Cone */}
          <g transform="translate(385, 110)">
            <path
              d={`M 0 0 L ${Math.cos((sightlineAngle - 25) * Math.PI / 180) * 160} ${Math.sin((sightlineAngle - 25) * Math.PI / 180) * 160} A 160 160 0 0 1 ${Math.cos((sightlineAngle + 25) * Math.PI / 180) * 160} ${Math.sin((sightlineAngle + 25) * Math.PI / 180) * 160} Z`}
              fill="url(#sightCone)"
            />
            <circle cx="0" cy="0" r="8" fill="#3ddc84" stroke="#f2f1ee" strokeWidth="2" />
            <text x="-6" y="-12" fill="#3ddc84" fontSize="10" fontWeight="700">D1</text>
          </g>

          {/* Defender 2 (Crossfire Support) */}
          <g transform="translate(200, 160)">
            <circle cx="0" cy="0" r="8" fill="#3ddc84" stroke="#f2f1ee" strokeWidth="2" />
            <text x="-6" y="-12" fill="#3ddc84" fontSize="10" fontWeight="700">D2</text>
          </g>

          {/* Attacker Execute Paths (Animated by scroll progress) */}
          <path
            d="M 300 390 L 300 240"
            stroke="#ff3b4e"
            strokeWidth="2.5"
            strokeDasharray="180"
            strokeDashoffset={Math.max(0, 180 - progress * 240)}
          />
          {/* Attacker Node */}
          <g transform={`translate(300, ${390 - Math.min(150, progress * 200)})`}>
            <circle cx="0" cy="0" r="9" fill="#ff3b4e" stroke="#f2f1ee" strokeWidth="2" />
            <text x="12" y="4" fill="#ff3b4e" fontSize="11" fontWeight="700">A1 [SPIKE]</text>
          </g>

          {/* Flank Threat Vector */}
          {flankDetected && (
            <g transform="translate(480, 260)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#ff3b4e" strokeWidth="1.5" className="blink-fast" />
              <circle cx="0" cy="0" r="8" fill="#ff3b4e" />
              <text x="12" y="4" fill="#ff3b4e" fontSize="10" fontWeight="700">A2 [FLANK INTERCEPT]</text>
              <line x1="0" y1="0" x2="-80" y2="-60" stroke="#ff3b4e" strokeWidth="1.5" strokeDasharray="4 2" />
            </g>
          )}
        </svg>

        {/* Tactical Map Callout Card */}
        <div className="map-live-telemetry-badge">
          <div className="map-badge-header">
            <span className="text-red">◆ ROUND PREDICTION ENGINE</span>
            <span className="text-success">WIN PROB: 74%</span>
          </div>
          <p>Crossfire angle locked at Heaven. Enemy flank timing: +4.2s.</p>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content game-sense-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">04 // GAME SENSE & MACRO</span>
        </div>

        <h2 className="scene-title-xl">
          SEE THE ROUND <br />
          <span className="text-glow-red">BEFORE IT HAPPENS.</span>
        </h2>

        <p className="scene-desc-md">
          True game sense is reading enemy tendencies, calculating rotate timings, and visualizing
          the map in real-time before you take the fight.
        </p>

        {/* Live Macro Metrics */}
        <div className="tactical-metrics-row">
          <div className="metric-box">
            <span className="metric-box-title">ROTATE READ</span>
            <span className="metric-box-value text-success">3.2s</span>
            <span className="metric-box-sub">Reaction advantage</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">CROSSFIRE EFFICIENCY</span>
            <span className="metric-box-value text-red">91%</span>
            <span className="metric-box-sub">Trade coverage</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">ROUND WIN IMPACT</span>
            <span className="metric-box-value">+1.84</span>
            <span className="metric-box-sub">Clutch expectancy</span>
          </div>
        </div>
      </div>
    </div>
  )
}
