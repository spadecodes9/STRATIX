import { useMemo, useState } from 'react'
import { Radio, ChevronDown } from 'lucide-react'
import { guides, getFeaturedGuide, getActiveCategories } from '../data/guides.js'
import GuideCard from '../components/guides/GuideCard.jsx'
import FeaturedGuide from '../components/guides/FeaturedGuide.jsx'
import ControlDeck from '../components/guides/ControlDeck.jsx'
import RecommendedGuides from '../components/guides/RecommendedGuides.jsx'
import AiCoachBridge from '../components/guides/AiCoachBridge.jsx'
import GuidesHeroVisual from '../components/guides/GuidesHeroVisual.jsx'
import Button from '../components/ui/Button.jsx'
import './Guides.css'

const DIFFICULTY_ORDER = ['Beginner', 'Intermediate', 'Advanced']

export default function Guides() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')

  const featured = getFeaturedGuide()
  const activeCategories = getActiveCategories()
  const difficulties = useMemo(() => {
    const present = new Set(guides.map((g) => g.difficulty))
    return ['All', ...DIFFICULTY_ORDER.filter((d) => present.has(d))]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return guides.filter((g) => {
      const matchesQuery =
        !q || g.title.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q))
      const matchesCategory = category === 'All' || g.category === category
      const matchesDifficulty = difficulty === 'All' || g.difficulty === difficulty
      return matchesQuery && matchesCategory && matchesDifficulty
    })
  }, [query, category, difficulty])

  const isFiltering = query.trim() !== '' || category !== 'All' || difficulty !== 'All'
  const gridGuides = isFiltering ? filtered : filtered.filter((g) => g.id !== featured.id)

  const scrollToDeck = () => {
    document.getElementById('control-deck')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
    setDifficulty('All')
  }

  return (
    <div className="guides-page">
      <section className="guides-hero">
        <div className="guides-hero-grid-overlay" aria-hidden="true" />
        <div className="guides-hero-inner">
          <div className="guides-hero-copy">
            <div className="guides-hero-status">
              <span className="status-dot" />
              <span>Database status // Online</span>
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
              Search the database <ChevronDown size={16} />
            </button>
          </div>
          <div className="guides-hero-visual">
            <GuidesHeroVisual guideCount={guides.length} categoryCount={activeCategories.length} />
          </div>
        </div>
      </section>

      <div className="page-shell guides-shell">
        <FeaturedGuide guide={featured} />

        <div id="control-deck">
          <ControlDeck
            query={query}
            onQueryChange={setQuery}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            difficulties={difficulties}
            categories={activeCategories}
            category={category}
            onCategoryChange={setCategory}
          />
        </div>

        <div className="guides-results-row">
          <h2 className="guides-results-heading">
            {isFiltering ? `${filtered.length} guide${filtered.length === 1 ? '' : 's'} found` : 'Guide library'}
          </h2>
          {isFiltering && (
            <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state empty-state-tactical">
            <Radio size={20} />
            <p>No guides match that search yet — try a different term or clear your filters.</p>
          </div>
        ) : (
          <div className="guide-grid">
            {gridGuides.map((g, i) => (
              <GuideCard key={g.id} guide={g} index={i} />
            ))}
          </div>
        )}

        <RecommendedGuides />
      </div>

      <section className="coach-bridge-band">
        <div className="page-shell">
          <AiCoachBridge variant="panel" />
        </div>
      </section>

      <section className="guides-final-cta-band">
        <div className="page-shell">
          <div className="system-activation-panel">
            <div className="system-activation-scanline" aria-hidden="true" />
            <div className="system-activation-content">
              <span className="system-ticker">System ready // awaiting input</span>
              <h2>Guides tell you what to do.<br />Courses build the habit.</h2>
              <p>Pair what you just read with a structured course built around the same fundamentals.</p>
              <Button to="/courses" variant="primary">Explore Courses</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
