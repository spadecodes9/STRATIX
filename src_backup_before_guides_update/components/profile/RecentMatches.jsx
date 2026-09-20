import { Swords } from 'lucide-react'

export default function RecentMatches({ matches }) {
  const list = matches ?? []

  return (
    <div className="panel recent-matches-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Match history</span><h3>Recent Matches</h3></div>
        <Swords size={20} className="panel-icon" />
      </div>

      <div className="match-table">
        <div className="match-row match-row-head">
          <span>Map</span>
          <span>Result</span>
          <span>K / D / A</span>
          <span>ACS</span>
          <span>RR</span>
          <span>Date</span>
        </div>

        {list.map((match) => (
          <div key={match.id} className={'match-row match-row-' + match.result}>
            <span className="match-row-map">{match.map}</span>
            <span className={'match-result-tag match-result-' + match.result}>
              {match.result === 'win' ? 'WIN' : 'LOSS'}
            </span>
            <span className="match-row-kda">{match.kills}/{match.deaths}/{match.assists}</span>
            <span className="match-row-acs">{match.acs}</span>
            <span className={'match-row-rr ' + (match.rrChange >= 0 ? 'is-positive' : 'is-negative')}>
              {match.rrChange >= 0 ? '+' : ''}{match.rrChange}
            </span>
            <span className="match-row-date">{match.time || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
