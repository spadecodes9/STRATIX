import { PlayCircle, ArrowRight, Sparkles } from 'lucide-react'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { getCourseById, getLessonById } from '../../data/courses.js'

export default function ContinueLearning({ courseProgress, recommendedNext }) {
  const inProgressId = Object.entries(courseProgress).find(([, pct]) => pct > 0 && pct < 100)?.[0]
  const activeCourse = inProgressId ? getCourseById(inProgressId) : null
  const activePercent = inProgressId ? courseProgress[inProgressId] : 0

  const recLessonInfo = getLessonById(recommendedNext.courseId, recommendedNext.lessonId)

  return (
    <div className="two-col-panels">
      <div className="panel">
        <div className="panel-title-row">
          <h3>Continue Learning</h3>
          <PlayCircle size={18} className="panel-icon" />
        </div>
        {activeCourse ? (
          <>
            <p className="continue-course-title">{activeCourse.title}</p>
            <ProgressBar percent={activePercent} />
            <div className="continue-course-meta">
              <span>{activePercent}% complete</span>
              <span>{activeCourse.duration}</span>
            </div>
            <Button to={`/courses/${activeCourse.id}`} variant="secondary" fullWidth>
              Resume Course
            </Button>
          </>
        ) : (
          <p>No course in progress yet — explore the catalog to start one.</p>
        )}
      </div>

      <div className="panel panel-highlight">
        <div className="panel-highlight-scanline" aria-hidden="true" />
        <div className="panel-title-row">
          <h3>Recommended Next Lesson</h3>
          <Sparkles size={18} className="panel-icon" />
        </div>
        <p className="continue-course-title">{recommendedNext.title}</p>
        <p className="rec-reason">{recommendedNext.reason}</p>
        {recLessonInfo && (
          <Button
            to={`/courses/${recLessonInfo.course.id}/lessons/${recLessonInfo.lesson.id}`}
            variant="primary"
            fullWidth
            icon={ArrowRight}
          >
            Start Lesson
          </Button>
        )}
      </div>
    </div>
  )
}
