import './ui.css'

export default function Badge({ children, variant = 'default' }) {
  const cls = variant === 'default' ? 'badge' : `badge badge-${variant}`
  return <span className={cls}>{children}</span>
}
