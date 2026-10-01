import { useEffect, useRef, useState } from 'react'

// Tactical decision network for the Quizzes hero. Decorative only: it shows
// the decisions available in a round, highlighting one possible route at a
// time. Colors/animation live in Quizzes.css (`.qzn-*`) so the accent follows
// the active theme and reduced-motion is handled in CSS.

const NODES = {
  read: { x: 210, y: 72, label: 'READ', lx: 0, ly: -16, anchor: 'middle', pulse: 3.1 },
  info: { x: 104, y: 152, label: 'INFO', lx: -14, ly: 4, anchor: 'end', pulse: 3.9 },
  timing: { x: 318, y: 144, label: 'TIMING', lx: 14, ly: 4, anchor: 'start', pulse: 4.6 },
  decision: { x: 204, y: 222, label: 'DECISION', lx: 14, ly: -10, anchor: 'start', pulse: 3.4 },
  position: { x: 90, y: 272, label: 'POSITION', lx: -14, ly: 4, anchor: 'end', pulse: 5.2 },
  fight: { x: 326, y: 266, label: 'FIGHT', lx: 14, ly: 4, anchor: 'start', pulse: 4.2 },
  result: { x: 210, y: 350, label: 'RESULT', lx: 0, ly: 26, anchor: 'middle', pulse: 3.7 },
}
const NODE_IDS = Object.keys(NODES)

const EDGES = [
  ['read', 'info'], ['read', 'timing'], ['read', 'decision'],
  ['info', 'decision'], ['timing', 'decision'], ['info', 'position'], ['timing', 'fight'],
  ['decision', 'position'], ['decision', 'fight'],
  ['position', 'result'], ['fight', 'result'], ['decision', 'result'],
]
const edgeKey = (a, b) => [a, b].sort().join('|')

// Possible routes through the network — one is highlighted at a time.
const ROUTES = [
  ['read', 'info', 'decision', 'result'],
  ['read', 'timing', 'fight', 'result'],
  ['read', 'info', 'position', 'result'],
  ['read', 'timing', 'decision', 'fight', 'result'],
]
const ROUTE_HOLD_MS = [3600, 4200, 3300, 4600] // uneven on purpose
const ROUTE_GAP_MS = 1100

// A few "data" particles on individual links, in mixed directions.
const PARTICLES = [
  { from: 'info', to: 'read', dur: 3.2, begin: 0.4 },
  { from: 'decision', to: 'fight', dur: 2.7, begin: 1.6 },
  { from: 'position', to: 'result', dur: 3.8, begin: 2.9 },
]

const NEAR_RADIUS = 120

