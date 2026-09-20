const nodes = [
  {
    id: 'signal',
    x: 146, y: 168,
    path: 'M146 168 V240 L280 280',
    bend: { x: 146, y: 240 },
    label: 'SIGNAL DETECTED',
    labelX: 130, labelY: 146, anchor: 'end',
  },
  {
    id: 'pattern',
    x: 412, y: 158,
    path: 'M412 158 V232 L280 280',
    bend: { x: 412, y: 232 },
    label: 'PATTERN',
    labelX: 428, labelY: 146, anchor: 'start',
    waveform: { x: 430, y: 182 },
  },
  {
    id: 'weakness',
    x: 128, y: 372,
    path: 'M128 372 H200 L280 280',
    bend: { x: 200, y: 372 },
    label: 'WEAKNESS',
    labelX: 112, labelY: 396, anchor: 'end',
    weak: true,
  },
  {
    id: 'confidence',
    x: 404, y: 388,
    path: 'M404 388 H340 L280 280',
    bend: { x: 340, y: 388 },
    label: 'CONFIDENCE',
    labelX: 420, labelY: 396, anchor: 'start',
    value: '94%',
    waveform: { x: 422, y: 370 },
  },
  {
    id: 'action',
    x: 280, y: 452,
    path: 'M280 280 V452',
    label: 'ACTION',
    labelX: 280, labelY: 480, anchor: 'middle',
  },
]

export default function HeroGraphic() {
  return (
    <svg viewBox="0 0 560 560" className="hero-graphic" role="presentation" aria-hidden="true">
      <defs>
        <radialGradient id="hero-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5c6d" stopOpacity="0.3" />
          <stop offset="45%" stopColor="#ff3b4e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ff3b4e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="280" cy="280" r="250" fill="url(#hero-core-glow)" />

      <g className="hero-graphic-brackets">
        <path d="M70 113V70h43M447 70h43v43M70 447v43h43M490 447v43h-43" />
      </g>

      <rect className="signal-scan" x="76" y="86" width="408" height="1" />

      <g className="signal-network">
        {nodes.map((node) => (
          <g key={node.id} className={'signal-branch' + (node.weak ? ' is-weak' : '')}>
            <path className="signal-line" d={node.path} />
            <path className="signal-pulse-line" d={node.path} />
            {node.bend && <circle className="relay-node" cx={node.bend.x} cy={node.bend.y} r="1.8" />}
            {node.waveform && (
              <path
                className="signal-waveform"
                transform={`translate(${node.waveform.x} ${node.waveform.y})`}
                d="M-9 0 L-6 -3 L-3 3 L0 -4 L3 2 L6 -2 L9 3"
              />
            )}
            <circle className="signal-node-ring" cx={node.x} cy={node.y} r={node.weak ? 7 : 5} />
            <circle className="signal-node-dot" cx={node.x} cy={node.y} r={node.weak ? 2.8 : 2} />
            <text className="signal-label" x={node.labelX} y={node.labelY} textAnchor={node.anchor}>{node.label}</text>
            {node.value && (
              <text className="signal-value" x={node.labelX} y={node.labelY + 13} textAnchor={node.anchor}>{node.value}</text>
            )}
          </g>
        ))}
      </g>

      <g className="core-node">
        <circle className="core-ring-pulse" cx="280" cy="280" r="20" />
        <circle className="core-ring" cx="280" cy="280" r="24" />
        <rect className="core-diamond" x="271" y="271" width="18" height="18" transform="rotate(45 280 280)" />
        <text className="core-label" x="280" y="240" textAnchor="middle">ANALYSIS</text>
      </g>
    </svg>
  )
}
