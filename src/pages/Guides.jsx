import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radio, ChevronDown, ArrowRight } from 'lucide-react'
import { guides, GUIDE_CATEGORIES, DIFFICULTIES, getFeaturedGuide, searchMatches } from '../data/guides.js'
import { getCategoryMeta } from '../components/guides/categoryMeta.js'
import GuideCard from '../components/guides/GuideCard.jsx'
import FeaturedGuide from '../components/guides/FeaturedGuide.jsx'
import ControlDeck from '../components/guides/ControlDeck.jsx'
import RecommendedGuides from '../components/guides/RecommendedGuides.jsx'
import GuidesHeroVisual from '../components/guides/GuidesHeroVisual.jsx'
import Button from '../components/ui/Button.jsx'
import './Guides.css'
import './CategoryChipFix.css'

const DIFFICULTY_RANK = Object.fromEntries(DIFFICULTIES.map((d, i) => [d.key, i]))

const withAll = (list, field) => [
  { key: 'all', label: 'All', count: guides.length },
  ...list.map(({ key, label }) => ({ key, label, count: guides.filter((g) => g[field] === key).length })),
]
const CATEGORY_FILTERS = withAll(GUIDE_CATEGORIES, 'category')
const DIFFICULTY_FILTERS = withAll(DIFFICULTIES, 'difficulty')

export default function Guides() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  const featured = getFeaturedGuide()

  const filtered = useMemo(() => {
    return guides.filter((g) =>
      searchMatches(g, query) &&
      (category === 'all' || g.category === category) &&
      (difficulty === 'all' || g.difficulty === difficulty),
    )
  }, [query, category, difficulty])

  // Always grouped by category in the fixed library order, beginner →
  // advanced within each; sections with no matches are dropped.
  const sections = useMemo(() => {
    return GUIDE_CATEGORIES.map((cat, i) => ({
      ...cat,
      number: String(i + 1).padStart(2, '0'),
      items: filtered
        .filter((g) => g.category === cat.key)
        .sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]),
    })).filter((s) => s.items.length > 0)
  }, [filtered])

  const isFiltering = query.trim() !== '' || category !== 'all' || difficulty !== 'all'

  const scrollToDeck = () => {
    document.getElementById('guide-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
    setDifficulty('all')
  }

  return (
    <div className="guides-page">
      <section className="guides-hero">
        <div className="guides-hero-grid-overlay" aria-hidden="true" />
        <div className="guides-hero-inner">
          <div className="guides-hero-copy">
            <div className="guides-hero-status">
              <span className="status-dot" />
              <span>Guide library // {guides.length} curated briefings</span>
            </div>
            <span className="eyebrow guides-hero-eyebrow">Guides // Tactical Intelligence</span>
            <h1 className="guides-hero-title">
              Tactical knowledge<br />for your next round.
            </h1>
            <p className="guides-hero-sub">
              Situational reads for maps, weapons, utility, strategy, and the mental side of climbing —
              written to be used between queues, not just read once.
            </p>
            <button className="hero-scan-btn" onClick={scrollToDeck}>
              Browse the library <ChevronDown size={16} />
            </button>
          </div>
          <div className="guides-hero-visual">
            <GuidesHeroVisual guideCount={guides.length} categoryCount={GUIDE_CATEGORIES.length} />
          </div>
        </div>
      </section>

      <div className="page-shell guides-shell">
        <FeaturedGuide guide={featured} />

        <section id="guide-library" className="guide-library">
          <div className="guide-library-intro">
            <span className="eyebrow">The library</span>
            <h2>Five disciplines. Five essential guides each.</h2>
          </div>

          <ControlDeck
            query={query}
            onQueryChange={setQuery}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            difficulties={DIFFICULTY_FILTERS}
            categories={CATEGORY_FILTERS}
            category={category}
            onCategoryChange={setCategory}
          />

          {isFiltering && (
            <div className="guides-results-row" aria-live="polite">
              <span>
                Showing <strong>{filtered.length}</strong> of {guides.length} guides
              </span>
              <button className="guides-clear-btn" onClick={clearFilters}>Clear filters</button>
            </div>
          )}

          {sections.length === 0 ? (
            <div className="guides-empty-state">
              <Radio size={20} />
              <h3>No guides found</h3>
              <p>Try a different search or filter.</p>
              <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <div className="guide-library-groups">
              {sections.map((section) => {
                const Icon = getCategoryMeta(section.key).icon
                const count = section.items.length
                return (
                  <section key={section.key} className="guide-group" aria-labelledby={`guide-group-${section.key}`}>
                    <header className="guide-group-heading">
                      <span className="guide-group-number">{section.number}</span>
                      <span className="guide-group-slash" aria-hidden="true">//</span>
                      <h3 id={`guide-group-${section.key}`} className="guide-group-title">
                        <Icon size={16} aria-hidden="true" />
                        {section.label}
                      </h3>
                      <span className="guide-group-rule" aria-hidden="true" />
                      <span className="guide-group-count">{count} {count === 1 ? 'guide' : 'guides'}</span>
                    </header>
                    <div className="guide-grid">
                      {section.items.map((g, i) => (
                        <GuideCard key={g.id} guide={g} index={i} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </section>

        <RecommendedGuides />
      </div>

      <section className="guides-final-cta-band">
        <div className="page-shell">
          <div className="training-flow-connector" aria-hidden="true">
            <span>Training matrix</span>
            <i />
            <span>AI analysis</span>
          </div>

          <section className="coach-terminal" aria-labelledby="coach-terminal-title">
            <span className="coach-hud-line" aria-hidden="true" />
            <div className="coach-radar" aria-hidden="true">
              <span className="coach-radar-ring" />
              <span className="coach-radar-ring" />
              <span className="coach-radar-ring" />
              <span className="coach-radar-cross" />
              <span className="coach-radar-sweep" />
              <span className="coach-radar-blip" />
              <span className="coach-radar-blip" />
            </div>

            <div className="coach-status">
              <span className="coach-status-name">
                <i className="coach-status-dot" aria-hidden="true" />
                AI Coach
              </span>
              <span className="coach-status-state">System online</span>
              <dl className="coach-status-meta">
                <div><dt>Input</dt><dd>Skill matrix</dd></div>
                <div><dt>Mode</dt><dd>Live session</dd></div>
              </dl>
            </div>

            <div className="coach-copy">
              <span className="coach-eyebrow">02 // Next step — AI analysis</span>
              <h2 id="coach-terminal-title">
                Guides tell you what to do.<br />
                AI Coach tells you <em>why.</em>
              </h2>
              <p>Turn what you just learned into a live session and a training plan built around your goals.</p>
            </div>

            <div className="coach-action">
              <Link to="/ai-coach" className="coach-cta">
                Talk to AI Coach
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <span className="coach-cue" aria-hidden="true">Analyze my next step //</span>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
