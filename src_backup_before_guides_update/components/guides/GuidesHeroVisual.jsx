export default function GuidesHeroVisual({ guideCount, categoryCount }) {
  // Fixed angles for category "blips" around the radar — purely decorative
  // positioning, not tied to specific guides.
  const blipAngles = [20, 95, 160, 210, 280]

  return (
    <svg viewBox="0 0 420 420" className="guides-hero-visual-svg" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="guidesGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="210" cy="210" r="200" fill="url(#guidesGlow)" />

      <circle cx="210" cy="210" r="170" fill="none" stroke="#2a2a32" strokeWidth="1" />
      <circle cx="210" cy="210" r="130" fill="none" stroke="#2a2a32" strokeWidth="1" strokeDasharray="3 7" />
      <circle cx="210" cy="210" r="90" fill="none" stroke="#2a2a32" strokeWidth="1" />

      {/* Rotating sweep */}
      <g className="radar-sweep" style={{ transformOrigin: '210px 210px' }}>
        <path d="M210 210 L210 40 A170 170 0 0 1 340 110 Z" fill="url(#sweepGradient)" opacity="0.5" />
        <defs>
          <linearGradient id="sweepGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </g>

      {/* Category blips */}
      {blipAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const r = 130
        const x = 210 + r * Math.cos(rad)
        const y = 210 + r * Math.sin(rad)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#ff5c6d" className="radar-blip" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle cx={x} cy={y} r="9" fill="none" stroke="#ff3b4e" strokeWidth="1" opacity="0.4" />
          </g>
        )
      })}

      <circle cx="210" cy="210" r="3.5" fill="#ff3b4e" />

      {/* Corner brackets */}
      {[[40, 40, 1, 1], [380, 40, -1, 1], [40, 380, 1, -1], [380, 380, -1, -1]].map(([x, y, dx, dy], i) => (
        <g key={i} stroke="#ff3b4e" strokeWidth="2.5" strokeLinecap="square">
          <line x1={x} y1={y} x2={x + dx * 22} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + dy * 22} />
        </g>
      ))}

      <text x="46" y="200" fill="#8d8d96" fontFamily="ui-monospace, monospace" fontSize="10.5">
        GUIDES INDEXED // {guideCount}
      </text>
      <text x="46" y="216" fill="#8d8d96" fontFamily="ui-monospace, monospace" fontSize="10.5">
        CATEGORIES // {categoryCount}
      </text>
      <text x="246" y="332" fill="#8d8d96" fontFamily="ui-monospace, monospace" fontSize="10.5">
        DB STATUS // ONLINE
      </text>
    </svg>
  )
}
