import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { getCourseCategoryMeta } from '../../data/courseCategoryMeta.js'

const TIER_BY_DIFFICULTY = { Beginner: 1, Intermediate: 2, Advanced: 3 }

export default function CourseCard({ course, progress }) {
  const meta = getCourseCategoryMeta(course.category)
  const WatermarkIcon = meta.icon
  const tier = TIER_BY_DIFFICULTY[course.difficulty] || 1

  return (
    <Link to={`/courses/${course.id}`} className="course-card">
      <WatermarkIcon size={90} strokeWidth={1} className="card-watermark course-card-watermark" />
      <div className="course-card-top">
        <Badge variant="red">{course.category}</Badge>
        <span className="course-card-difficulty" aria-label={`Difficulty: ${course.difficulty}`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`tier-bar ${n <= tier ? 'tier-bar-filled' : ''}`} />
          ))}
          {course.difficulty}
        </span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.tagline}</p>
      <div className="course-card-meta">
        <span><Clock size={13} /> {course.duration}</span>
        <span>{course.modules.length} modules</span>
      </div>
      {progress > 0 && (
        <div className="course-card-progress">
          <ProgressBar percent={progress} />
          <span>{progress}% complete</span>
        </div>
      )}
      <span className="course-card-cta">View course <ArrowRight size={14} /></span>
    </Link>
  )
}
