import { Link } from 'react-router-dom'
import { Crosshair, MessageSquare, Shield, ExternalLink } from 'lucide-react'
import './layout.css'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        {/* Brand & Mission Column */}
        <div className="footer-col footer-col-brand">
          <Link to="/" className="footer-brand">
            <div className="footer-brand-icon">
              <Crosshair size={22} strokeWidth={2.4} className="text-red" />
            </div>
            <div className="footer-brand-text">
              <span className="brand-title">STRATIX</span>
              <span className="brand-sub">COMPETITIVE TRAINING SYSTEM</span>
            </div>
          </Link>
          <p className="footer-mission">
            A precision esports intelligence platform designed to systematically isolate and resolve
            mechanical and tactical bottlenecks for competitive VALORANT players.
          </p>
          <div className="footer-status-pill">
            <span className="hud-dot-pulse" />
            <span>ALL TRAINING ENGINES OPERATIONAL</span>
          </div>
        </div>

        {/* Column 1: PLATFORM */}
        <div className="footer-col">
          <h4 className="footer-col-title">PLATFORM</h4>
          <ul className="footer-links-list">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/guides">Guides</Link></li>
            <li><Link to="/courses#quizzes">Quizzes &amp; Scenarios</Link></li>
            <li><Link to="/ai-coach">AI Coach</Link></li>
            <li><Link to="/#scene-15">Community</Link></li>
          </ul>
        </div>

        {/* Column 2: COMMUNITY */}
        <div className="footer-col">
          <h4 className="footer-col-title">COMMUNITY</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="external-link">
                <span>Discord Network</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li><Link to="/#scene-15">Weekly Challenges</Link></li>
            <li><Link to="/#scene-15">Scrim Lobbies</Link></li>
            <li><Link to="/#scene-15">VOD Review Queue</Link></li>
          </ul>
        </div>

        {/* Column 3: PLAYER */}
        <div className="footer-col">
          <h4 className="footer-col-title">PLAYER</h4>
          <ul className="footer-links-list">
            <li><Link to="/profile">Profile Console</Link></li>
            <li><Link to="/dashboard">Skill Progression</Link></li>
            <li><Link to="/#scene-16">Premium Tier</Link></li>
            <li><Link to="/profile">Settings &amp; DPI</Link></li>
          </ul>
        </div>

        {/* Column 4: LEGAL */}
        <div className="footer-col">
          <h4 className="footer-col-title">LEGAL</h4>
          <ul className="footer-links-list">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#cookies">Cookie Preferences</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} STRATIX // ALL RIGHTS RESERVED.
          </span>
          <p className="footer-disclaimer">
            STRATIX is an independent tactical training platform for VALORANT players.
            Not affiliated with, endorsed by, or sponsored by Riot Games, Inc. VALORANT and all
            related properties are trademarks of Riot Games.
          </p>
        </div>
      </div>
    </footer>
  )
}
