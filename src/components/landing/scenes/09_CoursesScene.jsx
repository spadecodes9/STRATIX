import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, Play, CheckCircle, BookOpen } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

const COURSE_TRACKS = [
  {
    id: 'aim-fundamentals',
    num: '01',
    title: 'Aim Fundamentals',
    category: 'Mechanics',
    duration: '3h 20m',
    progressPct: 100,
    status: 'COMPLETED',
    tagline: 'Crosshair placement, angle slicing, and sub-frame recoil reset.',
  },
  {
    id: 'advanced-utility-usage',
    num: '02',
    title: 'Advanced Utility Usage',
    category: 'Utility',
    duration: '4h 05m',
    progressPct: 60,
    status: 'IN PROGRESS',
    tagline: 'High-leverage smokes, flash pop timings, and site execute setups.',
  },
  {
    id: 'map-control-mastery',
    num: '03',
    title: 'Map Control Mastery',
    category: 'Strategy',
    duration: '5h 15m',
    progressPct: 25,
    status: 'UNLOCKED',
    tagline: 'Macro rotation reads, default spacing, and defensive retake anchors.',
  },
]

export default function CoursesScene({ progress, isVisible }) {
  const cascadeShift = (idx) => {
    const delay = idx * 0.15
    const p = Math.min(Math.max((progress - delay) / 0.5, 0), 1)
    return {
      transform: `translateY(${(1 - p) * 30}px) scale(${0.92 + p * 0.08})`,
      opacity: Math.min(1, 0.3 + p * 0.8),
    }
  }

  return (
    <div className="scene-container courses-scene">
      <CinematicHUDOverlay
        sceneNumber="09"
        sector="CURRICULUM // PROGRESSION TRACK"
        systemStatus="COURSE MATRIX ONLINE"
        progress={progress}
      />

      {/* Course Cards Cascading Track */}
      <div className="courses-cascade-container">
        {COURSE_TRACKS.map((course, idx) => (
          <div
            key={course.id}
            className={`course-cinematic-card ${course.status === 'IN PROGRESS' ? 'card-active-highlight' : ''}`}
            style={cascadeShift(idx)}
          >
            <div className="card-top-meta">
              <span className="course-num-badge">COURSE {course.num}</span>
              <span className={`course-status-pill ${course.status === 'COMPLETED' ? 'status-pill-green' : course.status === 'IN PROGRESS' ? 'status-pill-red' : ''}`}>
                {course.status}
              </span>
            </div>

            <h3 className="course-card-heading">{course.title}</h3>
            <p className="course-card-sub">{course.tagline}</p>

            <div className="course-progress-block">
              <div className="progress-info-row">
                <span className="progress-label">PROGRESS</span>
                <span className="progress-value">{course.progressPct}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress * course.progressPct}%` }}
                />
              </div>
            </div>

            <div className="course-card-action">
              <Link to={`/courses/${course.id}`} className="course-link-btn">
                <span>{course.status === 'COMPLETED' ? 'Review Course' : 'Continue Course'}</span>
                <ArrowRight size={14} />
              </Link>
              <span className="course-duration-text">{course.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content courses-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">07 // STRUCTURED COURSES</span>
        </div>

        <h2 className="scene-title-xl">
          STRUCTURE <br />
          <span className="text-glow-red">THE CLIMB.</span>
        </h2>

        <p className="scene-desc-md">
          A comprehensive training syllabus designed by Radiant coaches and tier-1 analysts.
          Every module is sequenced so each new mechanic builds directly on the last.
        </p>

        <div className="courses-cta-row">
          <Button variant="primary" to="/courses" icon={GraduationCap}>
            Browse All Courses
          </Button>
        </div>
      </div>
    </div>
  )
}
