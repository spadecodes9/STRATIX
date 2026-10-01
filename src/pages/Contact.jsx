import { Mail, MessageSquare, Radio } from 'lucide-react'
import { DISCORD_INVITE_URL, SUPPORT_EMAIL } from '../data/contact.js'
import './Contact.css'

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="page-shell contact-shell">
        <span className="eyebrow">Support // Contact</span>
        <h1>Help &amp; support.</h1>
        <p className="contact-intro">
          STRATIX's dedicated support channels are still being set up. In the meantime, here's where
          to reach out.
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <Mail size={18} />
            <span className="contact-card-label">Email support</span>
            {/* TODO: Replace placeholder support email with official STRATIX help email. */}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="contact-card-value">{SUPPORT_EMAIL}</a>
            <p>Placeholder address — not monitored yet.</p>
          </div>

          <div className="contact-card">
            <MessageSquare size={18} />
            <span className="contact-card-label">Discord</span>
            {/* TODO: Replace with the real STRATIX Discord invite URL once the server exists. */}
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer" className="contact-card-value">
              discord.gg/STRATIX
            </a>
            <p>Placeholder invite — the server doesn't exist yet.</p>
          </div>

          <div className="contact-card contact-card-muted">
            <Radio size={18} />
            <span className="contact-card-label">More channels soon</span>
            <span className="contact-card-value contact-card-value-muted">In-app support · Status page</span>
            <p>Planned for a future release.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
