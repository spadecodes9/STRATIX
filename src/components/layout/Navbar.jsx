import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Crosshair, Menu, X, Crown, Shield, Activity, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import './layout.css'

const navLinks = [
  { to: '/dashboard', label: 'DASHBOARD' },
  { to: '/courses', label: 'COURSES' },
  { to: '/guides', label: 'GUIDES' },
  { to: '/ai-coach', label: 'AI COACH' },
  { to: '/profile', label: 'PROFILE' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  const handleSignOut = () => {
    signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const handleLinkClick = (link) => {
    setMenuOpen(false)
    if (link.isHash) {
      if (link.to.startsWith('/#')) {
        const id = link.to.replace('/#', '')
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          navigate(link.to)
        }
      }
    }
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand Logo */}
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-icon-wrap">
            <Crosshair size={20} strokeWidth={2.4} className="brand-crosshair" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">STRATIX</span>
            <span className="brand-sub">TACTICAL OS</span>
          </div>
        </NavLink>

        {/* Center Tactical Navigation Deck */}
        <nav
          className={`nav-links-deck ${menuOpen ? 'nav-links-deck-open' : ''}`}
          role="navigation"
          aria-label="Main Navigation"
        >
          <div className="nav-deck-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `tactical-nav-item ${isActive ? 'tactical-nav-item-active' : ''}`
                }
              >
                <span className="nav-item-label">{link.label}</span>
                <span className="nav-item-indicator" />
              </NavLink>
            ))}
          </div>

          {/* Mobile Auth and Status */}
          <div className="nav-auth-mobile">
            <div className="mobile-player-status-card">
              <div className="mobile-status-header">
                <span className="hud-dot-pulse" />
                <span className="text-mono">PLAYER STATUS</span>
              </div>
              <div className="mobile-status-body">
                <strong>
                  {user ? `${user.rank?.tier} ${user.rank?.division}` : 'DIAMOND 2 / 47 RR'}
                </strong>
                <span className="text-success">TRAINING ACTIVE</span>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="btn btn-secondary btn-full" onClick={() => setMenuOpen(false)}>
                  Profile Console
                </NavLink>
                <Button variant="ghost" onClick={handleSignOut} fullWidth>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" to="/sign-in" fullWidth onClick={() => setMenuOpen(false)}>
                  Sign In
                </Button>
                <Button variant="primary" to="/create-account" fullWidth onClick={() => setMenuOpen(false)}>
                  Start Training
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Right Side: Player Status & Auth */}
        <div className="nav-status-desktop">
          {/* Tactical Status Pill */}
          <div className="tactical-status-hud" title="Player Status">
            <div className="hud-status-indicator">
              <span className="hud-dot-pulse" />
              <span className="hud-status-text">TRAINING ACTIVE</span>
            </div>
            <div className="hud-rank-chip">
              <span className="hud-rank-text">
                {user ? `${user.rank?.tier} ${user.rank?.division}` : 'DIAMOND 2 / 47 RR'}
              </span>
            </div>
            <span className="hud-premium-badge">
              <Crown size={12} className="text-red" />
              <span>PREMIUM</span>
            </span>
          </div>

          {/* User Auth Profile / Buttons */}
          <div className="nav-auth-actions">
            {isAuthenticated ? (
              <NavLink to="/profile" className="rank-pill" title="Player Profile">
                <span className="rank-pill-avatar">{user?.avatarInitials || 'SS'}</span>
                <span>PROFILE</span>
              </NavLink>
            ) : (
              <>
                <Button variant="ghost" to="/sign-in">
                  Sign In
                </Button>
                <Button variant="primary" to="/create-account">
                  Start Training
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}
