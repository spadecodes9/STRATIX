export default function HeroGraphic() {
  return (
    <svg viewBox="0 0 420 420" className="hero-graphic" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff3b4e" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="210" cy="210" r="200" fill="url(#glow)" />

      {/* Outer rotating rings */}
      <circle cx="210" cy="210" r="160" fill="none" stroke="#2a2a32" strokeWidth="1" />
      <circle cx="210" cy="210" r="120" fill="none" stroke="#2a2a32" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="210" cy="210" r="86" fill="none" stroke="#ff3b4e" strokeWidth="1.5" opacity="0.6" />

      {/* Corner brackets */}
      {[
        [50, 50, 1, 1],
        [370, 50, -1, 1],
        [50, 370, 1, -1],
        [370, 370, -1, -1],
      ].map(([x, y, dx, dy], i) => (
        <g key={i} stroke="#ff3b4e" strokeWidth="3" strokeLinecap="square">
          <line x1={x} y1={y} x2={x + dx * 26} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + dy * 26} />
        </g>
      ))}

      {/* Crosshair */}
      <g stroke="#f2f1ee" strokeWidth="2">
        <line x1="210" y1="130" x2="210" y2="172" />
        <line x1="210" y1="248" x2="210" y2="290" />
        <line x1="130" y1="210" x2="172" y2="210" />
        <line x1="248" y1="210" x2="290" y2="210" />
      </g>
      <circle cx="210" cy="210" r="3" fill="#ff3b4e" />

      {/* Tick marks around inner ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const inner = 86
        const outer = i % 6 === 0 ? 96 : 91
        const x1 = 210 + inner * Math.cos(angle)
        const y1 = 210 + inner * Math.sin(angle)
        const x2 = 210 + outer * Math.cos(angle)
        const y2 = 210 + outer * Math.sin(angle)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#616169" strokeWidth="1" />
      })}

      {/* Data readouts */}
      <text x="60" y="330" fill="#8d8d96" fontFamily="ui-monospace, monospace" fontSize="11">RANK · DIAMOND II</text>
      <text x="240" y="100" fill="#8d8d96" fontFamily="ui-monospace, monospace" fontSize="11">RR · 47</text>
    </svg>
  )
}
