import { RotateCcw } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function QuizResults({ quiz, score, total, onRetake, onClose }) {
  const wrong = total - score
  const percent = Math.round((score / total) * 100)
  const tier = quiz.resultTiers.find((t) => percent >= t.min) ?? quiz.resultTiers[quiz.resultTiers.length - 1]

  return (
    <div className="quiz-results">
      <span className="eyebrow">{quiz.title.toUpperCase()}</span>
      <div className="quiz-results-score">{score} / {total}</div>
      <div className="quiz-results-percent">{percent}%</div>

      <div className="quiz-results-breakdown">
        <div className="quiz-results-breakdown-row">
          <span>CORRECT</span>
          <span>{score}</span>
        </div>
        <div className="quiz-results-breakdown-row">
          <span>WRONG</span>
          <span>{wrong}</span>
        </div>
      </div>

      <p className="quiz-results-message">{tier.message}</p>

      <div className="quiz-results-actions">
        <Button variant="primary" icon={RotateCcw} onClick={onRetake}>Retake Quiz</Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
