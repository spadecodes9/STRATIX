import { Bot, Sparkles, ArrowRight, Terminal, Radio } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function AICoachScene({ progress, isVisible }) {
  const consoleScale = 0.92 + progress * 0.08
  const consoleY = (1 - progress) * 35

  return (
    <div className="scene-container ai-coach-scene">
      <CinematicHUDOverlay
        sceneNumber="12"
        sector="NEURAL // AI COACH ENGINE"
        systemStatus="AGENT REASONING READY"
        progress={progress}
      />

      {/* AI Coach Tactical Interface Deck */}
      <div
        className="tactical-ai-deck"
        style={{
          transform: `translateY(${consoleY}px) scale(${consoleScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        <div className="ai-deck-header">
          <div className="ai-status-row">
            <span className="ai-status-pulse" />
            <span className="ai-model-tag">STRATIX-AI // KNOWLEDGE ENGINE v3.4</span>
          </div>
          <span className="ai-player-context">CONTEXT: DIAMOND 2 • #NA1</span>
        </div>

        <div className="ai-deck-body">
          {/* Audio Waveform Spectrum (Animated visual element) */}
          <div className="ai-spectral-waveform" aria-hidden="true">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{
                  height: `${Math.max(15, Math.sin(i * 0.5 + progress * 10) * 100)}%`,
                  opacity: 0.4 + (i % 2) * 0.5,
                }}
              />
            ))}
          </div>

          <div className="ai-dialogue-box">
            <div className="ai-message-bubble">
              <div className="ai-sender-tag">
                <Bot size={16} className="text-red" />
                <span>AI COACH INSIGHT</span>
              </div>
              <p className="ai-text">
                "In your last 3 matches on Ascent, 68% of your opening engagement deaths occurred
                because of crosshair dip when dropping from Mid Tiles. You're pre-aiming crouching
                height instead of standing head elevation."
              </p>
            </div>

            <div className="ai-prescription-box">
              <span className="prescription-label">RECOMMENDED ACTION</span>
              <p className="prescription-content">
                Take the <strong>Angle Elevation Calibration Drill</strong> in Aim Fundamentals
                before entering your next ranked session.
              </p>
            </div>
          </div>
        </div>

        <div className="ai-deck-footer">
          <Button variant="primary" to="/ai-coach" icon={Bot} fullWidth>
            Open AI Coach
          </Button>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content ai-coach-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">10 // ADAPTIVE INTELLIGENCE</span>
        </div>

        <h2 className="scene-title-xl">
          PERSONAL TACTICAL <br />
          <span className="text-glow-red">INTELLIGENCE.</span>
        </h2>

        <p className="scene-desc-md">
          Not generic advice. An AI Coach that knows your matches, tracks your skill matrix, and
          instantly points you to the exact lesson or drill that solves your mechanical and tactical flaws.
        </p>

        <div className="ai-features-list">
          <div className="ai-feature-row">
            <span className="feature-dot text-red">◆</span>
            <span>Real-time round mistake diagnosis</span>
          </div>
          <div className="ai-feature-row">
            <span className="feature-dot text-red">◆</span>
            <span>Direct curriculum and lesson linking</span>
          </div>
          <div className="ai-feature-row">
            <span className="feature-dot text-red">◆</span>
            <span>Custom warmup routine generator</span>
          </div>
        </div>
      </div>
    </div>
  )
}
