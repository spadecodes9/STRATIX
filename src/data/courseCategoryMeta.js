import { Crosshair, Zap, Compass, Brain } from 'lucide-react'

export const COURSE_CATEGORY_META = {
  Mechanics: { icon: Crosshair },
  Utility: { icon: Zap },
  Strategy: { icon: Compass },
  'Mental Game': { icon: Brain },
}

export function getCourseCategoryMeta(category) {
  return COURSE_CATEGORY_META[category] || { icon: Crosshair }
}
