import { ArrowRight, Crosshair, ShieldCheck } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function FinalScene({ progress, isVisible }) {
  const finalScale = 0.95 + progress * 0.05
  const finalOpacity = Math.min(1, 0.4 + progress * 0.9)

  return (
    <div className="scene-container final-scene">
      <CinematicHUDOverlay
        sceneNumber="17"
        sector="TERMINAL // FINAL RESOLUTION"
        systemStatus="READY FOR DEPLOYMENT"
        progress={progress}
      />

      {/* Atmospheric Ambient Glow */}
      <div className="final-ambient-core" aria-hidden="true" />

      {/* Final Cinematic Trailer Frame */}
      <div
        className="final-cinematic-card"
        style={{
          transform: `scale(${finalScale})`,
          opacity: finalOpacity,
        }}
      >
        <div className="final-brand-mark">
          <Crosshair size={32} className="text-red" strokeWidth={2.2} />
          <span className="final-brand-text">STRATIX</span>
        </div>

        <h2 className="final-cinematic-headline">
          YOUR NEXT LEVEL STARTS <br />
          <span className="text-glow-red">WITH THE NEXT SESSION.</span>
        </h2>

        <p className="final-cinematic-sub">
          Stop wondering where your climb stalled. Create your free profile and get a diagnostic
          dashboard tuned directly to your game.
        </p>

        <div className="final-actions-group">
          <Button variant="primary" to="/create-account" icon={ArrowRight}>
            Initialize Training
          </Button>
          <Button variant="secondary" to="/courses">
            Explore The System
          </Button>
        </div>

        <div className="final-telemetry-tag">
          <span className="telemetry-dot-blink" />
          <span>STANDBY FOR DEPLOYMENT // SESSION READY</span>
        </div>
      </div>
    </div>
  )
}
