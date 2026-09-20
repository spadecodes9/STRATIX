import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Compass,
  Gauge,
  GraduationCap,
  LifeBuoy,
  MessageSquare,
  Radar,
  Target,
  TriangleAlert,
  Users,
  Waypoints,
} from 'lucide-react'
import { currentUser } from '../../data/user.js'
import { DISCORD_INVITE_URL } from '../../data/contact.js'
import './platformShowcase.css'

const CORE_FEATURES = [
  { id: 'dashboard', num: '01', label: 'Dashboard', to: '/dashboard', icon: Gauge },
  { id: 'courses', num: '02', label: 'Courses', to: '/courses', icon: GraduationCap },
  { id: 'guides', num: '03', label: 'Guides', to: '/guides', icon: BookOpen },
  { id: 'quizzes', num: '04', label: 'Quizzes', to: '/quizzes', icon: Radar, tag: 'IN DEV' },
  { id: 'aicoach', num: '05', label: 'AI Coach', to: '/ai-coach', icon: BrainCircuit },
  { id: 'teammates', num: '06', label: 'Find Teammates', to: '/teammates', icon: Users, tag: 'IN DEV' },
]

const ECOSYSTEM_ITEMS = [
  { id: 'training', label: 'Training System', icon: Waypoints, kind: 'scroll', target: '.training-path-section', desc: 'The six-stage loop behind every session.' },
  { id: 'skillmatrix', label: 'Skill Matrix', icon: Target, kind: 'scroll', target: '.skill-matrix-section', desc: 'Where your signal is strong, and where it isn’t.' },
  { id: 'discord', label: 'Community / Discord', icon: MessageSquare, kind: 'external', href: DISCORD_INVITE_URL, desc: 'Placeholder invite — the server doesn’t exist yet.' },
  { id: 'resources', label: 'Resources', icon: Compass, kind: 'link', to: '/create-account', desc: 'Start here if you’re new to STRATIX.' },
  { id: 'help', label: 'Help / Contact', icon: LifeBuoy, kind: 'link', to: '/contact', desc: 'Support channels, placeholder for now.' },
]

const LEGAL_LINKS = [
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'License', to: '/license' },
  { label: 'Disclaimer', to: '/disclaimer' },
]

