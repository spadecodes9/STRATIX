// Every accent colour here is a CSS variable (see .gh-* rules in Guides.css)
// so the radar follows the Premium theme (data-theme on <html>) live —
// SVG presentation attributes can't resolve var(), so colours live in CSS.
export default function GuidesHeroVisual({ guideCount, categoryCount }) {
  // Fixed angles for category "blips" around the radar — purely decorative.
  const blipAngles = [20, 95, 160, 210, 280]

  return (
    <svg viewBox="0 0 420 420" className="guides-hero-visual-svg" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="guidesGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="gh-stop" style={{ stopOpacity: 0.2 }} />
          <stop offset="100%" className="gh-stop" style={{ stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="sweepGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className="gh-stop" style={{ stopOpacity: 0.35 }} />
          <stop offset="100%" className="gh-stop" style={{ stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      <circle cx="210" cy="210" r="200" fill="url(#guidesGlow)" />

      <circle cx="210" cy="210" r="170" className="gh-ring" />
      <circle cx="210" cy="210" r="130" className="gh-ring" strokeDasharray="3 7" />
      <circle cx="210" cy="210" r="90" className="gh-ring" />

      {/* Crosshair hairlines + cardinal ticks */}
      <g className="gh-crosshair">
        <line x1="210" y1="46" x2="210" y2="374" />
        <line x1="46" y1="210" x2="374" y2="210" />
      </g>
      <g className="gh-ticks">
        <line x1="210" y1="34" x2="210" y2="52" />
        <line x1="210" y1="368" x2="210" y2="386" />
        <line x1="34" y1="210" x2="52" y2="210" />
        <line x1="368" y1="210" x2="386" y2="210" />
      </g>

      {/* Rotating sweep */}
      <g className="radar-sweep" style={{ transformOrigin: '210px 210px' }}>
        <path d="M210 210 L210 40 A170 170 0 0 1 340 110 Z" fill="url(#sweepGradient)" opacity="0.5" />
        <line x1="210" y1="210" x2="210" y2="40" className="gh-sweep-edge" />
      </g>

      {/* Category blips */}
      {blipAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x = 210 + 130 * Math.cos(rad)
        const y = 210 + 130 * Math.sin(rad)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" className="gh-blip radar-blip" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle cx={x} cy={y} r="9" className="gh-blip-ring" />
          </g>
        )
      })}

      <circle cx="210" cy="210" r="3.5" className="gh-core" />

      {/* Corner brackets */}
      {[[40, 40, 1, 1], [380, 40, -1, 1], [40, 380, 1, -1], [380, 380, -1, -1]].map(([x, y, dx, dy], i) => (
        <g key={i} className="gh-bracket">
          <line x1={x} y1={y} x2={x + dx * 22} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + dy * 22} />
        </g>
      ))}

      <text x="58" y="190" className="gh-label">GUIDES // {String(guideCount).padStart(2, '0')}</text>
      <text x="58" y="234" className="gh-label">CATEGORIES // {String(categoryCount).padStart(2, '0')}</text>
      <text x="246" y="332" className="gh-label">LIBRARY // ONLINE</text>
    </svg>
  )
}
