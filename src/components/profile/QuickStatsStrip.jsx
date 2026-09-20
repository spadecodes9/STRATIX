import { Swords, Target, GraduationCap, Flame, TrendingUp, Star } from 'lucide-react'

export default function QuickStatsStrip({ user }) {
  const xpPercent = user.xpToNextLevel ? Math.round((user.xp / user.xpToNextLevel) * 100) : 0

  const cells = [
    { icon: Swords, label: 'Main Role', value: user.mainRole || '—' },
    { icon: Target, label: 'Preferred Agent', value: user.preferredAgent || '—' },
    { icon: GraduationCap, label: 'Sessions Completed', value: user.stats?.lessonsCompleted ?? 0 },
    { icon: Flame, label: 'Training Streak', value: `${user.stats?.streakDays ?? 0} days` },
    { icon: TrendingUp, label: 'Weaknesses Improved', value: user.stats?.weaknessesImproved ?? 0 },
  ]

  return (
    <div className="quick-stats-strip">
      {cells.map((cell) => (
        <div key={cell.label} className="quick-stat-cell">
          <cell.icon size={15} />
          <div>
            <span>{cell.label}</span>
            <strong>{cell.value}</strong>
          </div>
        </div>
      ))}

      <div className="quick-stat-cell quick-stat-level">
        <Star size={15} />
        <div>
          <span>Account Level</span>
          <strong>{user.level ?? 0}</strong>
          <div className="quick-stat-level-bar">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, xpPercent))}%` }} />
            </div>
            <small>{user.xp?.toLocaleString?.() ?? user.xp} / {user.xpToNextLevel?.toLocaleString?.() ?? user.xpToNextLevel} XP</small>
          </div>
        </div>
      </div>
    </div>
  )
}
