import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { courses, categories, difficulties } from '../data/courses.js'
import { useAuth } from '../context/AuthContext.jsx'
import CourseCard from '../components/courses/CourseCard.jsx'
import './Courses.css'

export default function Courses() {
  const { isAuthenticated, user } = useAuth()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || c.category === category
      const matchesDifficulty = difficulty === 'All' || c.difficulty === difficulty
      return matchesQuery && matchesCategory && matchesDifficulty
    })
  }, [query, category, difficulty])

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="page-header-status">
          <span className="status-dot" />
          <span>Catalog status // Online</span>
        </div>
        <span className="eyebrow">Course Catalog</span>
        <h1>Training courses</h1>
        <p>Structured paths across mechanics, utility, strategy, and mindset.</p>
      </div>

      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              className={`filter-pill ${category === c ? 'filter-pill-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-pills">
          {['All', ...difficulties].map((d) => (
            <button
              key={d}
              className={`filter-pill ${difficulty === d ? 'filter-pill-active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No courses match those filters yet — try clearing one.</p>
      ) : (
        <div className="course-grid">
          {filtered.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              progress={isAuthenticated ? user.courseProgress[c.id] || 0 : 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
