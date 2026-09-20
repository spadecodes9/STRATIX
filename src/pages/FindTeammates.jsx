import { Users } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import './FindTeammates.css'

const filterGroups = [
  { label: 'Role', options: ['Duelist', 'Controller', 'Initiator', 'Sentinel'] },
  { label: 'Rank', options: ['Iron – Silver', 'Gold – Platinum', 'Diamond+', 'Any'] },
  { label: 'Region', options: ['NA', 'EU', 'APAC', 'Any'] },
  { label: 'Playstyle', options: ['Aggressive', 'Structured', 'Support-first'] },
  { label: 'Preferred Agents', options: ['Jett', 'Sova', 'Killjoy', '+ more'] },
  { label: 'Availability', options: ['Weekday evenings', 'Weekends', 'Flexible'] },
]

export default function FindTeammates() {
  return (
    <div className="teammates-page">
      <div className="page-shell teammates-shell">
        <span className="eyebrow"><Users size={14} /> 06 // FIND TEAMMATES</span>
        <h1>Find players who<br />train like you do.</h1>
        <p className="teammates-intro">
          Teammate matching is coming to STRATIX — a way to find players by role, rank, region,
          playstyle, and availability instead of scrolling through LFG posts.
        </p>
        <Badge variant="red">In development</Badge>

        <div className="teammates-preview">
          <div className="teammates-preview-ribbon">PREVIEW — not yet functional</div>
          <div className="teammates-filter-grid">
            {filterGroups.map((group) => (
              <div key={group.label} className="teammates-filter">
                <label>{group.label}</label>
                <select disabled defaultValue="">
                  <option value="" disabled>Select {group.label.toLowerCase()}</option>
                  {group.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <Button variant="primary" disabled fullWidth>Find teammates (coming soon)</Button>
        </div>

        <div className="teammates-footer-note">
          <p>This matching system doesn't exist yet — these filters show what's planned. Nothing here searches real players.</p>
          <div className="teammates-footer-actions">
            <Button variant="primary" to="/dashboard">Go to dashboard</Button>
            <Button variant="ghost" to="/guides">Browse guides</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
