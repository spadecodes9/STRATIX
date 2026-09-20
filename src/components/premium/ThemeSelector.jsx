import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { usePremium } from '../../context/PremiumContext.jsx'
import Button from '../ui/Button.jsx'

const THEMES = [
  { id: 'red', label: 'Red', rgb: '255 59 78' },
  { id: 'blue', label: 'Blue', rgb: '60 140 255' },
  { id: 'green', label: 'Green', rgb: '61 220 132' },
  { id: 'gold', label: 'Gold', rgb: '255 182 72' },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { isPremium } = usePremium()
  const [lockedAttempt, setLockedAttempt] = useState(null)

  const handleSelect = (themeId) => {
    if (themeId !== 'red' && !isPremium) {
      setLockedAttempt(themeId)
      return
    }
    setLockedAttempt(null)
    setTheme(themeId)
  }

  return (
    <section className="theme-selector-section">
      <div className="panel-title-row">
        <h3>Theme Customization</h3>
      </div>
      <div className="theme-swatch-grid">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={'theme-swatch' + (theme === t.id ? ' theme-swatch-selected' : '')}
            style={{ '--swatch-rgb': t.rgb }}
            onClick={() => handleSelect(t.id)}
            aria-pressed={theme === t.id}
            aria-label={`${t.label} theme${t.id !== 'red' && !isPremium ? ' (Premium required)' : ''}`}
          >
            <span className="theme-swatch-preview" />
            <span className="theme-swatch-label">
              {t.label}
              {t.id !== 'red' && !isPremium && <Lock size={12} aria-hidden="true" />}
            </span>
            {theme === t.id && <Check size={14} className="theme-swatch-check" />}
          </button>
        ))}
      </div>

      {lockedAttempt && (
        <div className="theme-locked-panel">
          <span className="theme-locked-icon"><Lock size={16} /></span>
          <div>
            <strong>Premium Theme</strong>
            <p>Unlock exclusive STRATIX themes with Premium.</p>
          </div>
          <Button variant="primary" disabled>
            Upgrade to Premium <span className="coming-soon-badge">Coming soon</span>
          </Button>
        </div>
      )}
    </section>
  )
}
