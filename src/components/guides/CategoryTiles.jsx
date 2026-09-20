import { LayoutGrid } from 'lucide-react'
import { getCategoryMeta } from './categoryMeta.js'

export default function CategoryTiles({ categories, active, onSelect }) {
  return (
    <div className="category-chip-row" role="group" aria-label="Filter guides by category">
      <button
        className={`category-chip ${active === 'All' ? 'category-chip-active' : ''}`}
        onClick={() => onSelect('All')}
        aria-pressed={active === 'All'}
      >
        <LayoutGrid size={15} />
        <span>All</span>
      </button>

      {categories.map(({ category, count }) => {
        const meta = getCategoryMeta(category)
        const Icon = meta.icon
        const isActive = active === category
        return (
          <button
            key={category}
            className={`category-chip ${isActive ? 'category-chip-active' : ''}`}
            onClick={() => onSelect(category)}
            aria-pressed={isActive}
            title={meta.description}
          >
            <Icon size={15} />
            <span>{category}</span>
            <span className="category-chip-count">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
