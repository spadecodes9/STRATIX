import { Shield, Sparkles, Check, ArrowRight, Zap, Crown } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

const PREMIUM_PERKS = [
  'Unlimited AI Coach consultations with match-specific VOD queries',
  'Personalized daily 15-minute warmup & mechanical drills',
  'Radiant & VCT Masterclass course catalog (all tiers unlocked)',
  'Sub-frame reticle telemetry & crosshair placement error tracking',
  'Priority access to community scrims and custom squad lobbies',
]

export default function PremiumScene({ progress, isVisible }) {
  const vaultScale = 0.92 + progress * 0.08
  const vaultY = (1 - progress) * 35

  return (
    <div className="scene-container premium-scene">
      <CinematicHUDOverlay
        sceneNumber="16"
        sector="OBSIDIAN // PREMIUM TIER"
        systemStatus="ENTERPRISE PRECISION"
        progress={progress}
      />

      {/* Obsidian Premium Vault Deck */}
      <div
        className="tactical-premium-vault"
        style={{
          transform: `translateY(${vaultY}px) scale(${vaultScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        <div className="vault-glow-rim" />
        <div className="vault-header">
          <div className="vault-badge-row">
            <span className="vault-tag-gold">STRATIX // BLACK OPS TIER</span>
            <span className="vault-status-dot" />
          </div>
          <h3 className="vault-title">FULL TELEMETRY UNLOCKED</h3>
        </div>

        <div className="vault-body">
          <ul className="vault-perks-list">
            {PREMIUM_PERKS.map((perk, i) => (
              <li
                key={i}
                className="vault-perk-item"
                style={{
                  opacity: Math.min(1, 0.3 + (progress - i * 0.06) * 2),
                }}
              >
                <span className="perk-check-icon">
                  <Check size={14} className="text-red" />
                </span>
                <span className="perk-text">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="vault-footer">
          <Button variant="primary" to="/create-account" icon={Crown} fullWidth>
            Initialize Premium Access
          </Button>
          <span className="vault-subtext">30-day money-back guarantee • Cancel anytime</span>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content premium-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">14 // UNCOMPROMISING INTELLIGENCE</span>
        </div>

        <h2 className="scene-title-xl">
          MORE SIGNAL. <br />
          <span className="text-glow-red">LESS GUESSWORK.</span>
        </h2>

        <p className="scene-desc-md">
          Designed for competitive players who treat their improvement with the precision of an
          esports athlete. Get complete access to every curriculum, drill, and AI insight.
        </p>
      </div>
    </div>
  )
}
