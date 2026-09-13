import { Crosshair } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found-shell">
      <Crosshair size={40} className="not-found-icon" />
      <span className="eyebrow">404</span>
      <h1>Target lost.</h1>
      <p>The page you're looking for doesn't exist or was moved.</p>
      <Button to="/" variant="primary">Back to base</Button>
    </div>
  )
}
