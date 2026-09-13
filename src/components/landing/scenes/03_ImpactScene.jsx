import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function ImpactScene({ progress, isVisible }) {
  // Timeline:
  // 0.00 - 0.50: Energy buildup (core glows, particles surge)
  // 0.50 - 0.65: Blinding flash expansion
  // 0.65 - 0.85: PEAK HOLD (Viewport dominated by light)
  // 0.85 - 1.00: Dissipation

  const flashIntensity = progress < 0.5
    ? (progress / 0.5) * 0.4
    : progress < 0.65
      ? 0.4 + ((progress - 0.5) / 0.15) * 0.6
      : progress <= 0.85
        ? 1.0
        : 1.0 - ((progress - 0.85) / 0.15)

  const holdState = progress >= 0.65 && progress <= 0.85
  const coreScale = 0.5 + progress * 10

  return (
    <div className="scene-container impact-scene">
      <CinematicHUDOverlay
        sceneNumber="03"
        sector="KINETIC // RADIANT IMPACT"
        systemStatus={holdState ? 'CRITICAL // SIGHTLINE BLIND' : 'DISCHARGE IN PROGRESS'}
        progress={progress}
      />

      {/* THE VISUAL STAGE */}
      <div className="visual-stage center-stage">
        {/* Energy Core */}
        <div
          className="impact-core"
          style={{
            transform: `translate(-50%, -50%) scale(${coreScale})`,
            opacity: Math.min(1, flashIntensity * 1.5),
            background: `radial-gradient(circle, var(--white) 0%, var(--red) 40%, transparent 70%)`,
            filter: `blur(${holdState ? 0 : (1 - flashIntensity) * 40}px)`,
            boxShadow: `0 0 ${flashIntensity * 200}px var(--red)`
          }}
        />

        {/* Shockwaves */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="impact-ring"
            style={{
              transform: `translate(-50%, -50%) scale(${progress * i * 5})`,
              opacity: progress > 0.1 ? Math.max(0, (1 - progress) * (1 / i)) : 0,
              borderColor: 'var(--red)',
              borderWidth: `${10 - progress * 8}px`
            }}
          />
        ))}

        {/* FULL VIEWPORT FLASH OVERLAY */}
        <div
          className="impact-flash-overlay"
          style={{
            opacity: flashIntensity,
            background: holdState
              ? 'var(--white)'
              : `radial-gradient(circle, var(--white) 0%, var(--red) ${flashIntensity * 100}%, transparent 100%)`
          }}
        />
      </div>

      <div className="scene-content central-copy" style={{ zIndex: 20 }}>
        <div className="technical-label" style={{ opacity: 1 - flashIntensity * 0.8 }}>
          03 // IMPACT
        </div>
        <h2 className="scene-title-xl" style={{
          opacity: progress < 0.65 ? Math.min(1, progress * 4) : 1 - flashIntensity,
          transform: `translateY(${(1 - progress) * 20}px)`,
          color: holdState ? '#08080a' : '#f2f1ee'
        }}>
          STUN THE <span className="text-glow-red">MOMENT.</span>
        </h2>
        <p className="scene-desc-md" style={{
          opacity: 1 - flashIntensity,
          color: holdState ? '#1e1e24' : '#9a9aa4'
        }}>
          Force the error. Own the tempo.
        </p>
      </div>
    </div>
  )
}
