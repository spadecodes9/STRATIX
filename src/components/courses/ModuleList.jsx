import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Video, FileText, Dumbbell } from 'lucide-react'

const iconByType = { video: Video, reading: FileText, drill: Dumbbell }

export default function ModuleList({ course, completedLessonIds }) {
  return (
    <div className="module-list">
      {course.modules.map((mod, modIndex) => (
        <div key={mod.id} className="module-block">
          <h3 className="module-title">
            <span className="module-index">{String(modIndex + 1).padStart(2, '0')}</span>
            {mod.title}
          </h3>
          <ul className="lesson-list">
            {mod.lessons.map((lesson) => {
              const Icon = iconByType[lesson.type] || Video
              const isComplete = completedLessonIds.has(lesson.id)
              return (
                <li key={lesson.id}>
                  <Link to={`/courses/${course.id}/lessons/${lesson.id}`} className="lesson-row">
                    {isComplete ? (
                      <CheckCircle2 size={18} className="lesson-check lesson-check-done" />
                    ) : (
                      <Circle size={18} className="lesson-check" />
                    )}
                    <Icon size={15} className="lesson-type-icon" />
                    <span className="lesson-row-title">{lesson.title}</span>
                    <span className="lesson-row-duration">{lesson.duration}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
