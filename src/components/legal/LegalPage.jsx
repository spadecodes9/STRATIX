import { TriangleAlert } from 'lucide-react'
import './legal.css'

/**
 * Shared shell for the legal/info pages (Terms, Privacy, Cookies, License,
 * Disclaimer). Keeps every one of these pages visually consistent and
 * makes it obvious, in one place, that the copy is a placeholder pending
 * real legal review — rather than repeating that notice per page.
 */
export default function LegalPage({ eyebrow, title, updated, notice, intro, sections }) {
  return (
    <div className="legal-page">
      <div className="page-shell legal-shell">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {updated && <p className="legal-updated">{updated}</p>}

        {notice && (
          <div className="legal-notice">
            <TriangleAlert size={15} />
            <p>{notice}</p>
          </div>
        )}

        {intro && <p className="legal-intro">{intro}</p>}

        <div className="legal-sections">
          {sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
