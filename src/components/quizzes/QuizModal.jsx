import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import useQuizEngine from '../../hooks/useQuizEngine.js'
import QuizProgress from './QuizProgress.jsx'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResults from './QuizResults.jsx'
import './quizzes.css'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function QuizModal({ quiz, isOpen, onClose }) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const panelRef = useRef(null)
  const previouslyFocused = useRef(null)
  const engine = useQuizEngine(quiz)

  // Fresh state every time the quiz is opened — no stale answer from a
  // previous attempt, whether it was closed mid-quiz or fully completed.
  const { retake } = engine
  useEffect(() => {
    if (isOpen) retake()
  }, [isOpen, retake])

  useEffect(() => {
    if (isOpen) {
      // Guarded so React 18 StrictMode's dev-only double-invoke of this
      // effect can't overwrite the ref with the modal's own panel (which
      // has already stolen focus by the second invocation).
      if (!previouslyFocused.current) previouslyFocused.current = document.activeElement
      setIsRendered(true)
      setIsClosing(false)
      return
    }

    if (!isRendered) return

    if (prefersReducedMotion()) {
      setIsRendered(false)
      previouslyFocused.current?.focus?.()
      previouslyFocused.current = null
    } else {
      setIsClosing(true)
    }
  }, [isOpen, isRendered])

  useEffect(() => {
    if (!isRendered) return

    panelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isRendered, onClose])

  const handlePanelAnimationEnd = () => {
    if (!isClosing) return
    setIsClosing(false)
    setIsRendered(false)
    previouslyFocused.current?.focus?.()
    previouslyFocused.current = null
  }

  if (!isRendered) return null

  return (
    <div className={'quiz-modal-overlay' + (isClosing ? ' is-closing' : '')} onClick={onClose}>
      <div
        ref={panelRef}
        className="quiz-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={handlePanelAnimationEnd}
      >
        <header className="quiz-modal-header">
          <span id="quiz-modal-title" className="eyebrow quiz-modal-eyebrow">{quiz.title.toUpperCase()}</span>
          <button type="button" className="quiz-modal-close" onClick={onClose} aria-label="Close quiz">
            <X size={18} />
          </button>
        </header>

        {!engine.isComplete && (
          <QuizProgress current={engine.currentIndex + 1} total={engine.totalQuestions} />
        )}

        <div className="quiz-modal-body">
          {engine.isComplete ? (
            <QuizResults
              quiz={quiz}
              score={engine.score}
              total={engine.totalQuestions}
              onRetake={engine.retake}
              onClose={onClose}
            />
          ) : (
            <QuizQuestion
              key={engine.currentQuestion.id}
              question={engine.currentQuestion}
              selectedOptionId={engine.selectedOptionId}
              isAnswered={engine.isAnswered}
              isLastQuestion={engine.isLastQuestion}
              onSelectOption={engine.selectOption}
              onNext={engine.goNext}
            />
          )}
        </div>
      </div>
    </div>
  )
}
