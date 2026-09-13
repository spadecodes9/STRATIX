import { Users, MessageSquare, Trophy, Radio, ExternalLink, ArrowRight } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function CommunityScene({ progress, isVisible }) {
  const netScale = 0.85 + progress * 0.25

  return (
    <div className="scene-container community-scene">
      <CinematicHUDOverlay
        sceneNumber="15"
        sector="NETWORK // STRATIX SQUADS"
        systemStatus="12,400+ OPERATIVES ONLINE"
        progress={progress}
      />

      {/* Network Constellation Visualization */}
      <div
        className="community-network-matrix"
        style={{
          transform: `scale(${netScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 500 350" className="network-svg">
          <defs>
            <linearGradient id="netLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Connected Network Links */}
          <line x1="250" y1="175" x2="120" y2="90" stroke="url(#netLineGrad)" strokeWidth="1.5" />
          <line x1="250" y1="175" x2="380" y2="90" stroke="url(#netLineGrad)" strokeWidth="1.5" />
          <line x1="250" y1="175" x2="150" y2="260" stroke="url(#netLineGrad)" strokeWidth="1.5" />
          <line x1="250" y1="175" x2="350" y2="260" stroke="url(#netLineGrad)" strokeWidth="1.5" />
          <line x1="120" y1="90" x2="60" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="380" y1="90" x2="440" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Central Player Node (You) */}
          <g transform="translate(250, 175)">
            <circle cx="0" cy="0" r="16" fill="#ff3b4e" fillOpacity="0.2" stroke="#ff3b4e" strokeWidth="2" />
            <circle cx="0" cy="0" r="7" fill="#f2f1ee" />
            <text x="-24" y="32" fill="#f2f1ee" fontSize="11" fontWeight="700">YOU [HOST]</text>
          </g>

          {/* Surrounding Squad Nodes */}
          <g transform="translate(120, 90)">
            <circle cx="0" cy="0" r="8" fill="#1e1e28" stroke="#3ddc84" strokeWidth="2" />
            <text x="-35" y="-14" fill="#9a9aa4" fontSize="10">KovaaK_God [Asc 3]</text>
          </g>

          <g transform="translate(380, 90)">
            <circle cx="0" cy="0" r="8" fill="#1e1e28" stroke="#ff3b4e" strokeWidth="2" />
            <text x="12" y="-14" fill="#9a9aa4" fontSize="10">ViperMain [Imm 2]</text>
          </g>

          <g transform="translate(150, 260)">
            <circle cx="0" cy="0" r="8" fill="#1e1e28" stroke="#ffb648" strokeWidth="2" />
            <text x="-40" y="22" fill="#9a9aa4" fontSize="10">DrillMaster [Dia 1]</text>
          </g>

          <g transform="translate(350, 260)">
            <circle cx="0" cy="0" r="8" fill="#1e1e28" stroke="#3ddc84" strokeWidth="2" />
            <text x="12" y="22" fill="#9a9aa4" fontSize="10">TacticalOmen [Asc 1]</text>
          </g>
        </svg>

        {/* Live Discussion Card Preview */}
        <div className="community-chat-bubble">
          <div className="chat-bubble-header">
            <span className="text-red">◆ SQUAD #08 // SCRIM LOBBY</span>
            <span className="text-success">ACTIVE DISCUSSIONS</span>
          </div>
          <p>&ldquo;The new Haven A-short lineup from Module 02 completely stops the 3-man flood.&rdquo;</p>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content community-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">13 // COMPETITIVE NETWORK</span>
        </div>

        <h2 className="scene-title-xl">
          IMPROVE <br />
          <span className="text-glow-red">TOGETHER.</span>
        </h2>

        <p className="scene-desc-md">
          Join thousands of dedicated competitive players reviewing VODs, running weekly custom
          drills, and sharing lineups in the STRATIX Discord network.
        </p>

        <div className="community-action-group">
          <Button variant="primary" to="/create-account" icon={Users}>
            Join Community
          </Button>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <MessageSquare size={16} />
            <span>Join Discord</span>
          </a>
        </div>
      </div>
    </div>
  )
}
