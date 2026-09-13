import { BookOpen, HelpCircle, Bot, ArrowRight, ArrowDown } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function AiCoachBridge({
  label = 'Stuck on this?',
  prompt = 'Ask AI Coach',
  variant = 'compact',
}) {
  if (variant === 'panel') {
    return (
      <div className="coach-bridge-panel">
        <div className="coach-bridge-status">
          <span className="status-dot" />
          <span>AI Coach // Ready</span>
        </div>

        <div className="coach-bridge-flow">
          <div className="coach-bridge-node">
            <BookOpen size={18} />
            <span>Read Guide</span>
          </div>
          <ArrowDown className="coach-bridge-connector" size={16} />
          <div className="coach-bridge-node">
            <HelpCircle size={18} />
            <span>Have a Question?</span>
          </div>
          <ArrowDown className="coach-bridge-connector" size={16} />
          <div className="coach-bridge-node coach-bridge-node-active">
            <Bot size={18} />
            <span>Ask STRATIX AI Coach</span>
          </div>
        </div>

        <p className="coach-bridge-copy">
          Guides tell you what to do. The AI Coach connects it to your own skill matrix and progress —
          ask it how any guide applies to your last session.
        </p>

        <Button to="/ai-coach" variant="primary" icon={ArrowRight}>
          Ask AI Coach
        </Button>
      </div>
    )
  }

  return (
    <div className="ai-coach-bridge">
      <div className="ai-coach-bridge-text">
        <Bot size={18} />
        <span>{label}</span>
      </div>
      <Button to="/ai-coach" variant="secondary" icon={ArrowRight}>
        {prompt}
      </Button>
    </div>
  )
}
