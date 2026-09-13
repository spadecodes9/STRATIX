import { Play, CheckCircle2, Clock, Target, ArrowRight } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function TrainingScene({ progress, isVisible }) {
  // Prescribed drill card emerges as scroll advances
  const cardY = (1 - progress) * 40
  const cardScale = 0.9 + progress * 0.1

  return (
    <div className="scene-container training-scene">
      <CinematicHUDOverlay
        sceneNumber="08"
        sector="TRAINING // PRESCRIBED DRILL"
        systemStatus="MODULE 04 // READY TO ENGAGE"
        progress={progress}
      />

      {/* Background HUD Vector Lines */}
      <div className="training-schematic-bg" aria-hidden="true">
        <div className="schematic-ring" />
        <div className="schematic-line-diag" />
      </div>

      {/* Main Interactive Prescribed Training Deck */}
      <div
        className="tactical-training-deck"
        style={{
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        <div className="training-deck-header">
          <div className="deck-tag">
            <span className="deck-beacon" />
            <span>PRESCRIBED REGIMEN // PRIORITY 01</span>
          </div>
          <span className="deck-module-count">MODULE 04 / 07</span>
        </div>

        <div className="training-deck-body">
          <span className="training-path-label">CURRENT TRAINING PATH</span>
          <h3 className="training-path-title">POSITIONING FUNDAMENTALS</h3>

          <div className="drill-highlight-box">
            <div className="drill-icon-wrap">
              <Target size={24} className="text-red" />
            </div>
            <div className="drill-info">
              <span className="drill-type">RECOMMENDED ACTION</span>
              <strong className="drill-name">POST-PLANT CROSSFIRE HOLDS</strong>
              <div className="drill-meta-tags">
                <span><Clock size={13} /> 10 MIN DRILL</span>
                <span>• ANGLE ISOLATION</span>
                <span>• TRADE SPACING</span>
              </div>
            </div>
          </div>

          {/* Drill Steps Progress */}
          <div className="drill-steps-timeline">
            <div className="step-item step-completed">
              <CheckCircle2 size={15} className="text-success" />
              <span>01. Retake Sightline Angles</span>
            </div>
            <div className="step-item step-completed">
              <CheckCircle2 size={15} className="text-success" />
              <span>02. Off-Angle Planting</span>
            </div>
            <div className="step-item step-completed">
              <CheckCircle2 size={15} className="text-success" />
              <span>03. 2v2 Defuse Isolation</span>
            </div>
            <div className="step-item step-active">
              <span className="step-dot-active" />
              <strong className="text-white">04. Post-Plant Crossfire Holds</strong>
            </div>
          </div>

          <div className="training-deck-footer">
            <Button variant="primary" to="/courses" icon={Play} fullWidth>
              Start Drill (10m)
            </Button>
          </div>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content training-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">06 // ACTIONABLE DRILLS</span>
        </div>

        <h2 className="scene-title-xl">
          TURN WEAKNESSES <br />
          <span className="text-glow-red">INTO TRAINING.</span>
        </h2>

        <p className="scene-desc-md">
          Don’t waste 40 minutes watching general videos. STRATIX serves 10-minute micro-drills
          specifically targeted to fix the weaknesses exposed in your previous games.
        </p>

        {/* Benefits Summary List */}
        <div className="training-benefit-strip">
          <div className="benefit-item">
            <span className="benefit-num">10m</span>
            <span>Micro-drills built for pre-queue warmup</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-num">100%</span>
            <span>Tailored to your specific skill matrix deficit</span>
          </div>
        </div>
      </div>
    </div>
  )
}
