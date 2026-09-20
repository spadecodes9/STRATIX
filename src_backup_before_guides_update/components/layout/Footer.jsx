import { Crosshair } from 'lucide-react'
import './layout.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Crosshair size={18} strokeWidth={2.2} />
          <span>STRATIX</span>
        </div>
        <p className="footer-note">
          Independent training platform for VALORANT players. Not affiliated with or endorsed by Riot Games.
        </p>
      </div>
    </footer>
  )
}
