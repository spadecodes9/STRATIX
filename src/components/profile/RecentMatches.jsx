import { Swords } from 'lucide-react'
import { useRiot } from '../../context/RiotContext.jsx'
import { RiotEmptyState } from '../riot/Riot.jsx'

const RESULT_LABEL = { win: 'WIN', loss: 'LOSS', draw: 'DRAW', unknown: '—' }

function timeAgo(iso) {
  if (!iso) return '—'
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / 36e5)
  return hours < 24 ? `${Math.max(hours, 1)}h` : `${Math.round(hours / 24)}d`
}

// Riot-synced match history only — no RR column, Riot's API doesn't expose it.
export default function RecentMatches() {
  const { playerData } = useRiot()
  const list = playerData?.recentMatches ?? []

  return (
    <div className="panel recent-matches-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">{list.length ? 'Synced from Riot' : 'Match history'}</span><h3>Recent Matches</h3></div>
        <Swords size={20} className="panel-icon" />
      </div>

      {list.length === 0 ? <RiotEmptyState /> : (
        <div className="match-table">
          <div className="match-row match-row-head">
            <span>Map</span>
            <span>Result</span>
            <span>K / D / A</span>
            <span>ACS</span>
            <span>Agent</span>
            <span>Date</span>
          </div>

          {list.map((match) => (
            <div key={match.id} className={'match-row match-row-' + match.result}>
              <span className="match-row-map">{match.map}</span>
              <span className={'match-result-tag match-result-' + match.result}>{RESULT_LABEL[match.result] ?? '—'}</span>
              <span className="match-row-kda">{match.kills}/{match.deaths}/{match.assists}</span>
              <span className="match-row-acs">{match.acs ?? '—'}</span>
              <span className="match-row-rr">{match.agent ?? '—'}</span>
              <span className="match-row-date">{timeAgo(match.startedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
