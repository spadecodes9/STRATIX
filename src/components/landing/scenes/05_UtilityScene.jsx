import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function UtilityScene({ progress, isVisible }) {
  // Utility deployment:
  // [0.00 - 0.40]: Spatial projection grid forms
  // [0.40 - 0.75]: Volumetric smoke sphere expands and obscures sightlines
  // [0.75 - 1.00]: Tactical barrier wall locks into place, creating safe choke point

  const smokeScale = 0.2 + progress * 2.8
  const smokeOpacity = Math.min(0.85, progress * 1.4)
  const barrierHeight = Math.min(100, Math.max(0, (progress - 0.3) * 150))
  const occlusion = Math.min(100, Math.round(progress * 100))

  return (
    <div className="scene-container utility-scene">
      <CinematicHUDOverlay
        sceneNumber="05"
        sector="TERRAIN // SPATIAL UTILITY"
        systemStatus={`OCCLUSION // ${occlusion}%`}
        progress={progress}
      />

      {/* 3D Projected Deployment Grid */}
      <div
        className="utility-projection-grid"
        style={{
          transform: `perspective(600px) rotateX(60deg) translateY(${progress * 40}px)`,
        }}
        aria-hidden="true"
      />

      {/* Volumetric Tactical Smoke Orb */}
      <div
        className="volumetric-smoke-container"
        style={{
          transform: `translate(-50%, -50%) scale(${smokeScale})`,
          opacity: smokeOpacity,
        }}
        aria-hidden="true"
      >
        <div className="smoke-orb-layer smoke-layer-1" />
        <div className="smoke-orb-layer smoke-layer-2" />
        <div className="smoke-orb-layer smoke-layer-3" />
        <div className="smoke-core-glow" />
      </div>

      {/* Tactical Laser Barrier Wall */}
      <div
        className="tactical-barrier-wall"
        style={{
          height: `${barrierHeight}%`,
          opacity: progress > 0.3 ? 0.9 : 0,
        }}
        aria-hidden="true"
      >
        <div className="barrier-edge-glow" />
        <div className="barrier-scan-line" />
        <span className="barrier-label">
          TACTICAL DENSE-SMOKE // CHOKE ISOLATED
        </span>
      </div>

      {/* Minimal UI Overlay */}
      <div className="scene-content utility-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">03 // UTILITY ARCHITECTURE</span>
        </div>

        <h2 className="scene-title-xl">
          CONTROL SPACE. <br />
          <span className="text-glow-red">DICTATE PACE.</span>
        </h2>

        <p className="scene-desc-md">
          Utility is your pen to rewrite the map. Learn pixel-perfect lineups, deep smokes that deny
          operator sightlines, and retake cascades that force attackers into crossfires.
        </p>

        {/* Spatial Data Panel */}
        <div className="tactical-metrics-row">
          <div className="metric-box">
            <span className="metric-box-title">SIGHTLINE OCCLUSION</span>
            <span className="metric-box-value text-red">{occlusion}%</span>
            <span className="metric-box-sub">Complete denial</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">COVER DURATION</span>
            <span className="metric-box-value text-success">14.2s</span>
            <span className="metric-box-sub">Guaranteed defuse window</span>
          </div>
          <div className="metric-box">
            <span className="metric-box-title">SPACE CAPTURED</span>
            <span className="metric-box-value">62 m²</span>
            <span className="metric-box-sub">A-Site default cleared</span>
          </div>
        </div>
      </div>
    </div>
  )
}
