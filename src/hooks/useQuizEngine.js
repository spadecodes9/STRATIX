import { useCallback, useState } from 'react'

const initialState = {
  currentIndex: 0,
  selectedOptionId: null,
  isAnswered: false,
  score: 0,
  isComplete: false,
}

// Generic quiz state machine — works against any quiz data object shaped
// like the ones in src/data/quizzes.js. Holds no knowledge of Game-Sense
// specifically, so the same hook drives every future quiz type.
export default function useQuizEngine(quiz) {
  const [state, setState] = useState(initialState)
  const { currentIndex, selectedOptionId, isAnswered, score, isComplete } = state

  const totalQuestions = quiz.questions.length
  const currentQuestion = quiz.questions[currentIndex]
  const isLastQuestion = currentIndex === totalQuestions - 1

  const selectOption = useCallback((optionId) => {
    setState((prev) => {
      if (prev.isAnswered) return prev
      const question = quiz.questions[prev.currentIndex]
      const isCorrect = question.options.find((option) => option.id === optionId)?.isCorrect === true
      return { ...prev, selectedOptionId: optionId, isAnswered: true, score: prev.score + (isCorrect ? 1 : 0) }
    })
  }, [quiz])

  const goNext = useCallback(() => {
    setState((prev) => {
      if (!prev.isAnswered) return prev
      const nextIndex = prev.currentIndex + 1
      if (nextIndex >= quiz.questions.length) return { ...prev, isComplete: true }
      return { ...prev, currentIndex: nextIndex, selectedOptionId: null, isAnswered: false }
    })
  }, [quiz])

  const retake = useCallback(() => setState(initialState), [])

  return {
    currentIndex,
    currentQuestion,
    totalQuestions,
    selectedOptionId,
    isAnswered,
    isComplete,
    isLastQuestion,
    score,
    selectOption,
    goNext,
    retake,
  }
}
