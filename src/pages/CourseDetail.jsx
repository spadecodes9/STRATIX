import { useMemo } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Clock, User, Layers, ArrowRight } from 'lucide-react'
import { getCourseById, getAllLessonsFlat } from '../data/courses.js'
import { useAuth } from '../context/AuthContext.jsx'
import ModuleList from '../components/courses/ModuleList.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Button from '../components/ui/Button.jsx'
import './Courses.css'

export default function CourseDetail() {
  const { courseId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const course = getCourseById(courseId)

  const flatLessons = useMemo(() => (course ? getAllLessonsFlat(course) : []), [course])
  const progress = isAuthenticated ? user.courseProgress[courseId] || 0 : 0

  const completedLessonIds = useMemo(() => {
    if (!course) return new Set()
    const completedCount = Math.round((progress / 100) * flatLessons.length)
    return new Set(flatLessons.slice(0, completedCount).map((l) => l.id))
  }, [course, flatLessons, progress])

  const nextLesson = flatLessons.find((l) => !completedLessonIds.has(l.id)) || flatLessons[0]

  if (!course) return <Navigate to="/courses" replace />

  return (
    <div className="page-shell">
      <div className="course-detail-header">
        <div>
          <span className="eyebrow">{course.category} · {course.difficulty}</span>
          <h1>{course.title}</h1>
          <p className="course-detail-tagline">{course.tagline}</p>
          <div className="course-detail-meta">
            <span><Clock size={14} /> {course.duration}</span>
            <span><User size={14} /> {course.instructor}</span>
            <span><Layers size={14} /> {course.modules.length} modules · {flatLessons.length} lessons</span>
          </div>
        </div>

        <div className="course-detail-action-panel">
          {progress > 0 && (
            <>
              <ProgressBar percent={progress} />
              <span className="course-detail-progress-label">{progress}% complete</span>
            </>
          )}
          <Button
            to={`/courses/${course.id}/lessons/${nextLesson.id}`}
            variant="primary"
            fullWidth
            icon={ArrowRight}
          >
            {progress > 0 ? 'Resume Course' : 'Start Course'}
          </Button>
        </div>
      </div>

      <ModuleList course={course} completedLessonIds={completedLessonIds} />

      <Link to="/courses" className="back-link">← Back to all courses</Link>
    </div>
  )
}
