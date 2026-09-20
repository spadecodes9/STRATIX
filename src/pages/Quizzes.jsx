import { BrainCircuit, Crosshair, ListChecks, Map, Radar, Target } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import './Quizzes.css'

const quizCategories = [
  { icon: Target, label: 'Skill Quiz', text: 'Test your fundamentals across aim, positioning, and utility.' },
  { icon: Map, label: 'Map Quiz', text: 'Callouts, angles, and setups for every active map.' },
  { icon: Crosshair, label: 'Agent Quiz', text: 'Kit knowledge and matchup awareness, agent by agent.' },
  { icon: BrainCircuit, label: 'Game-Sense Quiz', text: 'Read scenarios and pick the decision that wins the round.' },
  { icon: ListChecks, label: 'Training Assessment', text: 'A longer check-in that maps to your skill matrix.' },
]

export default function Quizzes() {
  return (
    <div className="quizzes-page">
      <div className="page-shell quizzes-shell">
        <span className="eyebrow"><Radar size={14} /> 04 // QUIZZES</span>
        <h1>Test what you<br />actually know.</h1>
        <p className="quizzes-intro">
          Short, focused quizzes across skills, maps, agents, and game sense — built to check what's
          actually sticking from your training, not just how much content you've clicked through.
        </p>
        <Badge variant="red">In development</Badge>

        <div className="quiz-category-grid">
          {quizCategories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.label} className="quiz-category-card">
                <Icon size={20} />
                <strong>{category.label}</strong>
                <p>{category.text}</p>
                <span className="quiz-category-status">Coming soon</span>
              </div>
            )
          })}
        </div>

        <div className="quizzes-footer-note">
          <p>Quizzes are still in active development and aren't live yet. In the meantime, Guides cover the same ground.</p>
          <div className="quizzes-footer-actions">
            <Button variant="primary" to="/guides">Browse guides</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
