import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Bot,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Crosshair,
  Gauge,
  GraduationCap,
  LockKeyhole,
  Radar,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  Waypoints,
  Zap,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import HeroGraphic from '../components/HeroGraphic.jsx'
import PlatformShowcase from '../components/landing/PlatformShowcase.jsx'
// DEMO DATA: the hero/progression/skill showcases below render a labeled
// sample player for marketing only — never a real user's data.
import { SAMPLE_PLAYER } from '../demo/samplePlayer.js'
import './Landing.css'

// System-map geometry, in % of the .platform-system panel. Cards sit clockwise
// around the command core (01 TL -> 02 TR -> 03 BR -> 04 BL) so the outer loop
// pulses read as one training cycle. `lane` is the y of the spoke that joins a
// card to the core; `loops` are the outer-loop segments it lights when active.
const SYSTEM_CORE_Y = 45.3
const SYSTEM_LOOPS = {
  top: 'M19.3,26.1 L19.3,9 L42,9 L42,7 L58,7 L58,9 L80.7,9 L80.7,26.1',
  right: 'M80.7,22 L96,22 L96,68.7 L80.7,68.7',
  bottom: 'M80.7,64.6 L80.7,80 L58,80 L58,81.5 L42,81.5 L42,80 L19.3,80 L19.3,64.6',
  left: 'M19.3,68.7 L4,68.7 L4,22 L19.3,22',
}

const platformModules = [
  {
    id: 'guides',
    icon: BookOpen,
    label: 'Guides',
    title: 'Tactical answers for the moment.',
    body: 'Open the map, matchup, or setup you need before the next queue begins.',
    to: '/guides',
    action: 'Browse guides',
    map: { x: 19.3, y: 26.1, lane: 22, loops: ['top', 'left'] },
  },
  {
    id: 'coach',
    icon: BrainCircuit,
    label: 'AI Coach',
    title: 'Turn a question into the next move.',
    body: 'Connect a mistake or decision to the lesson that can help you fix it.',
    to: '/ai-coach',
    action: 'Meet the coach',
    map: { x: 80.7, y: 26.1, lane: 22, loops: ['top', 'right'] },
  },
  {
    id: 'progress',
    icon: TrendingUp,
    label: 'Progression',
    title: 'Make the pattern visible.',
    body: 'Use skill signals and recent effort to decide what comes next.',
    to: '/create-account',
    action: 'Build your system',
    map: { x: 80.7, y: 64.6, lane: 68.7, loops: ['right', 'bottom'] },
  },
  {
    id: 'quizzes',
    icon: ClipboardCheck,
    label: 'Quizzes',
    title: 'Prove the read under pressure.',
    body: 'Test the calls you just studied and see which decisions still need reps.',
    to: '/quizzes',
    action: 'Take a quiz',
    map: { x: 19.3, y: 64.6, lane: 68.7, loops: ['bottom', 'left'] },
  },
]

const trainingSteps = [
  { label: 'Assess', icon: Radar, text: 'Read the signal' },
  { label: 'Train', icon: GraduationCap, text: 'Build the habit' },
  { label: 'Apply', icon: Target, text: 'Take it into queue' },
  { label: 'Review', icon: Activity, text: 'Observe the result' },
  { label: 'Improve', icon: Gauge, text: 'Close the gap' },
  { label: 'Rank up', icon: Shield, text: 'Advance with proof' },
]

function useCountUp(target, active, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return undefined
    }

    const start = performance.now()
    let frame

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [active, duration, target])

  return value
}

const SKILL_CODES = {
  'Aim & Mechanics': 'AIM + MECH',
  'Game Sense': 'GAME SENSE',
  'Utility Usage': 'UTILITY',
  'Positioning': 'POSITION',
  'Communication': 'COMMS',
  'Economy Mgmt': 'ECONOMY',
}

