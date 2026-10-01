import { Target, Crosshair, Users } from 'lucide-react'
import Badge from '../ui/Badge.jsx'

const PREMIUM_QUIZZES = [
  { icon: Target, title: 'Aim Mechanics Quiz', text: 'Test your understanding of sensitivity, tracking, and flicking fundamentals.' },
  { icon: Crosshair, title: 'Crosshair Knowledge Quiz', text: 'Placement, color theory, and sizing for consistent first shots.' },
  { icon: Users, title: 'Agent Knowledge Quiz', text: 'Kit details and matchup awareness, agent by agent.' },
]

export default function PremiumQuizzes() {
  return (
    <section className="premium-quizzes-section">
      <div className="panel-title-row">
        <h3>Premium Quizzes</h3>
        <Badge variant="default">Coming soon</Badge>
      </div>
      <div className="premium-quizzes-grid">
        {PREMIUM_QUIZZES.map((quiz) => {
          const Icon = quiz.icon
          return (
            <div key={quiz.title} className="premium-quiz-card">
              <Icon size={18} />
              <strong>{quiz.title}</strong>
              <p>{quiz.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
