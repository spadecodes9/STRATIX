import { Map, Crosshair, Zap, Compass, Brain, LayoutGrid } from 'lucide-react'

export const CATEGORY_META = {
  Maps: { icon: Map, description: 'Site setups, post-plant holds, and retake angles.' },
  Weapons: { icon: Crosshair, description: 'Crosshairs, settings, and spray control that hold up under pressure.' },
  Utility: { icon: Zap, description: 'Lineups, timings, and utility economy.' },
  Strategy: { icon: Compass, description: 'Rotations, economy, and round-level decisions.' },
  'Mental Game': { icon: Brain, description: 'Tilt control and consistency between rounds.' },
}

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || { icon: LayoutGrid, description: '' }
}
