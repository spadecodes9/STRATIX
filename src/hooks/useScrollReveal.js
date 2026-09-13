import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref to attach to an element and a boolean that flips to true
 * once the element scrolls into view. Used for the stagger/reveal motion
 * on the Guides page. Respects prefers-reduced-motion by revealing
 * immediately instead of waiting on intersection, since scoped CSS
 * transition durations are already neutralized globally for that case —
 * this just avoids content staying invisible if a transition never "plays".
 */
export function useScrollReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(node)

    // Safety net: below-the-fold content should never stay permanently
    // invisible if a real scroll/intersection event never happens (e.g. a
    // very short viewport, an embedded view, or a non-interactive render).
    // Normal scrolling still reveals it immediately via the observer above.
    const fallback = window.setTimeout(() => setIsVisible(true), 500)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [threshold])

  return [ref, isVisible]
}
