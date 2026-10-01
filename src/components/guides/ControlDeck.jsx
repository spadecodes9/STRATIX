import { Search, X, LayoutGrid } from 'lucide-react'
import { getCategoryMeta } from './categoryMeta.js'

// `categories` / `difficulties`: [{ key, label, count }], first entry is 'all'.
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
      <div className="control-deck-search">
        <Search size={17} />
        <input
          type="text"
          placeholder="Search guides — try “retake”, “Vandal”, “tilt”…"
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

      <div className="control-deck-row">
        <span className="control-deck-label">Category</span>
        <div className="category-chip-row" role="group" aria-label="Filter guides by category">
          {categories.map(({ key, label, count }) => {
            const Icon = key === 'all' ? LayoutGrid : getCategoryMeta(key).icon
            const isActive = category === key
            return (
              <button
                key={key}
                className={`category-chip ${isActive ? 'category-chip-active' : ''}`}
                onClick={() => onCategoryChange(key)}
                aria-pressed={isActive}
              >
                <Icon size={14} />
                <span>{label}</span>
                <span className="category-chip-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="control-deck-row">
        <span className="control-deck-label">Difficulty</span>
        <div className="control-deck-difficulty" role="group" aria-label="Filter by difficulty">
          {difficulties.map(({ key, label, count }) => (
            <button
              key={key}
              className={`difficulty-chip ${difficulty === key ? 'difficulty-chip-active' : ''}`}
              onClick={() => onDifficultyChange(key)}
              aria-pressed={difficulty === key}
            >
              {label}
              <span className="difficulty-chip-count">{count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
