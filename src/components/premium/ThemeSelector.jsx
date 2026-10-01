import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from '../../context/ThemeContext.jsx'
import { usePremium } from '../../context/PremiumContext.jsx'
import { PremiumBadge, PremiumLock } from './PremiumGate.jsx'

// Swatch colours only. Which themes a user may pick comes from the
// centralized entitlement rules (canUseTheme), and saving is re-checked on
// the server (POST /api/profile/theme).
const THEME_SWATCHES = [
  { id: 'red', label: 'Red', rgb: '255 59 78' },
  { id: 'blue', label: 'Blue', rgb: '60 140 255' },
  { id: 'green', label: 'Green', rgb: '61 220 132' },
  { id: 'gold', label: 'Gold', rgb: '255 182 72' },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { canUseTheme, canAccess } = usePremium()
  const [lockedAttempt, setLockedAttempt] = useState(null)
  const hasPremiumThemes = canAccess('premium-themes')

  const handleSelect = async (themeId) => {
    if (!canUseTheme(themeId)) {
      setLockedAttempt(themeId)
      return
    }
    setLockedAttempt(null)
    if (!(await setTheme(themeId))) toast.error("Couldn't save your theme. Try again.")
  }

  return (
    <section className="theme-selector-section">
      <div className="panel-title-row">
        <h3>Theme Customization</h3>
        {hasPremiumThemes ? <PremiumBadge>Unlocked</PremiumBadge> : <PremiumBadge />}
      </div>
      <div className="theme-swatch-grid">
        {THEME_SWATCHES.map((t) => {
          const locked = !canUseTheme(t.id)
          return (
            <button
              key={t.id}
              type="button"
              className={'theme-swatch' + (theme === t.id ? ' theme-swatch-selected' : '') + (locked ? ' theme-swatch-locked' : '')}
              style={{ '--swatch-rgb': t.rgb }}
              onClick={() => handleSelect(t.id)}
              aria-pressed={theme === t.id}
              aria-label={`${t.label} theme${locked ? ' (Premium required)' : ''}`}
            >
              <span className="theme-swatch-preview" />
              <span className="theme-swatch-label">
                {t.label}
                {locked && <Lock size={12} aria-hidden="true" />}
              </span>
              {theme === t.id && <Check size={14} className="theme-swatch-check" />}
            </button>
          )
        })}
      </div>

      {lockedAttempt && (
        <div className="theme-locked-wrap">
          <PremiumLock
            title="Premium theme"
            description={`The ${THEME_SWATCHES.find((t) => t.id === lockedAttempt)?.label} theme is part of STRATIX Premium. Red stays free for everyone.`}
          />
        </div>
      )}
    </section>
  )
}
