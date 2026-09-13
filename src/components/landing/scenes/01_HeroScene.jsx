import { ArrowRight, ShieldCheck, Cpu, Terminal, Compass } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function HeroScene({ progress, isVisible }) {
  // 0% -> dormant, 25% -> enters, 50% -> crosses center, 75% -> typo prominent, 100% -> transitions
  // Large viewport-crossing motion from RIGHT → CENTER
  const objectX = 120 - progress * 140 // Moves from +120vw (far right) to -20vw (exit left)
  const objectY = -5 + Math.sin(progress * Math.PI) * 15
  const objectRotate = -15 + progress * 35
  const objectScale = 0.6 + progress * 0.5
  const objectOpacity = Math.min(1, 0.3 + progress * 1.2)

  const typoOpacity = Math.max(0, 1 - progress * 0.3) // Fades as scene progresses
  const glowIntensity = progress * 0.8

  return (
    <div className="scene-container hero-scene">
      <CinematicHUDOverlay
        sceneNumber="01"
        sector="CORE // INITIALIZATION"
        systemStatus="STANDBY // DEPLOY READY"
        progress={progress}
      />

      {/* Atmospheric Background Layers */}
      <div className="scene-ambient-grid" />
      <div
        className="scene-radial-glow"
        style={{
          opacity: glowIntensity * 0.4,
          transform: `scale(${1 + progress * 0.5}) translate(${objectX * 0.5}px, ${objectY}px)`,
        }}
      />

      {/* 3D Kinetic Tactical Chassis - LARGE VIEWPORT-CROSSING */}
      <div
        className="hero-tactical-chassis"
        style={{
          transform: `translate3d(${objectX}vw, ${objectY}vh, 0) rotate(${objectRotate}deg) scale(${objectScale})`,
          opacity: objectOpacity,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 400"
          className="chassis-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f1f28" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#14141c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#ff5c6d" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2a2a38" stopOpacity="0.6" />
            </linearGradient>
            <filter id="chassisGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stealth Wings & Primary Hull */}
          <path
            d="M 50 150 L 180 50 L 380 70 L 460 140 L 390 220 L 190 240 Z"
            fill="url(#chassisGrad)"
            stroke="url(#edgeGrad)"
            strokeWidth="2"
          />
          {/* Inner Armor Facets */}
          <path
            d="M 180 50 L 260 140 L 190 240 M 380 70 L 260 140 L 390 220"
            stroke="rgba(255, 59, 78, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Central Optic Core */}
          <circle
            cx="260"
            cy="140"
            r="16"
            fill="#ff3b4e"
            fillOpacity="0.2"
            stroke="#ff3b4e"
            strokeWidth="2.5"
            filter="url(#chassisGlow)"
          />
          <circle cx="260" cy="140" r="6" fill="#f2f1ee" />
          {/* Laser Alignment Emitter */}
          <line
            x1="260"
            y1="140"
            x2="50"
            y2="150"
            stroke="#ff3b4e"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            opacity="0.8"
          />
          {/* Telemetry Annotations on Hull */}
          <text x="285" y="130" fill="#9a9aa4" fontSize="10" fontFamily="var(--font-mono)">
            STRATIX // CHASSIS-X1
          </text>
          <text x="285" y="145" fill="#ff3b4e" fontSize="9" fontFamily="var(--font-mono)">
            FREQ: 144Hz | CALIBRATED
          </text>
        </svg>

        {/* Orbiting Sensor Ring */}
        <div
          className="chassis-ring"
          style={{
            transform: `rotate(${progress * 180}deg)`,
          }}
        />
      </div>

      {/* Hero Content / Minimal UI */}
      <div
        className="scene-content hero-content"
        style={{
          opacity: typoOpacity,
        }}
      >
        <div className="hero-eyebrow-badge">
          <span className="hero-status-beacon" />
          <span className="eyebrow">STRATIX // COMPETITIVE TRAINING SYSTEM</span>
        </div>

        <h1 className="hero-cinematic-title">
          MAKE EVERY SESSION <br />
          <span className="text-glow-red">MOVE THE NEEDLE.</span>
        </h1>

        <p className="hero-cinematic-sub">
          A tactical training system that identifies gaps in your game, translates them into deliberate practice, and gives your climb a direction.
        </p>

        <div className="hero-cta-group">
          <Button variant="primary" to="/create-account" icon={ArrowRight}>
            Initialize Training
          </Button>
          <Button variant="secondary" to="/courses">
            Explore System
          </Button>
        </div>

        {/* Live System Telemetry Strip */}
        <div className="hero-telemetry-strip">
          <div className="telemetry-node">
            <span className="telemetry-label">SYSTEM STATE</span>
            <span className="telemetry-val text-success">ONLINE // READY</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-node">
            <span className="telemetry-label">TRAINING ENGINE</span>
            <span className="telemetry-val">VALORANT v9.08</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-node">
            <span className="telemetry-label">ACTIVE DRILLS</span>
            <span className="telemetry-val text-red">340+ MODULES</span>
          </div>
        </div>
      </div>

      {/* Scroll Prompt Notice */}
      <div
        className="scene-scroll-cue"
        style={{ opacity: Math.max(0, 1 - progress * 3) }}
      >
        <span className="scroll-cue-text">SCROLL TO ENGAGE TIMELINE</span>
        <div className="scroll-cue-indicator">
          <div className="scroll-cue-thumb" />
        </div>
      </div>
    </div>
  )
}
