import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Crosshair, Menu, Shield, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import './layout.css'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/guides', label: 'Guides' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/ai-coach', label: 'AI Coach' },
  { to: '/teammates', label: 'Find Teammates' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12)
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  const handleSignOut = () => {
    signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={'navbar' + (scrolled ? ' navbar-scrolled' : '') + (menuOpen ? ' navbar-menu-open' : '')}>
      <div className="navbar-scan" aria-hidden="true" />
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Crosshair size={19} strokeWidth={2.3} /></span>
          <span>STRATIX</span>
          <i className="brand-status" aria-hidden="true" />
        </NavLink>

        <nav id="mobile-navigation" className={'nav-links' + (menuOpen ? ' nav-links-open' : '')} aria-label="Main navigation">
          <div className="mobile-nav-status"><span><i /> SYSTEM ONLINE</span><span>STRATIX // NAVIGATION</span></div>
          {navLinks.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link-index">0{index + 1}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/premium"
            className={({ isActive }) => 'nav-link nav-link-premium' + (isActive ? ' nav-link-active' : '')}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-link-index">0{navLinks.length + 1}</span>
            <span>Premium <i className="premium-star">✦</i></span>
          </NavLink>

          <div className="nav-auth-mobile">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <span className="nav-link-index">0{navLinks.length + 1}</span><span>Profile</span>
                </NavLink>
                <Button variant="secondary" onClick={handleSignOut} fullWidth>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" to="/sign-in" fullWidth>Sign In</Button>
                <Button variant="primary" to="/create-account" fullWidth>Start Training</Button>
              </>
            )}
          </div>
        </nav>

        <div className="nav-auth-desktop">
          <NavLink to="/premium" className="nav-link-premium nav-link-premium-desktop">
            Premium <i className="premium-star">✦</i>
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/profile" className="rank-pill">
              <span className="rank-pill-avatar">{user?.avatarInitials}</span>
              <span className="rank-pill-copy"><small><i /> LIVE RANK</small><b>{user?.rank?.tier} {user?.rank?.division}</b></span>
              <Shield size={14} />
            </NavLink>
          ) : (
            <>
              <Button variant="ghost" to="/sign-in">Sign In</Button>
              <Button variant="primary" to="/create-account">Start Training</Button>
            </>
          )}
        </div>

        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="menu-toggle-frame">{menuOpen ? <X size={20} /> : <Menu size={20} />}</span>
        </button>
      </div>
    </header>
  )
}
