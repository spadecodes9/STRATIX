import { Percent, Crosshair, Gauge, Target, Activity, Swords } from 'lucide-react'
import { useRiot } from '../../context/RiotContext.jsx'
import { RiotEmptyState } from '../riot/Riot.jsx'

// Riot-synced only. RR and per-stat trends aren't available from Riot's
// API, so they are not shown rather than estimated.
export default function PerformanceStats() {
  const { playerData } = useRiot()
  const stats = playerData?.stats
  const recentForm = (playerData?.recentMatches ?? []).slice(0, 5).map((m) => m.result)

  return (
    <div className="panel performance-stats-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">{stats ? `Synced from Riot · last ${stats.matches} matches` : 'Player performance'}</span>
          <h3>Player Performance</h3>
        </div>
        <Activity size={20} className="panel-icon" />
      </div>

      {!stats ? <RiotEmptyState /> : (
        <div className="performance-stats-grid">
          <Stat icon={Percent} value={`${stats.winRate}%`} label="Win Rate" primary />
          <Stat icon={Crosshair} value={stats.kd.toFixed(2)} label="K/D Ratio" />
          <Stat icon={Gauge} value={stats.acs ?? '—'} label="Avg. Combat Score" />
          <Stat icon={Target} value={stats.headshotPct != null ? `${stats.headshotPct}%` : '—'} label="Headshot %" />
          <Stat icon={Swords} value={playerData.mostPlayedAgent ?? '—'} label="Most Played Agent" />
          <div className="performance-stat-card performance-stat-card-form">
            <Activity size={14} className="performance-stat-icon" />
            <div className="recent-form-row">
              {recentForm.map((result, index) => (
                <span key={index} className={'form-chip ' + (result === 'win' ? 'form-chip-win' : 'form-chip-loss')}>
                  {result === 'win' ? 'W' : result === 'loss' ? 'L' : 'D'}
                </span>
              ))}
            </div>
            <div className="performance-stat-label">Recent Form</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ icon: Icon, value, label, primary }) {
  return (
    <div className={'performance-stat-card' + (primary ? ' performance-stat-card-primary' : '')}>
      <Icon size={14} className="performance-stat-icon" />
      <div className="performance-stat-value">{value}</div>
      <div className="performance-stat-label">{label}</div>
    </div>
  )
}
