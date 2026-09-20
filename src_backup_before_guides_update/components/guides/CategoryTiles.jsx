import { LayoutGrid } from 'lucide-react'
import { getCategoryMeta } from './categoryMeta.js'

export default function CategoryTiles({ categories, active, onSelect }) {
  return (
    <div className="category-tiles" role="group" aria-label="Filter guides by category">
      <button
        className={`category-tile ${active === 'All' ? 'category-tile-active' : ''}`}
        onClick={() => onSelect('All')}
        aria-pressed={active === 'All'}
      >
        <span className="category-tile-icon-wrap"><LayoutGrid size={18} /></span>
        <span className="category-tile-text">
          <span className="category-tile-label">All Guides</span>
          <span className="category-tile-desc">Everything in the library.</span>
        </span>
      </button>

      {categories.map(({ category, count }) => {
        const meta = getCategoryMeta(category)
        const Icon = meta.icon
        const isActive = active === category
        return (
          <button
            key={category}
            className={`category-tile ${isActive ? 'category-tile-active' : ''}`}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
          >
            <span className="category-tile-icon-wrap"><Icon size={18} /></span>
            <span className="category-tile-text">
              <span className="category-tile-label">{category}<span className="category-tile-count">{count}</span></span>
              <span className="category-tile-desc">{meta.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
