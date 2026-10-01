import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button.jsx'
import QuizOption from './QuizOption.jsx'
import QuizFeedback from './QuizFeedback.jsx'

export default function QuizQuestion({ question, selectedOptionId, isAnswered, isLastQuestion, onSelectOption, onNext }) {
  const selectedOption = question.options.find((option) => option.id === selectedOptionId)
  const isCorrect = selectedOption?.isCorrect === true

  const meta = question.meta ?? {}
  const metaLine = [
    meta.round && `Round ${String(meta.round).padStart(2, '0')}`,
    meta.side,
    meta.teamState,
    meta.economy,
  ].filter(Boolean).join(' · ')

  return (
    <div className="quiz-question">
      <div className="quiz-scenario">
        {metaLine && <div className="quiz-scenario-meta">{metaLine}</div>}
        <h3 className="quiz-scenario-title">{question.scenarioTitle}</h3>
        <p className="quiz-scenario-text">{question.scenario}</p>
      </div>

      <p className="quiz-question-text">{question.question}</p>

      <div className="quiz-options" role="group" aria-label="Answer options">
        {question.options.map((option) => (
          <QuizOption
            key={option.id}
            option={option}
            isSelected={option.id === selectedOptionId}
            isAnswered={isAnswered}
            onSelect={() => onSelectOption(option.id)}
          />
        ))}
      </div>

      {isAnswered && <QuizFeedback isCorrect={isCorrect} explanation={question.explanation} />}

      <div className="quiz-question-footer">
        <Button variant="primary" onClick={onNext} disabled={!isAnswered} icon={ArrowRight}>
          {isLastQuestion ? 'VIEW RESULTS' : 'NEXT QUESTION'}
        </Button>
      </div>
    </div>
  )
}
