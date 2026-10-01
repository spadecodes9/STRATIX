import { ArrowRight, Crosshair, PlayCircle, Sparkles, Timer } from 'lucide-react'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { getCourseById, getLessonById } from '../../data/courses.js'

export default function ContinueLearning({ courseProgress, recommendedNext, recentActivity, weakestSkill }) {
  const inProgressId = Object.entries(courseProgress).find(([, pct]) => pct > 0 && pct < 100)?.[0]
  const activeCourse = inProgressId ? getCourseById(inProgressId) : null
  const activePercent = inProgressId ? courseProgress[inProgressId] : 0
  const recLessonInfo = getLessonById(recommendedNext.courseId, recommendedNext.lessonId)
  const mostRecent = recentActivity[0]

  return (
    <section className="learning-command" aria-label="Next training action">
      <div className="next-action panel-highlight">
        <div className="next-action-topline">
          <span className="eyebrow"><Sparkles size={14} /> Next best action</span>
          {recLessonInfo && <span className="action-duration"><Timer size={14} /> {recLessonInfo.lesson.duration}</span>}
        </div>
        <div className="next-action-content">
          <div>
            <span className="action-index">01 / TODAY'S PLAN</span>
            <h2>{recommendedNext.title}</h2>
            <p>Continue <strong>{recLessonInfo?.course.title || 'your current training path'}</strong> with a focused session that keeps your momentum moving.</p>
          </div>
          {recLessonInfo && <Button to={`/courses/${recLessonInfo.course.id}/lessons/${recLessonInfo.lesson.id}`} variant="primary" icon={ArrowRight} className="next-action-button">Start focused session</Button>}
        </div>
        <div className="action-context">
          <span><Crosshair size={15} /> Priority gap: <strong>{weakestSkill.skill} ({weakestSkill.score})</strong></span>
          {mostRecent && <span>Last signal: {mostRecent.time}</span>}
        </div>
      </div>
      <div className="learning-support-grid">
        <div className="panel course-status">
          <div className="panel-title-row">
            <div><span className="eyebrow">Active campaign</span><h3>Continue Learning</h3></div>
            <PlayCircle size={20} className="panel-icon" />
          </div>
          {activeCourse ? (
            <>
              <p className="continue-course-title">{activeCourse.title}</p>
              <div className="course-progress-label"><span>{activePercent}% complete</span><span>{activeCourse.duration}</span></div>
              <ProgressBar percent={activePercent} />
              <p className="course-connection">Your recommended lesson is part of this course. Complete it to keep the campaign moving.</p>
              <Button to={`/courses/${activeCourse.id}`} variant="secondary" fullWidth>View course progress</Button>
            </>
          ) : <p>No course in progress yet — explore the catalog to start one.</p>}
        </div>
        <div className="panel training-brief">
          <span className="eyebrow">Why this, now</span>
          <h3>Close the loop</h3>
          <p>Use your recent training signal, continue the active course, then apply the session to your lowest-scoring skill.</p>
          <div className="brief-steps"><span><b>01</b> Learn</span><span><b>02</b> Apply</span><span><b>03</b> Review</span></div>
          {mostRecent && <div className="brief-activity"><span>Latest activity</span><strong>{mostRecent.title}</strong></div>}
        </div>
      </div>
    </section>
  )
}
