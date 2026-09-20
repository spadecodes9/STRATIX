import { useMemo, useState } from 'react'
import { Radio, ChevronDown } from 'lucide-react'
import { guides, getFeaturedGuide, getActiveCategories, searchMatches } from '../data/guides.js'
import { getCategoryMeta } from '../components/guides/categoryMeta.js'
import GuideCard from '../components/guides/GuideCard.jsx'
import FeaturedGuide from '../components/guides/FeaturedGuide.jsx'
import ControlDeck from '../components/guides/ControlDeck.jsx'
import RecommendedGuides from '../components/guides/RecommendedGuides.jsx'
import AiCoachBridge from '../components/guides/AiCoachBridge.jsx'
import GuidesHeroVisual from '../components/guides/GuidesHeroVisual.jsx'
import Button from '../components/ui/Button.jsx'
import './Guides.css'
import './CategoryChipFix.css'

const DIFFICULTY_ORDER = ['Beginner', 'Intermediate', 'Advanced']

// Fixed section order for the default (unfiltered) library view — makes the
// full list feel curated rather than a flat stream of cards. Filtering by
// category or searching bypasses this and shows a normal flat result grid,
// since permanently separated sections would fight against those results.
const LIBRARY_SECTION_ORDER = ['Maps', 'Weapons', 'Strategy', 'Utility', 'Mental Game']
const LIBRARY_SECTION_LABEL = {
  Maps: 'Maps',
  Weapons: 'Weapons & Aim',
  Strategy: 'Strategy',
  Utility: 'Utility',
  'Mental Game': 'Mental Game',
}
const DIFFICULTY_RANK = { Beginner: 0, Intermediate: 1, Advanced: 2 }

function byDifficulty(list) {
  return [...list].sort((a, b) => (DIFFICULTY_RANK[a.difficulty] ?? 99) - (DIFFICULTY_RANK[b.difficulty] ?? 99))
}

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
    return guides.filter((g) => {
      const matchesQuery = searchMatches(g, query)
      const matchesCategory = category === 'All' || g.category === category
      const matchesDifficulty = difficulty === 'All' || g.difficulty === difficulty
      return matchesQuery && matchesCategory && matchesDifficulty
    })
  }, [query, category, difficulty])

  const isFiltering = query.trim() !== '' || category !== 'All' || difficulty !== 'All'
  const gridGuides = isFiltering ? filtered : filtered.filter((g) => g.id !== featured.id)

  // Default (unfiltered) view: group by category in a fixed order, sorted
  // Beginner -> Advanced within each group. Any active search/category/
  // difficulty filter falls back to a normal flat grid of matches instead,
  // so filtering behavior is unchanged.
  const librarySections = useMemo(() => {
    if (isFiltering) return null
    return LIBRARY_SECTION_ORDER
      .map((cat) => ({ category: cat, items: byDifficulty(gridGuides.filter((g) => g.category === cat)) }))
      .filter((section) => section.items.length > 0)
  }, [isFiltering, gridGuides])

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
          <span className="eyebrow guides-section-heading">Guide Library</span>
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
            {isFiltering ? `${filtered.length} guide${filtered.length === 1 ? '' : 's'} found` : 'All guides'}
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
        ) : isFiltering ? (
          <div className="guide-grid">
            {gridGuides.map((g, i) => (
              <GuideCard key={g.id} guide={g} index={i} />
            ))}
          </div>
        ) : (
          <div className="guide-library-groups">
            {librarySections.map((section) => {
              const meta = getCategoryMeta(section.category)
              const Icon = meta.icon
              return (
                <section key={section.category} className="guide-group">
                  <div className="guide-group-heading">
                    <Icon size={16} />
                    <span>{LIBRARY_SECTION_LABEL[section.category] || section.category}</span>
                    <span className="guide-group-count">{section.items.length}</span>
                  </div>
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
              <h2>Guides tell you what to do.<br />AI Coach tells you why.</h2>
              <p>Bring what you just read into a live session and turn it into a plan built around your fundamentals.</p>
              <Button to="/ai-coach" variant="primary">Talk to AI Coach</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
