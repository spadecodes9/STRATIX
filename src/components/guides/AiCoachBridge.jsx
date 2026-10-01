import { Bot, ArrowRight } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function AiCoachBridge({ label = 'Stuck on this?', prompt = 'Ask AI Coach' }) {
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
