import { Crosshair, Shield, Activity, Radio, Cpu, Compass } from 'lucide-react'

export default function CinematicHUDOverlay({
  sceneNumber = '01',
  sector = 'SECTOR // ALPHA',
  systemStatus = 'ONLINE',
  progress = 0,
}) {
  const percentage = Math.round(progress * 100)

  return (
    <div className="cinematic-hud-overlay" aria-hidden="true">
      {/* Corner Brackets */}
      <div className="hud-corner hud-top-left">
        <div className="hud-corner-line-h" />
        <div className="hud-corner-line-v" />
        <span className="hud-corner-tag">SYS // {sceneNumber}</span>
      </div>

      <div className="hud-corner hud-top-right">
        <div className="hud-corner-line-h" />
        <div className="hud-corner-line-v" />
        <span className="hud-corner-tag">
          <span className="hud-dot-pulse" />
          {systemStatus}
        </span>
      </div>

      <div className="hud-corner hud-bottom-left">
        <div className="hud-corner-line-h" />
        <div className="hud-corner-line-v" />
        <span className="hud-corner-tag">{sector}</span>
      </div>

      <div className="hud-corner hud-bottom-right">
        <div className="hud-corner-line-h" />
        <div className="hud-corner-line-v" />
        <span className="hud-corner-tag">SYNC // {percentage.toString().padStart(3, '0')}%</span>
      </div>

      {/* Subtle telemetry lines */}
      <div className="hud-axis-x" />
      <div className="hud-axis-y" />

      {/* Side Progress Meter */}
      <div className="hud-progress-meter">
        <div className="hud-progress-track">
          <div
            className="hud-progress-bar"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>
      </div>
    </div>
  )
}