function SkillInstrumentField({ skills, priority }) {
  return (
    <div className="instrument-field">
      <div className="field-ruler" aria-hidden="true">
        <span className="field-ruler-tick field-ruler-high">HIGH<i /></span>
        <span className="field-ruler-tick field-ruler-stable">STABLE<i /></span>
        <span className="field-ruler-tick field-ruler-low">LOW<i /></span>
      </div>
      <i className="field-scan" aria-hidden="true" />
      <div className="instrument-row">
        {skills.map((skill, index) => {
          const isPriority = skill.skill === priority.skill
          return (
            <div
              key={skill.skill}
              className={'instrument' + (isPriority ? ' is-priority' : '')}
              style={{ '--i': index }}
            >
              <i className="instrument-status" aria-hidden="true" />
              <div className="instrument-value"><b>{skill.score}</b><small>/100</small></div>
              <div className="instrument-scale" style={{ '--score': skill.score + '%' }}>
                {isPriority && <i className="instrument-bracket" aria-hidden="true" />}
                <div className="instrument-fill" style={{ height: skill.score + '%' }} />
                <i className="instrument-marker" style={{ bottom: skill.score + '%' }} aria-hidden="true" />
                {isPriority && <i className="instrument-priority-marker" style={{ bottom: skill.score + '%' }} aria-hidden="true" />}
                {isPriority && <i className="instrument-particle" aria-hidden="true" />}
              </div>
              <span className="instrument-label"><b>0{index + 1}</b>{SKILL_CODES[skill.skill] || skill.skill}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Landing() {
  const [activeModule, setActiveModule] = useState('coach')
  const [systemBooted, setSystemBooted] = useState(false)
  const heroRef = useRef(null)
  const weakestSkill = SAMPLE_PLAYER.skillMatrix.reduce((lowest, skill) => (
    skill.score < lowest.score ? skill : lowest
  ))
  const xpPercent = Math.round((SAMPLE_PLAYER.xp / SAMPLE_PLAYER.xpToNextLevel) * 100)
  const rrDisplay = useCountUp(SAMPLE_PLAYER.rank.rr, systemBooted)
  const activePlatformModule = platformModules.find((module) => module.id === activeModule)

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setSystemBooted(true), 120)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll('.landing-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.13 },
    )

    revealItems.forEach((item) => observer.observe(item))

    const hero = heroRef.current
    const handlePointerMove = (event) => {
      if (!hero || reduceMotion) return
      const box = hero.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - 0.5
      const y = (event.clientY - box.top) / box.height - 0.5
      hero.style.setProperty('--pointer-x', x.toFixed(3))
      hero.style.setProperty('--pointer-y', y.toFixed(3))
    }
    const resetPointer = () => {
      if (!hero) return
      hero.style.setProperty('--pointer-x', '0')
      hero.style.setProperty('--pointer-y', '0')
    }

    hero?.addEventListener('pointermove', handlePointerMove)
    hero?.addEventListener('pointerleave', resetPointer)

    return () => {
      window.clearTimeout(bootTimer)
      observer.disconnect()
      hero?.removeEventListener('pointermove', handlePointerMove)
      hero?.removeEventListener('pointerleave', resetPointer)
    }
  }, [])

  return (
    <div className="landing-page">
      <section className="command-hero" ref={heroRef}>
        <div className="hero-depth hero-depth-grid" aria-hidden="true" />
        <div className="hero-depth hero-depth-geometry" aria-hidden="true" />
        <div className="hero-depth hero-depth-glow" aria-hidden="true" />
        <div className="hero-scanline" aria-hidden="true" />

        <div className="command-hero-inner">
          <div className="command-hero-copy">
            <span className="hero-kicker hero-intro hero-intro-1"><Crosshair size={14} /> STRATIX // COMPETITIVE TRAINING SYSTEM</span>
            <h1 className="hero-intro hero-intro-2">
              Make every session<br />
              <span>move the needle.</span>
            </h1>
            <p className="command-hero-sub hero-intro hero-intro-3">
              A tactical training system that detects the gaps in your game, translates them into deliberate practice,
              and gives your climb a direction.
            </p>
            <div className="command-hero-actions hero-intro hero-intro-4">
              <Button variant="primary" to="/create-account" icon={ArrowRight}>Initialize training</Button>
              <Button variant="secondary" to="/guides" icon={ChevronRight}>Explore the system</Button>
            </div>
            <div className="hero-live-signal hero-intro hero-intro-5">
              <span><i /> SYSTEM ONLINE</span>
              <span>GUIDES / AI / PROGRESSION</span>
            </div>
          </div>

          <div className={'hero-analysis-stage hero-intro hero-intro-3 ' + (systemBooted ? 'is-booted' : '')}>
            <div className="hero-stage-header">
              <span><CircleDot size={13} /> SAMPLE PLAYER // DEMO DATA</span>
              <span>SECTOR 01 / 04</span>
            </div>
            <div className="hero-stage-frame" aria-hidden="true" />
            <div className="hero-stage-radar"><HeroGraphic /></div>
            <svg className="hero-flow-map" viewBox="0 0 600 520" aria-hidden="true">
              <path className="flow-path flow-path-one" d="M90 110 H218 L278 182" />
              <path className="flow-path flow-path-two" d="M510 128 H390 L324 213" />
              <path className="flow-path flow-path-three" d="M94 390 H220 L274 318" />
              <path className="flow-path flow-path-four" d="M504 390 H384 L326 318" />
              <circle className="flow-ping flow-ping-one" cx="218" cy="110" r="4" />
              <circle className="flow-ping flow-ping-two" cx="390" cy="128" r="4" />
              <circle className="flow-ping flow-ping-three" cx="220" cy="390" r="4" />
              <circle className="flow-ping flow-ping-four" cx="384" cy="390" r="4" />
            </svg>
            <div className="hero-data-card hero-player-card">
              <span>SAMPLE PLAYER</span>
              <strong>{SAMPLE_PLAYER.username}</strong>
              <small><i /> DEMO DATA</small>
            </div>
            <div className="hero-data-card hero-rank-card">
              <span>CURRENT RANK</span>
              <strong>{SAMPLE_PLAYER.rank.tier} {SAMPLE_PLAYER.rank.division}</strong>
              <b>{rrDisplay}<em> RR</em></b>
            </div>
            <div className="hero-data-card hero-gap-card">
              <span><TriangleAlert size={13} /> WEAKNESS DETECTED</span>
              <strong>{weakestSkill.skill}</strong>
              <div className="micro-progress"><i style={{ width: weakestSkill.score + '%' }} /></div>
              <small>{weakestSkill.score} / 100 SIGNAL</small>
            </div>
            <div className="hero-data-card hero-next-card">
              <span><Sparkles size={13} /> NEXT BEST ACTION</span>
              <strong>{SAMPLE_PLAYER.recommendedNext.title}</strong>
              <small><Zap size={12} /> READY TO DEPLOY</small>
            </div>
            <div className="hero-stage-footer">
              <span>PLAYER <i /> SIGNAL <i /> ACTION <i /> PROGRESSION</span>
              <span><i className="hero-ready-dot" /> MONITORING</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section platform-system-section">
        <div className="page-shell cinematic-shell">
          <div className="section-command-heading landing-reveal">
            <span className="eyebrow">01 // THE STRATIX ADVANTAGE</span>
            <div>
              <h2>One system.<br /><span>Every useful signal.</span></h2>
              <p>STRATIX turns the things players usually juggle separately into one connected training loop.</p>
            </div>
          </div>

          <div className="platform-system landing-reveal">
            <div>
              <div className="system-wires" aria-hidden="true">
                <svg className="sw-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* core bus: diamond side vertices out to the loop junctions */}
                  <path className="sw-path sw-bus" d={`M43.5,${SYSTEM_CORE_Y} L4,${SYSTEM_CORE_Y} M56.5,${SYSTEM_CORE_Y} L96,${SYSTEM_CORE_Y}`} />

                  {/* outer training loop, clockwise: 01 -> 02 -> 03 -> 04 -> 01 */}
                  {Object.entries(SYSTEM_LOOPS).map(([side, d]) => (
                    <path key={side} id={'sw-loop-' + side} d={d}
                      className={'sw-path sw-loop' + (activePlatformModule.map.loops.includes(side) ? ' is-lit' : '')} />
                  ))}

                  {/* direct hub connections: core vertex -> lane -> card */}
                  {platformModules.map(({ id, map }) => (
                    <path key={id} id={'sw-spoke-' + id}
                      className={'sw-path sw-spoke' + (id === activeModule ? ' is-lit' : '')}
                      d={`M50,${map.lane < SYSTEM_CORE_Y ? 29.3 : 61.3} L50,${map.lane} L${map.x},${map.lane}`} />
                  ))}

                  {/* ambient signal pulses travelling the outer loop (ellipse radii offset the panel's ~2:1 stretch) */}
                  {Object.keys(SYSTEM_LOOPS).map((side, i) => (
                    <ellipse key={side} className="sw-loop-pulse" rx="0.28" ry="0.55">
                      <animateMotion dur="3.2s" begin={i * 0.8 + 's'} repeatCount="indefinite"><mpath href={'#sw-loop-' + side} /></animateMotion>
                    </ellipse>
                  ))}

                  {/* signal pulse on the active hub connection */}
                  {platformModules.map(({ id }) => (
                    <ellipse key={id} className={'sw-spoke-pulse' + (id === activeModule ? ' is-lit' : '')} rx="0.33" ry="0.65">
                      <animateMotion dur="1s" repeatCount="indefinite"><mpath href={'#sw-spoke-' + id} /></animateMotion>
                    </ellipse>
                  ))}
                </svg>

                {/* routing junctions (plain dots: stay perfectly round regardless of panel aspect ratio) */}
                <i className="sw-dot sw-dot-dim" style={{ left: '50%', top: '7%' }} />
                <i className="sw-dot sw-dot-dim" style={{ left: '50%', top: '81.5%' }} />
                <i className="sw-dot sw-dot-dim" style={{ left: '4%', top: SYSTEM_CORE_Y + '%' }} />
                <i className="sw-dot sw-dot-dim" style={{ left: '96%', top: SYSTEM_CORE_Y + '%' }} />

                {/* hub ports on the core vertices + card ports (inner spoke, outer side, outer edge).
                    Card half-size is 90px x 63.5px, hence the calc offsets. */}
                {platformModules.map(({ id, map }) => {
                  const lit = id === activeModule ? ' is-lit' : ''
                  const inward = map.x < 50 ? '+' : '-'
                  const outward = map.x < 50 ? '-' : '+'
                  const top = map.y < SYSTEM_CORE_Y
                  return [
                    <i key={id + '-hub'} className={'sw-dot sw-dot-hub' + lit}
                      style={{ left: '50%', top: `calc(${SYSTEM_CORE_Y}% ${top ? '-' : '+'} 96px)` }} />,
                    <i key={id + '-in'} className={'sw-dot sw-dot-port' + lit}
                      style={{ left: `calc(${map.x}% ${inward} 90px)`, top: map.lane + '%' }} />,
                    <i key={id + '-side'} className={'sw-dot sw-dot-port' + lit}
                      style={{ left: `calc(${map.x}% ${outward} 90px)`, top: map.lane + '%' }} />,
                    <i key={id + '-edge'} className={'sw-dot sw-dot-port' + lit}
                      style={{ left: map.x + '%', top: `calc(${map.y}% ${top ? '-' : '+'} 63.5px)` }} />,
                  ]
                })}

                <i className="wire-core-pulse" />
              </div>
              <div className="system-core">
                <Crosshair size={32} />
                <span>STRATIX</span>
                <small>COMMAND CORE</small>
              </div>
              <div className="system-module-grid">
                {platformModules.map((module, index) => {
                  const Icon = module.icon
                  const isActive = activeModule === module.id
                  return (
                    <button
                      type="button"
                      key={module.id}
                      className={'system-module system-module-' + module.id + (isActive ? ' is-selected' : '')}
                      style={{ '--sm-x': module.map.x + '%', '--sm-y': module.map.y + '%' }}
                      onMouseEnter={() => setActiveModule(module.id)}
                      onFocus={() => setActiveModule(module.id)}
                      onClick={() => setActiveModule(module.id)}
                      aria-pressed={isActive}
                    >
                      <span className="module-index">0{index + 1}</span>
                      <Icon size={22} />
                      <strong>{module.label}</strong>
                      <small>{isActive ? 'SIGNAL ACTIVE' : 'LINK READY'}</small>
                    </button>
                  )
                })}
              </div>
              <div className="system-readout" aria-live="polite">
                <span>{activePlatformModule.label} // LINKED MODULE</span>
                <div>
                  <h3>{activePlatformModule.title}</h3>
                  <p>{activePlatformModule.body}</p>
                </div>
                <Link to={activePlatformModule.to} className="system-readout-link">{activePlatformModule.action} <ArrowRight size={15} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section training-path-section">
        <div className="page-shell cinematic-shell">
          <div className="training-path-header landing-reveal">
            <div>
              <span className="eyebrow">02 // TRAINING SYSTEM</span>
              <h2>A climb built from<br /><span>clearer decisions.</span></h2>
            </div>
            <p>Progress is not a feed of content. It is a loop: read the signal, train the habit, apply it under pressure, and return with a better question.</p>
          </div>
          <div className="training-rail">
            <div className="rail-track" aria-hidden="true">
              <svg className="rail-svg" viewBox="0 0 600 40" preserveAspectRatio="none">
                <line className="rail-lead" x1="0" y1="20" x2="50" y2="20" />
                <line className="rail-lead" x1="550" y1="20" x2="600" y2="20" />
                <line id="rail-seg-1" className="rail-seg" x1="50" y1="20" x2="150" y2="20" />
                <line id="rail-seg-2" className="rail-seg" x1="150" y1="20" x2="250" y2="20" />
                <line id="rail-seg-3" className="rail-seg" x1="250" y1="20" x2="350" y2="20" />
                <line id="rail-seg-4" className="rail-seg" x1="350" y1="20" x2="450" y2="20" />
                <line id="rail-seg-5" className="rail-seg" x1="450" y1="20" x2="550" y2="20" />
                <line className="rail-micro-tick" x1="100" y1="17" x2="100" y2="23" />
                <line className="rail-micro-tick" x1="200" y1="17" x2="200" y2="23" />
                <line className="rail-micro-tick" x1="300" y1="17" x2="300" y2="23" />
                <line className="rail-micro-tick" x1="400" y1="17" x2="400" y2="23" />
                <line className="rail-micro-tick" x1="500" y1="17" x2="500" y2="23" />
                <line id="rail-tick-1" className="rail-tick" x1="50" y1="10" x2="50" y2="30" />
                <line id="rail-tick-2" className="rail-tick" x1="150" y1="10" x2="150" y2="30" />
                <line id="rail-tick-3" className="rail-tick" x1="250" y1="10" x2="250" y2="30" />
                <line id="rail-tick-4" className="rail-tick" x1="350" y1="10" x2="350" y2="30" />
                <line id="rail-tick-5" className="rail-tick" x1="450" y1="10" x2="450" y2="30" />
                <line id="rail-tick-6" className="rail-tick" x1="550" y1="10" x2="550" y2="30" />
                <path className="rail-bracket" d="M2,4 L2,14 M2,4 L12,4" />
                <path className="rail-bracket" d="M598,4 L598,14 M598,4 L588,4" />
              </svg>
              <i className="rail-pulse rail-pulse-a" />
              <i className="rail-pulse rail-pulse-b" />
            </div>

            <div className="rail-feedback-wrap" aria-hidden="true">
              <svg className="rail-feedback" viewBox="0 0 600 70" preserveAspectRatio="xMidYMid meet">
                <path id="rail-feedback-path" className="feedback-line" d="M350,8 Q400,22 450,8 Q500,60 250,55 Q80,50 50,8" />
                <circle className="feedback-pulse" r="2.4">
                  <animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath href="#rail-feedback-path" />
                  </animateMotion>
                </circle>
              </svg>
            </div>

            <div className="training-path">
              {trainingSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <article
                    key={step.label}
                    className={'training-stage landing-reveal reveal-delay-' + ((index % 3) + 1)}
                    style={{ '--stage-i': index }}
                  >
                    <i className="stage-port" aria-hidden="true" />
                    <span className="stage-corner stage-corner-tl" aria-hidden="true" />
                    <span className="stage-corner stage-corner-br" aria-hidden="true" />
                    <span className="training-stage-number">0{index + 1}</span>
                    <div className="training-stage-icon">
                      <Icon size={18} />
                      <i className="stage-status" aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{step.label}</h3>
                      <p>{step.text}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section ai-analysis-section">
        <div className="page-shell cinematic-shell ai-shell">
          <div className="ai-copy landing-reveal">
            <span className="eyebrow"><BrainCircuit size={14} /> 03 // STRATIX AI COACH</span>
            <h2>Ask what went wrong.<br /><span>Leave with a next move.</span></h2>
            <p>STRATIX AI turns a specific in-game question into a focused training direction, without sending you into another endless tab spiral.</p>
            <div className="ai-signal-legend">
              <span><i className="legend-dot legend-dot-input" /> PLAYER INPUT</span>
              <span><i className="legend-dot legend-dot-analysis" /> AI ANALYSIS</span>
              <span><i className="legend-dot legend-dot-action" /> TRAINING ACTION</span>
            </div>
            <Button variant="secondary" to="/ai-coach" icon={ArrowRight}>Open AI Coach</Button>
          </div>

          <div className="ai-sequence landing-reveal reveal-delay-2">
            <div className="ai-sequence-header"><span><i /> STRATIX AI // ANALYSIS PIPELINE</span><span>SAMPLE PLAYER</span></div>
            <div className="ai-sequence-body">
              <div className="ai-sequence-step ai-input-step">
                <span className="ai-step-label">01 // PLAYER INPUT</span>
                <div className="ai-bubble ai-player-bubble">What should I work on before my next queue?</div>
              </div>
              <div className="ai-connector ai-connector-one"><i /><span>READING TRAINING SIGNAL</span></div>
              <div className="ai-sequence-step ai-analysis-step">
                <span className="ai-step-label">02 // STRATIX AI ANALYSIS</span>
                <div className="ai-analysis-window">
                  <div className="ai-analysis-top"><BrainCircuit size={16} /><span>ANALYZING RECENT PATTERNS</span><i><b /><b /><b /></i></div>
                  <p className="ai-typing-text">Cross-referencing recent signal with the priority skill gap...</p>
                  <div className="ai-analysis-scan" aria-hidden="true" />
                </div>
              </div>
              <div className="ai-connector ai-connector-two"><i /><span>SIGNAL CONFIRMED</span></div>
              <div className="ai-sequence-output">
                <div className="ai-output-gap"><span><TriangleAlert size={13} /> WEAKNESS DETECTED</span><strong>{weakestSkill.skill}</strong><b>{weakestSkill.score}<small>/100</small></b></div>
                <div className="ai-output-action"><span><Sparkles size={13} /> RECOMMENDED TRAINING</span><strong>{SAMPLE_PLAYER.recommendedNext.title}</strong><Link to="/guides">Deploy training <ArrowRight size={14} /></Link></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section progression-command-section">
        <div className="page-shell cinematic-shell progression-command-shell">
          <div className="progression-command-visual landing-reveal">
            <div className="progression-command-heading"><span><Shield size={15} /> 04 // PLAYER PROGRESSION</span><span>DEMO DATA</span></div>
            <div className="progression-rank-display">
              <div><span>CURRENT RANK</span><strong>{SAMPLE_PLAYER.rank.tier} <em>{SAMPLE_PLAYER.rank.division}</em></strong></div>
              <div className="progression-rr"><b>{SAMPLE_PLAYER.rank.rr}</b><span>RR</span></div>
            </div>
            <div className="progression-xp-row"><span>LEVEL {SAMPLE_PLAYER.level}</span><span>{SAMPLE_PLAYER.xp.toLocaleString()} / {SAMPLE_PLAYER.xpToNextLevel.toLocaleString()} XP</span></div>
            <div className="progression-xp-bar"><i style={{ width: xpPercent + '%' }} /></div>
            <div className="progression-channel">
              <span>RANK SIGNAL</span><i /><span>SKILL ANALYSIS</span><i /><span>TRAINING ACTION</span><i /><span>NEXT MILESTONE</span>
            </div>
            <div className="progression-mini-skills">
              {SAMPLE_PLAYER.skillMatrix.slice(0, 4).map((skill, index) => (
                <div key={skill.skill} className={'mini-skill mini-skill-' + index}>
                  <span>{skill.skill}</span><b>{skill.score}</b><i><em style={{ width: skill.score + '%' }} /></i>
                </div>
              ))}
            </div>
            <div className="progression-command-footer"><span><Sparkles size={14} /> NEXT ACTION</span><strong>{SAMPLE_PLAYER.recommendedNext.title}</strong></div>
          </div>
          <div className="progression-command-copy landing-reveal reveal-delay-2">
            <span className="eyebrow">A dashboard that tells you what to do</span>
            <h2>Progress should feel<br /><span>less like a guess.</span></h2>
            <p>Rank goals, recent activity, and skill signals become one command view -- so the next useful practice block is always in reach.</p>
            <Button variant="secondary" to="/create-account" icon={ArrowRight}>Build your command center</Button>
          </div>
        </div>
      </section>

      <section className="landing-section skill-matrix-section">
        <div className="page-shell cinematic-shell skill-matrix-shell">
          <div className="skill-matrix-copy landing-reveal">
            <span className="eyebrow"><Waypoints size={14} /> 05 // SKILL MATRIX</span>
            <h2>See the shape<br /><span>of your game.</span></h2>
            <p>Skill signals bring contrast to your training. Find the strong foundations, isolate the gap, and point your next session at the work that matters.</p>
            <div className="skill-matrix-key">
              <span><i className="matrix-key-fill" /> CURRENT SIGNAL</span>
              <span><i className="matrix-key-priority" /> PRIORITY FOCUS</span>
            </div>
          </div>
          <div className="radar-console landing-reveal reveal-delay-2">
            <div className="radar-console-header"><span>SKILL SIGNAL MAP</span><span><i /> DEMO DATA</span></div>
            <SkillInstrumentField skills={SAMPLE_PLAYER.skillMatrix} priority={weakestSkill} />
            <div className="radar-console-footer"><span>PRIORITY FOCUS</span><strong>{weakestSkill.skill}</strong><b>{weakestSkill.score} / 100</b></div>
          </div>
        </div>
      </section>

      <section className="landing-section platform-showcase-section">
        <div className="page-shell cinematic-shell">
          <div className="showcase-header landing-reveal">
            <span className="eyebrow">06 // THE STRATIX PLATFORM</span>
            <h2>Everything you need<br /><span>to improve with intent.</span></h2>
            <p>STRATIX connects training, analysis, knowledge, coaching, assessment, and teammates into one system &mdash; not just an AI coach.</p>
          </div>
          <div className="showcase-wrap landing-reveal reveal-delay-2">
            <PlatformShowcase />
          </div>
        </div>
      </section>

      <section className="landing-section final-activation-section">
        <div className="final-activation-depth final-depth-grid" aria-hidden="true" />
        <div className="final-activation-depth final-depth-glow" aria-hidden="true" />
        <div className="final-activation-depth final-depth-edge" aria-hidden="true" />
        <div className="page-shell cinematic-shell">
          <div className="final-activation landing-reveal">
            <div className="final-scene" aria-hidden="true">
              <i className="scene-ring scene-ring-1" />
              <i className="scene-ring scene-ring-2" />
              <i className="scene-ring scene-ring-3" />
              <i className="scene-crosshair scene-crosshair-h" />
              <i className="scene-crosshair scene-crosshair-v" />
              <i className="scene-signal" />
              <i className="scene-pulse" />
              <span className="scene-bracket scene-bracket-tl" />
              <span className="scene-bracket scene-bracket-br" />
              <span className="scene-coord scene-coord-tl">SESSION // 00</span>
              <span className="scene-coord scene-coord-br">STRATIX CORE // ONLINE</span>
            </div>

            <div className="activation-copy">
              <span className="eyebrow"><LockKeyhole size={14} /> SYSTEM READY</span>
              <div className="activation-status-line" aria-hidden="true">
                <span className="status-line-ready">SYSTEM STATUS · READY</span>
                <span className="status-line-signal">SIGNAL DETECTED &rarr; SESSION READY</span>
              </div>
              <h2>Your training<br />system<br /><span>is waiting.</span></h2>
              <p>Initialize STRATIX and give the time you spend improving a sharper direction.</p>
              <div className="activation-actions">
                <Button variant="primary" to="/create-account" icon={ArrowRight}>Start training</Button>
                <Button variant="ghost" to="/guides">Explore guides</Button>
              </div>
            </div>

            <div className="activation-status"><span><i /> CORE ONLINE</span><span>READY FOR DEPLOYMENT</span></div>
          </div>
        </div>
      </section>
    </div>
  )
}
