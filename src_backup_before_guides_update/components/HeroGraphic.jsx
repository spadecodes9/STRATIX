const ticks = Array.from({ length: 32 })

export default function HeroGraphic() {
  return (
    <svg viewBox="0 0 560 560" className="hero-graphic" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="hero-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5c6d" stopOpacity="0.34" />
          <stop offset="44%" stopColor="#ff3b4e" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-ring-sweep" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff5c6d" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="280" cy="280" r="270" fill="url(#hero-core-glow)" />
      <g className="hero-graphic-orbit hero-graphic-orbit-outer">
        <circle cx="280" cy="280" r="218" fill="none" stroke="#2a2a32" strokeWidth="1" />
        <path d="M280 62 A218 218 0 0 1 498 280" fill="none" stroke="url(#hero-ring-sweep)" strokeWidth="2" />
        <path d="M280 498 A218 218 0 0 1 62 280" fill="none" stroke="#ff3b4e" strokeOpacity="0.42" strokeWidth="1.5" strokeDasharray="4 10" />
      </g>
      <g className="hero-graphic-orbit hero-graphic-orbit-inner">
        <circle cx="280" cy="280" r="155" fill="none" stroke="#2a2a32" strokeWidth="1" strokeDasharray="3 9" />
        <circle cx="280" cy="280" r="112" fill="none" stroke="#ff3b4e" strokeOpacity="0.6" strokeWidth="1.5" />
      </g>

      <g className="hero-graphic-ticks">
        {ticks.map((_, index) => {
          const angle = (index / ticks.length) * Math.PI * 2
          const inner = 156
          const outer = index % 4 === 0 ? 171 : 163
          const x1 = 280 + Math.cos(angle) * inner
          const y1 = 280 + Math.sin(angle) * inner
          const x2 = 280 + Math.cos(angle) * outer
          const y2 = 280 + Math.sin(angle) * outer
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>

      <g className="hero-graphic-crosshair">
        <circle cx="280" cy="280" r="70" fill="#111116" fillOpacity="0.76" stroke="#ff3b4e" strokeOpacity="0.38" />
        <circle cx="280" cy="280" r="47" fill="none" stroke="#f2f1ee" strokeOpacity="0.72" strokeWidth="1.2" />
        <path d="M280 190v61m0 58v61M190 280h61m58 0h61" />
        <path d="M239 239l13 13m56 56l13 13m0-82l-13 13m-56 56l-13 13" strokeOpacity="0.42" strokeWidth="1" />
        <circle cx="280" cy="280" r="7" fill="#ff3b4e" />
        <circle className="hero-graphic-pulse" cx="280" cy="280" r="20" fill="none" stroke="#ff5c6d" strokeWidth="1.5" />
      </g>

      <g className="hero-graphic-brackets">
        <path d="M70 113V70h43M447 70h43v43M70 447v43h43M490 447v43h-43" />
      </g>
      <g className="hero-graphic-data" fill="#8d8d96" fontFamily="ui-monospace, monospace" fontSize="10.5" letterSpacing="1">
        <text x="92" y="143">PLAYER // SIGNAL</text>
        <text x="367" y="422">ACTION // READY</text>
        <text x="91" y="456" fill="#ff5c6d">TARGET LOCK</text>
        <text x="395" y="114">SYNC 01:01</text>
      </g>
      <g className="hero-graphic-sweep">
        <path d="M104 280h352" />
        <circle cx="456" cy="280" r="3.5" />
      </g>
    </svg>
  )
}