export default function QuizHeroVisual() {
  const svgRef = useRef(null)
  const frameRef = useRef(0)
  const [routeIndex, setRouteIndex] = useState(0)
  const [isRouteShown, setIsRouteShown] = useState(true)
  const [isInView, setIsInView] = useState(true)
  const [near, setNear] = useState('') // "nearest|other,near,ids"
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // Pause everything while the hero is off-screen.
  useEffect(() => {
    const node = svgRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Route cycle: hold a route, fade it out, pause, show the next one.
  useEffect(() => {
    if (!isInView) return
    const delay = isRouteShown ? ROUTE_HOLD_MS[routeIndex] : ROUTE_GAP_MS
    const timer = window.setTimeout(() => {
      if (isRouteShown) {
        setIsRouteShown(false)
      } else {
        setRouteIndex((i) => (i + 1) % ROUTES.length)
        setIsRouteShown(true)
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [isInView, isRouteShown, routeIndex])

  // SMIL particles ignore CSS play-state, so pause them explicitly too.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg?.pauseAnimations) return
    if (isInView) svg.unpauseAnimations()
    else svg.pauseAnimations()
  }, [isInView])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  // Pointer proximity: at most one calculation per frame, 7 distance checks.
  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const { clientX, clientY } = event
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      const scale = 420 / rect.width
      const px = (clientX - rect.left) * scale
      const py = (clientY - rect.top) * scale
      let nearest = ''
      let best = NEAR_RADIUS
      const others = []
      for (const id of NODE_IDS) {
        const d = Math.hypot(NODES[id].x - px, NODES[id].y - py)
        if (d < best) { best = d; nearest = id }
        if (d < NEAR_RADIUS * 1.4) others.push(id)
      }
      setNear(nearest ? `${nearest}|${others.join(',')}` : '')
    })
  }
  const handlePointerLeave = () => {
    cancelAnimationFrame(frameRef.current)
    setNear('')
  }

  const [nearestId, nearList = ''] = near.split('|')
  const nearIds = new Set(nearList.split(',').filter(Boolean))

  const route = ROUTES[routeIndex]
  const routeEdges = new Set()
  for (let i = 0; i < route.length - 1; i++) routeEdges.add(edgeKey(route[i], route[i + 1]))
  const routeNodes = new Set(route)

  const ticks = Array.from({ length: 60 }, (_, i) => i * 6)

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 420 420"
      className={'qz-hero-svg qzn' + (isInView ? '' : ' is-paused') + (isRouteShown ? ' has-route' : '')}
      aria-hidden="true"
      focusable="false"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <defs>
        <clipPath id="qznClip"><circle cx="210" cy="210" r="182" /></clipPath>
        <linearGradient id="qznScan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="85%" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* Radial guides + tick ring */}
      <circle cx="210" cy="210" r="196" className="qzn-glow" />
      <circle cx="210" cy="210" r="182" className="qzn-ring" />
      <circle cx="210" cy="210" r="128" className="qzn-ring qzn-ring-dashed" />
      <circle cx="210" cy="210" r="64" className="qzn-ring qzn-ring-faint" />
      <line x1="210" y1="22" x2="210" y2="398" className="qzn-axis" />
      <line x1="22" y1="210" x2="398" y2="210" className="qzn-axis" />
      {ticks.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const major = deg % 30 === 0
        const r1 = 182
        const r2 = major ? 172 : 177
        return (
          <line
            key={deg}
            x1={210 + r1 * Math.cos(rad)} y1={210 + r1 * Math.sin(rad)}
            x2={210 + r2 * Math.cos(rad)} y2={210 + r2 * Math.sin(rad)}
            className={major ? 'qzn-tick qzn-tick-major' : 'qzn-tick'}
          />
        )
      })}

      {/* Periodic scan, clipped to the instrument face */}
      <g clipPath="url(#qznClip)">
        <rect x="20" y="-70" width="380" height="70" fill="url(#qznScan)" className="qzn-scan" />
      </g>

      {/* Links */}
      {EDGES.map(([a, b]) => {
        const key = edgeKey(a, b)
        const onRoute = isRouteShown && routeEdges.has(key)
        const isNear = nearIds.has(a) && nearIds.has(b)
        return (
          <line
            key={key}
            x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
            className={'qzn-link' + (onRoute ? ' is-route' : '') + (isNear ? ' is-near' : '')}
          />
        )
      })}

      {/* Data particles */}
      {!reducedMotion && PARTICLES.map((p) => (
        <circle key={`${p.from}-${p.to}`} r="2.2" className="qzn-particle">
          <animateMotion
            dur={`${p.dur}s`}
            begin={`${p.begin}s`}
            repeatCount="indefinite"
            path={`M${NODES[p.from].x} ${NODES[p.from].y} L${NODES[p.to].x} ${NODES[p.to].y}`}
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Nodes */}
      {NODE_IDS.map((id, i) => {
        const n = NODES[id]
        const onRoute = isRouteShown && routeNodes.has(id)
        const cls = 'qzn-node'
          + (onRoute ? ' is-route' : '')
          + (id === nearestId ? ' is-nearest' : nearIds.has(id) ? ' is-near' : '')
        return (
          <g key={id} className={cls} style={{ '--pulse': `${n.pulse}s`, '--pulse-delay': `${-i * 0.7}s` }}>
            <circle cx={n.x} cy={n.y} r="15" className="qzn-node-halo" />
            <circle cx={n.x} cy={n.y} r="10" className="qzn-node-ring" />
            <circle cx={n.x} cy={n.y} r="4.5" className="qzn-node-core" />
            <text x={n.x + n.lx} y={n.y + n.ly} textAnchor={n.anchor} className="qzn-label">{n.label}</text>
          </g>
        )
      })}

      {/* HUD details */}
      <text x={NODES.info.x - 14} y={NODES.info.y + 17} textAnchor="end" className="qzn-coord">X104 · Y152</text>
      {/* Above the node, not below: the hero readout docks over this corner */}
      <text x={NODES.fight.x + 14} y={NODES.fight.y - 12} className="qzn-coord">X326 · Y266</text>
      {[[30, 30, 1, 1], [390, 30, -1, 1], [30, 390, 1, -1], [390, 390, -1, -1]].map(([x, y, dx, dy]) => (
        <path key={`${x}-${y}`} d={`M${x + dx * 20} ${y} L${x} ${y} L${x} ${y + dy * 20}`} className="qzn-bracket" />
      ))}
      <text x="40" y="22" className="qzn-meta">NET // DECISION MAP</text>
      <g className="qzn-status">
        <circle cx="286" cy="18.5" r="2.5" className="qzn-status-dot" />
        <text x="294" y="22" className="qzn-meta">
          {isRouteShown ? `OPTION ${String(routeIndex + 1).padStart(2, '0')} / ${String(ROUTES.length).padStart(2, '0')}` : 'EVALUATING'}
        </text>
      </g>
      <text x="40" y="408" className="qzn-meta">NODES 07 · LINKS {EDGES.length}</text>
    </svg>
  )
}
