import { Map, Crosshair, Zap, Compass, Brain, LayoutGrid } from 'lucide-react'

// Keyed by the normalized category keys in data/guides.js.
export const CATEGORY_META = {
  maps: { icon: Map, description: 'Layouts, site holds, mid control, and rotations.' },
  weapons: { icon: Crosshair, description: 'Crosshairs, first-shot discipline, and weapon choice.' },
  strategy: { icon: Compass, description: 'Economy, trades, and round-level decisions.' },
  utility: { icon: Zap, description: 'Smokes, flashes, and role utility with a purpose.' },
  'mental-game': { icon: Brain, description: 'Resets, focus, and decisions under pressure.' },
}

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || { icon: LayoutGrid, description: '' }
}
