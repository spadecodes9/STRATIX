import { CheckCircle2, XCircle } from 'lucide-react'

export default function QuizFeedback({ isCorrect, explanation }) {
  return (
    <div className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`} role="status">
      <div className="quiz-feedback-label">
        {isCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
        <span>{isCorrect ? 'CORRECT' : 'NOT QUITE'}</span>
      </div>
      <span className="quiz-feedback-why">Why</span>
      <p className="quiz-feedback-explanation">{explanation}</p>
    </div>
  )
}
