import { Search, X, SlidersHorizontal } from 'lucide-react'
import CategoryTiles from './CategoryTiles.jsx'

export default function ControlDeck({
  query,
  onQueryChange,
  difficulty,
  onDifficultyChange,
  difficulties,
  categories,
  category,
  onCategoryChange,
}) {
  return (
    <div className="control-deck">
      <div className="control-deck-header">
        <SlidersHorizontal size={15} />
        <span>Database Access // Search &amp; Filter</span>
      </div>

      <div className="control-deck-search">
        <Search size={17} />
        <input
          type="text"
          placeholder="Search tactical knowledge…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search guides"
        />
        {query && (
          <button className="search-clear" onClick={() => onQueryChange('')} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      <div className="control-deck-difficulty" role="group" aria-label="Filter by difficulty">
        {difficulties.map((d) => (
          <button
            key={d}
            className={`difficulty-chip ${difficulty === d ? 'difficulty-chip-active' : ''}`}
            onClick={() => onDifficultyChange(d)}
            aria-pressed={difficulty === d}
          >
            {d}
          </button>
        ))}
      </div>

      <CategoryTiles categories={categories} active={category} onSelect={onCategoryChange} />
    </div>
  )
}
