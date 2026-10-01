import ProgressBar from '../ui/ProgressBar.jsx'

export default function QuizProgress({ current, total }) {
  return (
    <div className="quiz-progress">
      <span className="quiz-progress-count">
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <ProgressBar percent={(current / total) * 100} />
    </div>
  )
}
