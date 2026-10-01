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
import Badge from '../components/ui/Badge.jsx'
import HeroGraphic from '../components/HeroGraphic.jsx'
import { courses } from '../data/courses.js'
import { currentUser } from '../data/user.js'
import './Landing.css'

const platformModules = [
  {
    id: 'courses',
    icon: GraduationCap,
    label: 'Courses',
    title: 'Structured reps with a purpose.',
    body: 'Follow a focused training path instead of collecting disconnected advice.',
    to: '/courses',
    action: 'Explore courses',
  },
  {
    id: 'guides',
    icon: BookOpen,
    label: 'Guides',
    title: 'Tactical answers for the moment.',
    body: 'Open the map, matchup, or setup you need before the next queue begins.',
    to: '/guides',
    action: 'Browse guides',
  },
  {
    id: 'coach',
    icon: BrainCircuit,
    label: 'AI Coach',
    title: 'Turn a question into the next move.',
    body: 'Connect a mistake or decision to the lesson that can help you fix it.',
    to: '/ai-coach',
    action: 'Meet the coach',
  },
  {
    id: 'progress',
    icon: TrendingUp,
    label: 'Progression',
    title: 'Make the pattern visible.',
    body: 'Use skill signals, course progress, and recent effort to decide what comes next.',
    to: '/create-account',
    action: 'Build your system',
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

function SkillRadar({ skills }) {
  const center = 160
  const radius = 103
  const pointFor = (score, index, distance = radius) => {
    const angle = ((Math.PI * 2) / skills.length) * index - Math.PI / 2
    const scaled = distance * (score / 100)
    return {
      x: center + Math.cos(angle) * scaled,
      y: center + Math.sin(angle) * scaled,
    }
  }
  const shapePoints = skills.map((skill, index) => {
    const point = pointFor(skill.score, index)
    return point.x + ',' + point.y
  }).join(' ')
  const axisPoints = skills.map((_, index) => {
    const point = pointFor(100, index)
    return point.x + ',' + point.y
  }).join(' ')

  return (
    <svg className="skill-radar" viewBox="0 0 320 320" role="img" aria-label="Skill matrix preview">
      <polygon className="radar-grid radar-grid-outer" points={axisPoints} />
      {[75, 50, 25].map((level) => {
        const points = skills.map((_, index) => {
          const point = pointFor(level, index)
          return point.x + ',' + point.y
        }).join(' ')
        return <polygon key={level} className="radar-grid" points={points} />
      })}
      {skills.map((_, index) => {
        const point = pointFor(100, index)
        return <line key={index} className="radar-axis" x1={center} y1={center} x2={point.x} y2={point.y} />
      })}
      <polygon className="radar-shape" points={shapePoints} />
      {skills.map((skill, index) => {
        const point = pointFor(skill.score, index)
        const label = pointFor(100, index, 132)
        return (
          <g key={skill.skill} className="radar-node" style={{ '--node-delay': index * 90 + 'ms' }}>
            <title>{skill.skill + ': ' + skill.score + ' out of 100'}</title>
            <circle cx={point.x} cy={point.y} r="5" />
            <text x={label.x} y={label.y}>{skill.skill.replace(' & ', ' + ')}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Landing() {
  const [activeModule, setActiveModule] = useState('coach')
  const [systemBooted, setSystemBooted] = useState(false)
  const heroRef = useRef(null)
  const featured = courses.slice(0, 3)
  const weakestSkill = currentUser.skillMatrix.reduce((lowest, skill) => (
    skill.score < lowest.score ? skill : lowest
  ))
  const xpPercent = Math.round((currentUser.xp / currentUser.xpToNextLevel) * 100)
  const rrDisplay = useCountUp(currentUser.rank.rr, systemBooted)
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
              <Button variant="secondary" to="/courses" icon={ChevronRight}>Explore the system</Button>
            </div>
            <div className="hero-live-signal hero-intro hero-intro-5">
              <span><i /> SYSTEM ONLINE</span>
              <span>COURSES / GUIDES / AI / PROGRESSION</span>
            </div>
          </div>

          <div className={'hero-analysis-stage hero-intro hero-intro-3 ' + (systemBooted ? 'is-booted' : '')}>
            <div className="hero-stage-header">
              <span><CircleDot size={13} /> LIVE TRAINING ANALYSIS</span>
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
              <span>PLAYER SIGNAL</span>
              <strong>{currentUser.username}</strong>
              <small><i /> SESSION PROFILE READY</small>
            </div>
            <div className="hero-data-card hero-rank-card">
              <span>CURRENT RANK</span>
              <strong>{currentUser.rank.tier} {currentUser.rank.division}</strong>
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
              <strong>{currentUser.recommendedNext.title}</strong>
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

          <div className={'platform-system landing-reveal is-active-' + activeModule}>
            <div className="system-wires" aria-hidden="true">
              <i className="wire wire-top-left" /><i className="wire wire-top-right" />
              <i className="wire wire-bottom-left" /><i className="wire wire-bottom-right" />
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
          <div className="training-path">
            <div className="training-path-line" aria-hidden="true"><i /></div>
            {trainingSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <article key={step.label} className={'training-stage landing-reveal reveal-delay-' + ((index % 3) + 1)}>
                  <span className="training-stage-number">0{index + 1}</span>
                  <div className="training-stage-icon"><Icon size={19} /></div>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="landing-section course-command-section">
        <div className="page-shell cinematic-shell">
          <div className="section-split-heading landing-reveal">
            <div>
              <span className="eyebrow">03 // TRAINING LIBRARY</span>
              <h2>Choose a path.<br /><span>Train the decision.</span></h2>
            </div>
            <Button variant="ghost" to="/courses" icon={ArrowRight}>View all training</Button>
          </div>
          <div className="course-command-grid">
            {featured.map((course, index) => {
              const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0)
              const progressWidth = Math.min(100, 35 + lessonCount * 7)
              return (
                <Link
                  key={course.id}
                  to={'/courses/' + course.id}
                  className={'course-command-card course-command-card-' + index + ' landing-reveal reveal-delay-' + (index + 1)}
                >
                  <div className="course-command-top">
                    <Badge variant="red">{course.category}</Badge>
                    <span>PATH 0{index + 1}</span>
                  </div>
                  <span className="course-command-number">0{index + 1}</span>
                  <h3>{course.title}</h3>
                  <p>{course.tagline}</p>
                  <div className="course-command-spec">
                    <span>{course.difficulty}</span><i /><span>{lessonCount} lessons</span><i /><span>{course.duration}</span>
                  </div>
                  <div className="course-command-progress">
                    <div><span>TRAINING DENSITY</span><span>{lessonCount} modules</span></div>
                    <i><b style={{ width: progressWidth + '%' }} /></i>
                  </div>
                  <span className="course-command-cta">Open training path <ArrowRight size={16} /></span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="landing-section ai-analysis-section">
        <div className="page-shell cinematic-shell ai-shell">
          <div className="ai-copy landing-reveal">
            <span className="eyebrow"><BrainCircuit size={14} /> 04 // STRATIX AI COACH</span>
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
            <div className="ai-sequence-header"><span><i /> STRATIX AI // ANALYSIS PIPELINE</span><span>LIVE</span></div>
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
                  <p className="ai-typing-text">Cross-referencing course momentum with the priority skill signal...</p>
                  <div className="ai-analysis-scan" aria-hidden="true" />
                </div>
              </div>
              <div className="ai-connector ai-connector-two"><i /><span>SIGNAL CONFIRMED</span></div>
              <div className="ai-sequence-output">
                <div className="ai-output-gap"><span><TriangleAlert size={13} /> WEAKNESS DETECTED</span><strong>{weakestSkill.skill}</strong><b>{weakestSkill.score}<small>/100</small></b></div>
                <div className="ai-output-action"><span><Sparkles size={13} /> RECOMMENDED TRAINING</span><strong>{currentUser.recommendedNext.title}</strong><Link to={'/courses/' + currentUser.recommendedNext.courseId}>Deploy training <ArrowRight size={14} /></Link></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section progression-command-section">
        <div className="page-shell cinematic-shell progression-command-shell">
          <div className="progression-command-visual landing-reveal">
            <div className="progression-command-heading"><span><Shield size={15} /> 05 // PLAYER PROGRESSION</span><span>DEMO SIGNAL</span></div>
            <div className="progression-rank-display">
              <div><span>CURRENT RANK</span><strong>{currentUser.rank.tier} <em>{currentUser.rank.division}</em></strong></div>
              <div className="progression-rr"><b>{currentUser.rank.rr}</b><span>RR</span></div>
            </div>
            <div className="progression-xp-row"><span>LEVEL {currentUser.level}</span><span>{currentUser.xp.toLocaleString()} / {currentUser.xpToNextLevel.toLocaleString()} XP</span></div>
            <div className="progression-xp-bar"><i style={{ width: xpPercent + '%' }} /></div>
            <div className="progression-channel">
              <span>RANK SIGNAL</span><i /><span>SKILL ANALYSIS</span><i /><span>TRAINING ACTION</span><i /><span>NEXT MILESTONE</span>
            </div>
            <div className="progression-mini-skills">
              {currentUser.skillMatrix.slice(0, 4).map((skill, index) => (
                <div key={skill.skill} className={'mini-skill mini-skill-' + index}>
                  <span>{skill.skill}</span><b>{skill.score}</b><i><em style={{ width: skill.score + '%' }} /></i>
                </div>
              ))}
            </div>
            <div className="progression-command-footer"><span><Sparkles size={14} /> NEXT ACTION</span><strong>{currentUser.recommendedNext.title}</strong></div>
          </div>
          <div className="progression-command-copy landing-reveal reveal-delay-2">
            <span className="eyebrow">A dashboard that tells you what to do</span>
            <h2>Progress should feel<br /><span>less like a guess.</span></h2>
            <p>Rank goals, course momentum, recent activity, and skill signals become one command view -- so the next useful practice block is always in reach.</p>
            <Button variant="secondary" to="/create-account" icon={ArrowRight}>Build your command center</Button>
          </div>
        </div>
      </section>

      <section className="landing-section skill-matrix-section">
        <div className="page-shell cinematic-shell skill-matrix-shell">
          <div className="skill-matrix-copy landing-reveal">
            <span className="eyebrow"><Waypoints size={14} /> 06 // SKILL MATRIX</span>
            <h2>See the shape<br /><span>of your game.</span></h2>
            <p>Skill signals bring contrast to your training. Find the strong foundations, isolate the gap, and point your next session at the work that matters.</p>
            <div className="skill-matrix-key">
              <span><i className="matrix-key-fill" /> CURRENT SIGNAL</span>
              <span><i className="matrix-key-priority" /> PRIORITY FOCUS</span>
            </div>
          </div>
          <div className="radar-console landing-reveal reveal-delay-2">
            <div className="radar-console-header"><span>SKILL SIGNAL MAP</span><span><i /> SCANNING</span></div>
            <SkillRadar skills={currentUser.skillMatrix} />
            <div className="radar-console-footer"><span>PRIORITY FOCUS</span><strong>{weakestSkill.skill}</strong><b>{weakestSkill.score} / 100</b></div>
          </div>
        </div>
      </section>

      <section className="landing-section final-activation-section">
        <div className="final-activation-depth final-depth-grid" aria-hidden="true" />
        <div className="final-activation-depth final-depth-glow" aria-hidden="true" />
        <div className="page-shell cinematic-shell">
          <div className="final-activation landing-reveal">
            <div className="activation-rings" aria-hidden="true"><i /><i /><i /><b /></div>
            <div className="activation-copy">
              <span className="eyebrow"><LockKeyhole size={14} /> SYSTEM READY</span>
              <h2>Your training system<br /><span>is waiting.</span></h2>
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
