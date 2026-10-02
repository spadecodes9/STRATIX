import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Crosshair, Menu, Shield, Sparkles, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRiot } from '../../context/RiotContext.jsx'
import { usePremium } from '../../context/PremiumContext.jsx'
import Button from '../ui/Button.jsx'
import './layout.css'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/guides', label: 'Guides' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/ai-coach', label: 'AI Coach' },
  { to: '/teammates', label: 'Find Teammates' },
]

// Same breakpoint as the slide-out menu in layout.css.
const MOBILE_NAV_QUERY = '(max-width: 1000px)'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_NAV_QUERY).matches)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const { isAuthenticated, user, signOut } = useAuth()
  const riot = useRiot()
  const { isPremium } = usePremium()
  const riotConnected = riot.status === 'connected'
  const navigate = useNavigate()

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12)
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  // Leaving the mobile layout closes the slide-out menu.
  useEffect(() => {
    const query = window.matchMedia(MOBILE_NAV_QUERY)
    const onChange = (e) => {
      setIsMobile(e.matches)
      if (!e.matches) setMenuOpen(false)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Escape closes the open menu and returns focus to its toggle. Only
  // listening while open, so Escape elsewhere is untouched.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // While the mobile menu is open, the page behind it shouldn't scroll.
  useEffect(() => {
    if (!menuOpen || !isMobile) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen, isMobile])

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

        {/* Before the menu in DOM order so Tab moves from the toggle into the
            open menu. Hidden on desktop; the menu is position: fixed on
            mobile, so the visual order is unchanged. */}
        <button
          ref={toggleRef}
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="menu-toggle-frame">{menuOpen ? <X size={20} /> : <Menu size={20} />}</span>
        </button>

        {/* The closed slide-out menu is only moved off-screen by CSS, so it's
            made inert: no Tab stops, hidden from assistive technology. On
            desktop this is the normal, always-visible nav. */}
        <nav
          id="mobile-navigation"
          className={'nav-links' + (menuOpen ? ' nav-links-open' : '')}
          aria-label="Main navigation"
          inert={isMobile && !menuOpen}
        >
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
                  <span className="nav-link-index">0{navLinks.length + 2}</span><span>Profile</span>
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
              {/* Real Riot identity only — never a placeholder rank. */}
              <span className="rank-pill-copy">
                <small>{riotConnected ? <><i /> RIOT CONNECTED</> : 'RIOT NOT CONNECTED'}</small>
                <b>{riotConnected ? riot.playerData?.rank?.name || riot.connection.gameName : 'Connect Riot'}</b>
              </span>
              {isPremium
                ? <Sparkles size={14} className="rank-pill-premium" aria-label="Premium" />
                : <Shield size={14} />}
            </NavLink>
          ) : (
            <>
              <Button variant="ghost" to="/sign-in">Sign In</Button>
              <Button variant="primary" to="/create-account">Start Training</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
