import { ArrowRight, Lock } from 'lucide-react'
import './quizzes.css'

function CardBody({ category, numberLabel }) {
  const Icon = category.icon
  return (
    <>
      <span className="quiz-category-corner" aria-hidden="true" />
      <div className="quiz-category-head">
        <span className="quiz-category-number">{numberLabel}</span>
        <span className="quiz-category-icon"><Icon size={18} /></span>
      </div>
      <span className="quiz-category-track">Track {numberLabel}</span>
      <strong>{category.label}</strong>
      {category.tagline && <span className="quiz-category-tagline">{category.tagline}</span>}
      <p>{category.description}</p>
      {category.focus && (
        <ul className="quiz-category-focus" aria-label="Focus areas">
          {category.focus.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      <span className="quiz-category-indicator" aria-hidden="true" />
    </>
  )
}

export default function QuizCard({ category, number, onPlay }) {
  const numberLabel = String(number).padStart(2, '0')

  if (category.status !== 'available') {
    return (
      <article className="quiz-category-card">
        <CardBody category={category} numberLabel={numberLabel} />
        <div className="quiz-category-foot">
          <span className="quiz-category-status">
            <Lock size={12} aria-hidden="true" /> Coming soon
          </span>
        </div>
      </article>
    )
  }

  const count = String(category.quiz.questions.length).padStart(2, '0')

  // The Play button stretches over the whole card (see .quiz-category-cta::after),
  // so the full card stays clickable without nesting block content in a <button>.
  return (
    <article className="quiz-category-card quiz-category-card-available">
      <CardBody category={category} numberLabel={numberLabel} />
      <div className="quiz-category-foot">
        <span className="quiz-category-scenario-count"><b>{count}</b> Scenarios</span>
        <button type="button" className="quiz-category-cta" onClick={onPlay} aria-label={`Play ${category.label} quiz`}>
          Play Quiz <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
