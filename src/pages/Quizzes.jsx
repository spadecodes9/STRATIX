import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import QuizCard from '../components/quizzes/QuizCard.jsx'
import QuizModal from '../components/quizzes/QuizModal.jsx'
import QuizHeroVisual from '../components/quizzes/QuizHeroVisual.jsx'
import PremiumUpgradeModal from '../components/premium/PremiumUpgradeModal.jsx'
import { usePremium } from '../context/PremiumContext.jsx'
import { quizCatalog } from '../data/quizzes.js'
import './Quizzes.css'

const pad = (n) => String(n).padStart(2, '0')

const availableTracks = quizCatalog.filter((c) => c.status === 'available')
const TRACK_COUNT = pad(availableTracks.length)
const SCENARIO_COUNT = pad(availableTracks.reduce((sum, c) => sum + c.quiz.questions.length, 0))

const WHY_BLOCKS = [
  { title: 'Read the round', text: 'Recognize timing, numbers, pressure, and information before you commit.' },
  { title: 'Choose faster', text: 'Commit to a play from limited information instead of hesitating through every option.' },
  { title: 'Build reps', text: 'Short scenarios let you repeat the decisions that matter without playing a full match.' },
]

// Which track (by catalog index) covers each skill. This is a content map of
// the free library — not a user score — so it renders as a coverage matrix.
const SKILL_COVERAGE = [
  { skill: 'Round reading', tracks: [0] },
  { skill: 'Decision speed', tracks: [0, 1, 2] },
  { skill: 'Fight selection', tracks: [0, 1] },
  { skill: 'Utility awareness', tracks: [1, 2] },
  { skill: 'Adaptation', tracks: [0, 2] },
]

const STEPS = [
  { title: 'Read', text: 'Take in the situation — side, numbers, and what you know.' },
  { title: 'Decide', text: 'Choose your play before the round decides for you.' },
  { title: 'Learn', text: 'See why the call works — or exactly where your read went wrong.' },
]

