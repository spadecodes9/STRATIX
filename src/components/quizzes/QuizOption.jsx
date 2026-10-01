import { Check, X } from 'lucide-react'

export default function QuizOption({ option, isSelected, isAnswered, onSelect }) {
  let stateClass = ''
  if (isAnswered) {
    if (option.isCorrect) stateClass = 'is-correct'
    else if (isSelected) stateClass = 'is-wrong'
    else stateClass = 'is-inactive'
  }

  const showCheck = isAnswered && option.isCorrect
  const showX = isAnswered && isSelected && !option.isCorrect

  return (
    <button
      type="button"
      className={`quiz-option ${stateClass}`.trim()}
      onClick={onSelect}
      disabled={isAnswered}
    >
      <span className="quiz-option-text">{option.text}</span>
      <span className="quiz-option-icon" aria-hidden={!showCheck && !showX}>
        {showCheck && <Check size={18} aria-hidden="true" />}
        {showX && <X size={18} aria-hidden="true" />}
        {showCheck && <span className="sr-only">Correct answer</span>}
        {showX && <span className="sr-only">Your answer — incorrect</span>}
      </span>
    </button>
  )
}
