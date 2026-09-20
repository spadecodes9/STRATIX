import './ui.css'

export default function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="stat-card">
      {Icon && <Icon className="stat-icon" size={20} strokeWidth={2} />}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