export default function Quizzes() {
  const [openQuiz, setOpenQuiz] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const { isPremium, isLoading } = usePremium()
  const pageRef = useRef(null)

  // Scroll reveal: children of each [data-reveal] group fade/settle in once
  // the group enters the viewport. Content is only hidden after this effect
  // opts in via .qz-reveal-ready, so nothing is ever stuck invisible.
  useEffect(() => {
    const root = pageRef.current
    const groups = root ? [...root.querySelectorAll('[data-reveal]')] : []
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') return

    root.classList.add('qz-reveal-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    )
    groups.forEach((group) => observer.observe(group))
    return () => observer.disconnect()
  }, [isLoading, isPremium])

  const handlePlay = (category) => {
    setOpenQuiz(category.quiz)
    setIsModalOpen(true)
  }
  const handleClose = () => setIsModalOpen(false)
  const scrollToLibrary = () =>
    document.getElementById('quiz-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="quizzes-page" ref={pageRef}>
      {/* HERO */}
      <section className="qz-hero">
        <div className="qz-hero-grid" aria-hidden="true" />
        <div className="qz-hero-inner">
          <div className="qz-hero-copy">
            <div className="qz-hero-status">
              <span className="qz-status-dot" />
              <span>Training system // Online</span>
            </div>
            <span className="eyebrow">Quizzes // Decision Training</span>
            <h1 className="qz-hero-title">Think faster.<br />Play smarter.</h1>
            <p className="qz-hero-sub">
              Short decision drills built around the moments that actually decide rounds — rotations,
              fights, utility, positioning, and adapting when the plan breaks.
            </p>
            <button type="button" className="qz-hero-btn" onClick={scrollToLibrary}>
              Start a drill <ArrowDown size={16} />
            </button>
          </div>

          <div className="qz-hero-visual">
            <QuizHeroVisual />
            <dl className="qz-readout">
              <div className="qz-readout-title"><span className="qz-readout-dot" />Training system</div>
              <div><dt>Scenarios</dt><dd>{SCENARIO_COUNT}</dd></div>
              <div><dt>Tracks</dt><dd>{TRACK_COUNT}</dd></div>
              <div><dt>Format</dt><dd>Decision</dd></div>
              <div><dt>Session</dt><dd>~5 min</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="qz-statement">
        <div className="qz-statement-inner">
          <span className="qz-statement-mark" aria-hidden="true">//</span>
          <p className="qz-statement-text" data-reveal>
            <span className="qz-statement-l1">Knowing the answer isn’t enough.</span>
            <span className="qz-statement-l2">Knowing when to make the call is.</span>
          </p>
          <p className="qz-statement-sub">Quizzes turn game knowledge into faster decisions under pressure.</p>
        </div>
      </section>

      <div className="page-shell qz-shell">
        {/* LIBRARY */}
        <section id="quiz-library" className="qz-section">
          <header className="qz-section-head" data-reveal>
            <div>
              <span className="eyebrow">Quiz Library // {TRACK_COUNT} Training Tracks</span>
              <h2>Pick a track. Make the call.</h2>
            </div>
            <span className="qz-section-meta">{SCENARIO_COUNT} scenarios · free</span>
          </header>
          <div className="quiz-category-grid" data-reveal>
            {quizCatalog.map((category, index) => (
              <QuizCard
                key={category.id}
                category={category}
                number={index + 1}
                onPlay={() => handlePlay(category)}
              />
            ))}
          </div>
        </section>

        {/* WHY */}
        <section className="qz-section qz-why">
          <div className="qz-why-intro" data-reveal>
            <span className="eyebrow">Why quizzes?</span>
            <h2>Turn knowledge into decisions.</h2>
            <p>
              Guides teach you what to know. Quizzes test whether you can spot the right call when the
              round gives you seconds, not minutes.
            </p>
          </div>
          <ol className="qz-why-list" data-reveal>
            {WHY_BLOCKS.map((block, i) => (
              <li key={block.title}>
                <span className="qz-index">{pad(i + 1)}</span>
                <div>
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* TRAINING */}
        <section className="qz-section qz-training" data-reveal>
          <div className="qz-panel qz-coverage">
            <span className="qz-panel-corner qz-panel-corner-tl" aria-hidden="true" />
            <span className="qz-panel-corner qz-panel-corner-br" aria-hidden="true" />
            <div className="qz-panel-head">
              <span className="eyebrow">What you’re training</span>
              <span className="qz-panel-note">Skills covered · not a score</span>
            </div>
            <table className="qz-coverage-table">
              <thead>
                <tr>
                  <th scope="col">Skill</th>
                  {availableTracks.map((track, i) => (
                    <th key={track.id} scope="col" title={track.label}>
                      <span aria-hidden="true">{pad(i + 1)}</span>
                      <span className="sr-only">{track.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SKILL_COVERAGE.map((row) => (
                  <tr key={row.skill}>
                    <th scope="row">{row.skill}</th>
                    {availableTracks.map((track, i) => {
                      const covered = row.tracks.includes(i)
                      return (
                        <td key={track.id}>
                          <span className={'qz-cell' + (covered ? ' is-covered' : '')} />
                          <span className="sr-only">{covered ? 'Covered' : 'Not covered'}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="qz-coverage-legend">
              {availableTracks.map((track, i) => (
                <li key={track.id}><b>{pad(i + 1)}</b> {track.label}</li>
              ))}
            </ul>
          </div>

          <dl className="qz-telemetry">
            <div><dd>{SCENARIO_COUNT}</dd><dt>Free scenarios</dt></div>
            <div><dd>{TRACK_COUNT}</dd><dt>Training tracks</dt></div>
            <div><dd>~5<small>min</small></dd><dt>Per session</dt></div>
          </dl>
        </section>

        {/* HOW IT WORKS */}
        <section className="qz-section qz-how" data-reveal>
          <span className="eyebrow">How it works // 03 steps</span>
          <ol className="qz-steps">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="qz-index">{pad(i + 1)}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PREMIUM */}
        {!isLoading && !isPremium && (
          <section className="qz-premium" data-reveal>
            <span className="qz-premium-ticker"><Sparkles size={14} /> Next level // Premium</span>
            <div className="qz-premium-body">
              <div>
                <h2>Ready for more reps?</h2>
                <p>
                  Unlock additional scenarios and deeper training tracks with STRATIX Premium. The{' '}
                  {TRACK_COUNT} tracks and {SCENARIO_COUNT} scenarios above stay free.
                </p>
              </div>
              <Button variant="primary" onClick={() => setIsUpgradeModalOpen(true)}>
                Take Premium <span className="qz-arrow" aria-hidden="true">→</span>
              </Button>
            </div>
          </section>
        )}
      </div>

      {openQuiz && <QuizModal quiz={openQuiz} isOpen={isModalOpen} onClose={handleClose} />}
      <PremiumUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  )
}
