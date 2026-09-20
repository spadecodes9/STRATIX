import { Crosshair } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { DISCORD_INVITE_URL } from '../../data/contact.js'
import './layout.css'

const columns = [
  {
    heading: 'Platform',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/guides', label: 'Guides' },
      { to: '/quizzes', label: 'Quizzes' },
      { to: '/ai-coach', label: 'AI Coach' },
      { to: '/teammates', label: 'Find Teammates' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { to: '/create-account', label: 'Getting Started' },
      { to: '/', label: 'Training System' },
      { to: '/', label: 'Skill Matrix' },
      { to: '/contact', label: 'FAQ' },
      { to: '/contact', label: 'Help Center' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { href: DISCORD_INVITE_URL, label: 'Discord', external: true },
      { href: DISCORD_INVITE_URL, label: 'Community', external: true },
      { to: '/teammates', label: 'Find Teammates' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of Service' },
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/cookies', label: 'Cookie Policy' },
      { to: '/license', label: 'License' },
      { to: '/disclaimer', label: 'Disclaimer' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/contact', label: 'Help' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-block">
            <NavLink to="/" className="footer-brand">
              <span className="footer-brand-mark"><Crosshair size={16} strokeWidth={2.2} /></span>
              <span>STRATIX</span>
              <i className="footer-brand-status" aria-hidden="true" />
            </NavLink>
            <p className="footer-note">
              Independent training platform for VALORANT players. Not affiliated with or endorsed by Riot Games.
            </p>
            {/* TODO: Replace with the real STRATIX Discord invite URL once the server exists. */}
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer" className="footer-discord-link">
              <span className="footer-discord-pulse" aria-hidden="true" />
              Join the Discord (placeholder)
            </a>
          </div>

          <nav className="footer-columns" aria-label="Footer navigation">
            {columns.map((column) => (
              <div key={column.heading} className="footer-column">
                <span className="footer-column-heading">{column.heading}</span>
                <ul>
                  {column.links.map((link, index) => (
                    <li key={column.heading + link.label + index}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noreferrer" className="footer-link">
                          {link.label}
                        </a>
                      ) : (
                        <NavLink to={link.to} className="footer-link">{link.label}</NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© 2026 STRATIX. All rights reserved.</span>
          <span className="footer-bottom-disclaimer">
            Independent training platform for VALORANT players. Not affiliated with or endorsed by Riot Games.
          </span>
        </div>
      </div>
    </footer>
  )
}
