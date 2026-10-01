import { Percent, Crosshair, Gauge, Target, TrendingUp, Activity, TrendingDown } from 'lucide-react'

function Trend({ value, suffix = '' }) {
  if (value === undefined || value === null) return null
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <span className={'performance-stat-trend' + (positive ? ' is-positive' : ' is-negative')}>
      <Icon size={11} />
      {positive ? '+' : ''}{value}{suffix}
    </span>
  )
}

export default function PerformanceStats({ stats }) {
  const winRate = stats?.winRate ?? 0
  const kd = stats?.kd ?? 0
  const acs = stats?.acs ?? 0
  const headshotPct = stats?.headshotPct ?? 0
  const avgRRChange = stats?.avgRRChange ?? 0
  const recentForm = stats?.recentForm ?? []

  return (
    <div className="panel performance-stats-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Player performance</span><h3>Player Performance</h3></div>
        <Activity size={20} className="panel-icon" />
      </div>

      <div className="performance-stats-grid">
        <div className="performance-stat-card performance-stat-card-primary">
          <Percent size={14} className="performance-stat-icon" />
          <div className="performance-stat-value">{winRate}%</div>
          <div className="performance-stat-label">Win Rate</div>
          <Trend value={stats?.winRateTrend} suffix="%" />
        </div>
        <div className="performance-stat-card">
          <Crosshair size={14} className="performance-stat-icon" />
          <div className="performance-stat-value">{kd.toFixed ? kd.toFixed(2) : kd}</div>
          <div className="performance-stat-label">K/D Ratio</div>
          <Trend value={stats?.kdTrend} />
        </div>
        <div className="performance-stat-card">
          <Gauge size={14} className="performance-stat-icon" />
          <div className="performance-stat-value">{acs}</div>
          <div className="performance-stat-label">Avg. Combat Score</div>
          <Trend value={stats?.acsTrend} />
        </div>
        <div className="performance-stat-card">
          <Target size={14} className="performance-stat-icon" />
          <div className="performance-stat-value">{headshotPct}%</div>
          <div className="performance-stat-label">Headshot %</div>
          <Trend value={stats?.headshotTrend} suffix="%" />
        </div>
        <div className="performance-stat-card">
          <TrendingUp size={14} className="performance-stat-icon" />
          <div className={'performance-stat-value' + (avgRRChange >= 0 ? ' is-positive' : ' is-negative')}>
            {avgRRChange >= 0 ? '+' : ''}{avgRRChange}
          </div>
          <div className="performance-stat-label">Avg. RR Change</div>
          <Trend value={stats?.avgRRChangeTrend} />
        </div>
        <div className="performance-stat-card performance-stat-card-form">
          <Activity size={14} className="performance-stat-icon" />
          <div className="recent-form-row">
            {recentForm.map((result, index) => (
              <span key={index} className={'form-chip ' + (result === 'W' ? 'form-chip-win' : 'form-chip-loss')}>
                {result}
              </span>
            ))}
          </div>
          <div className="performance-stat-label">Recent Form</div>
        </div>
      </div>
    </div>
  )
}
