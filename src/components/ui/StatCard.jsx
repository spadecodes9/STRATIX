import './ui.css'

export default function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="stat-card">
      {Icon && (
        <span className="stat-icon-wrap">
          <Icon className="stat-icon" size={17} strokeWidth={2.2} />
        </span>
      )}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
