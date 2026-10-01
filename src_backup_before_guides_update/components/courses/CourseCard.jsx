import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'

export default function CourseCard({ course, progress }) {
  return (
    <Link to={`/courses/${course.id}`} className="course-card">
      <div className="course-card-top">
        <Badge variant="red">{course.category}</Badge>
        <Badge>{course.difficulty}</Badge>
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