function scrollToSection(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function CorePreview({ feature }) {
  switch (feature.id) {
    case 'dashboard':
      return (
        <div className="monitor-preview monitor-preview-dashboard">
          <div className="mp-rank">
            <span>CURRENT RANK</span>
            <strong>{currentUser.rank.tier} {currentUser.rank.division}</strong>
            <b>{currentUser.rank.rr} <small>RR</small></b>
          </div>
          <div className="mp-xp">
            <div className="mp-xp-row"><span>SEASON XP</span><span>{currentUser.xp}/{currentUser.xpToNextLevel}</span></div>
            <div className="mp-xp-bar"><i style={{ width: Math.round((currentUser.xp / currentUser.xpToNextLevel) * 100) + '%' }} /></div>
          </div>
          <div className="mp-activity"><Gauge size={12} /> Next up: {currentUser.recommendedNext.title}</div>
        </div>
      )
    case 'courses':
      return (
        <div className="monitor-preview monitor-preview-courses">
          <span className="mp-label">ADVANCED UTILITY USAGE</span>
          <strong>Lesson 3 of 8 &mdash; Smoke Timings for Retakes</strong>
          <div className="mp-segments">
            {Array.from({ length: 8 }).map((_, i) => (
              <i key={i} className={i < 3 ? 'is-filled' : ''} />
            ))}
          </div>
        </div>
      )
    case 'guides':
      return (
        <div className="monitor-preview monitor-preview-guides">
          <span className="mp-tag">MAP GUIDE &middot; BIND</span>
          <strong>Site B &mdash; Retake timing</strong>
          <p>Hold short until the flank is cleared, then trade off the first pick before pushing default.</p>
        </div>
      )
    case 'quizzes':
      return (
        <div className="monitor-preview monitor-preview-quizzes">
          <span className="mp-tag mp-tag-dev">IN DEVELOPMENT</span>
          <strong>Q: Which agent&apos;s ultimate reveals enemies through walls?</strong>
          <div className="mp-answers">
            <span className="is-correct">Sova</span>
            <span>Skye</span>
            <span>Cypher</span>
          </div>
        </div>
      )
    case 'aicoach':
      return (
        <div className="monitor-preview monitor-preview-aicoach">
          <div className="mp-bubble mp-bubble-player">What should I work on before my next queue?</div>
          <div className="mp-bubble mp-bubble-ai">Your Positioning signal is your lowest &mdash; start with the Retakes module.<i className="mp-cursor" /></div>
        </div>
      )
    case 'teammates':
      return (
        <div className="monitor-preview monitor-preview-teammates">
          <span className="mp-tag mp-tag-dev">IN DEVELOPMENT</span>
          <strong>Filter preview</strong>
          <div className="mp-chips">
            <span>Role: Initiator</span>
            <span>Rank: Diamond+</span>
            <span>Region: NA</span>
          </div>
        </div>
      )
    default:
      return null
  }
}

function EcosystemPreview({ item }) {
  const Icon = item.icon
  return (
    <div className="monitor-preview monitor-preview-eco">
      <Icon size={20} />
      <p>{item.desc}</p>
    </div>
  )
}

export default function PlatformShowcase() {
  const [slide, setSlide] = useState(0)
  const [hoveredCore, setHoveredCore] = useState(null)
  const [hoveredEco, setHoveredEco] = useState(null)

  const activeCore = CORE_FEATURES[hoveredCore ?? 0]
  const activeEco = ECOSYSTEM_ITEMS[hoveredEco ?? 0]

  const goToSlide = (index) => setSlide(((index % 2) + 2) % 2)

  const handleTabsKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(slide - 1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); goToSlide(slide + 1) }
  }

  return (
    <div className="platform-showcase">
      <div className="showcase-tabs" role="tablist" aria-label="STRATIX platform showcase" onKeyDown={handleTabsKeyDown}>
        <button type="button" role="tab" aria-selected={slide === 0} className={'showcase-tab' + (slide === 0 ? ' is-active' : '')} onClick={() => goToSlide(0)}>
          01 / TRAINING STACK
        </button>
        <button type="button" role="tab" aria-selected={slide === 1} className={'showcase-tab' + (slide === 1 ? ' is-active' : '')} onClick={() => goToSlide(1)}>
          02 / ECOSYSTEM
        </button>
        <div className="showcase-tab-dots" aria-hidden="true">
          <i className={slide === 0 ? 'is-active' : ''} />
          <i className={slide === 1 ? 'is-active' : ''} />
        </div>
        <div className="showcase-tab-arrows">
          <button type="button" aria-label="Previous slide" onClick={() => goToSlide(slide - 1)}><ChevronLeft size={15} /></button>
          <button type="button" aria-label="Next slide" onClick={() => goToSlide(slide + 1)}><ChevronRight size={15} /></button>
        </div>
      </div>

      <div className="showcase-stage">
        <div className="showcase-monitor">
          <i className="monitor-scan" aria-hidden="true" />
          <div className="monitor-header">
            <span>{slide === 0 ? 'THE TRAINING STACK' : 'THE STRATIX ECOSYSTEM'}</span>
            <i className="monitor-status" aria-hidden="true" />
          </div>
          {slide === 0 ? (
            <div className="monitor-body" key={'core-' + activeCore.id}>
              <div className="monitor-body-head">
                <span className="monitor-num">{activeCore.num}</span>
                <activeCore.icon size={18} />
                <strong>{activeCore.label}</strong>
                {activeCore.tag && <span className="monitor-tag">{activeCore.tag}</span>}
              </div>
              <CorePreview feature={activeCore} />
              <Link to={activeCore.to} className="monitor-open">Open {activeCore.label} <ArrowRight size={14} /></Link>
            </div>
          ) : (
            <div className="monitor-body" key={'eco-' + activeEco.id}>
              <div className="monitor-body-head">
                <activeEco.icon size={18} />
                <strong>{activeEco.label}</strong>
              </div>
              <EcosystemPreview item={activeEco} />
            </div>
          )}
        </div>

        <div className="showcase-channels" key={'channels-' + slide}>
          {slide === 0 ? (
            <ul className="channel-list">
              {CORE_FEATURES.map((feature, index) => {
                const Icon = feature.icon
                const isActive = (hoveredCore ?? 0) === index
                return (
                  <li key={feature.id} style={{ '--i': index }}>
                    <Link
                      to={feature.to}
                      className={'channel-item' + (isActive ? ' is-active' : '')}
                      onMouseEnter={() => setHoveredCore(index)}
                      onMouseLeave={() => setHoveredCore(null)}
                      onFocus={() => setHoveredCore(index)}
                      onBlur={() => setHoveredCore(null)}
                    >
                      <i className="channel-dot" aria-hidden="true" />
                      <span className="channel-num">{feature.num}</span>
                      <Icon size={15} />
                      <span className="channel-label">{feature.label}</span>
                      {feature.tag && <span className="channel-tag">{feature.tag}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <>
              <ul className="channel-list channel-list-eco">
                {ECOSYSTEM_ITEMS.map((item, index) => {
                  const Icon = item.icon
                  const isActive = (hoveredEco ?? 0) === index
                  const shared = {
                    className: 'channel-item' + (isActive ? ' is-active' : ''),
                    onMouseEnter: () => setHoveredEco(index),
                    onMouseLeave: () => setHoveredEco(null),
                    onFocus: () => setHoveredEco(index),
                    onBlur: () => setHoveredEco(null),
                  }
                  return (
                    <li key={item.id} style={{ '--i': index }}>
                      {item.kind === 'external' ? (
                        <a href={item.href} target="_blank" rel="noreferrer" {...shared}>
                          <i className="channel-dot" aria-hidden="true" />
                          <Icon size={15} />
                          <span className="channel-label">{item.label}</span>
                        </a>
                      ) : item.kind === 'scroll' ? (
                        <button type="button" {...shared} onClick={() => scrollToSection(item.target)}>
                          <i className="channel-dot" aria-hidden="true" />
                          <Icon size={15} />
                          <span className="channel-label">{item.label}</span>
                        </button>
                      ) : (
                        <Link to={item.to} {...shared}>
                          <i className="channel-dot" aria-hidden="true" />
                          <Icon size={15} />
                          <span className="channel-label">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
              <div className="showcase-legal">
                <TriangleAlert size={11} />
                {LEGAL_LINKS.map((link, i) => (
                  <span key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                    {i < LEGAL_LINKS.length - 1 && <i>&middot;</i>}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
