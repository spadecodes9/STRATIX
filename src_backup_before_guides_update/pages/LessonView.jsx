import { useMemo } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { Video, FileText, Dumbbell, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { getCourseById, getLessonById, getAllLessonsFlat } from '../data/courses.js'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import './Courses.css'

const iconByType = { video: Video, reading: FileText, drill: Dumbbell }
const bodyByType = {
  video: 'This is a mock lesson video placeholder. In the full product, a real video player and transcript render here.',
  reading: 'This is a mock reading lesson. In the full product, formatted lesson text, diagrams, and callouts render here.',
  drill: 'This is a mock drill lesson. In the full product, step-by-step aim-trainer or in-game drill instructions render here.',
}

export default function LessonView() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const course = getCourseById(courseId)
  const found = course ? getLessonById(courseId, lessonId) : null

  const flatLessons = useMemo(() => (course ? getAllLessonsFlat(course) : []), [course])
  const currentIndex = flatLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null

  if (!course || !found) return <Navigate to="/courses" replace />

  const { lesson, module } = found
  const Icon = iconByType[lesson.type] || Video

  const handleComplete = () => {
    toast.success('Lesson marked complete')
    if (nextLesson) {
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
    } else {
      navigate(`/courses/${courseId}`)
    }
  }

  return (
    <div className="page-shell lesson-shell">
      <Link to={`/courses/${courseId}`} className="back-link">← {course.title}</Link>

      <div className="lesson-header">
        <span className="eyebrow">{module.title}</span>
        <h1>{lesson.title}</h1>
        <div className="lesson-header-meta">
          <Badge><Icon size={13} /> {lesson.type}</Badge>
          <span>{lesson.duration}</span>
        </div>
      </div>

      <div className="lesson-content-panel">
        <div className="lesson-placeholder">
          <Icon size={36} strokeWidth={1.5} />
        </div>
        <p>{bodyByType[lesson.type]}</p>
      </div>

      <div className="lesson-nav-row">
        <Button
          variant="secondary"
          icon={ChevronLeft}
          disabled={!prevLesson}
          onClick={() => prevLesson && navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
        >
          Previous
        </Button>
        <Button variant="primary" icon={CheckCircle2} onClick={handleComplete}>
          Mark Complete & Continue
        </Button>
        <Button
          variant="secondary"
          icon={ChevronRight}
          disabled={!nextLesson}
          onClick={() => nextLesson && navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
