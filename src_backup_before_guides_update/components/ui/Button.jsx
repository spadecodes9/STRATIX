import { Link } from 'react-router-dom'
import './ui.css'

/**
 * variant: 'primary' | 'secondary' | 'ghost'
 * If `to` is provided, renders as a router Link; otherwise a <button>.
 */
export default function Button({
  children,
  variant = 'primary',
  to,
  onClick,
  type = 'button',
  icon: Icon,
  fullWidth = false,
  disabled = false,
  className = '',
}) {
  const classes = `btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`.trim()

  const content = (
    <>
      {Icon && <Icon size={17} strokeWidth={2} />}
      <span>{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}
