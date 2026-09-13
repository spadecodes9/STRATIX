import { useRef, useState, useEffect } from 'react'

/**
 * CinematicScene provides deterministic, scroll-driven normalized progress [0..1]
 * for a sticky viewport inside a tall scroll-driving track.
 *
 * When scrolling down: progress increases smoothly from 0.0 to 1.0
 * When stopping: progress freezes exactly in place
 * When scrolling up: progress smoothly reverses back toward 0.0
 * When returning to the top: progress returns to 0.0
 */
export default function CinematicScene({
  id,
  sceneNumber,
  title,
  height = '260vh',
  children,
  className = '',
}) {
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const trackHeight = rect.height
      const topOffset = rect.top

      // Is scene in or near the viewport?
      const inView = topOffset < windowHeight * 1.5 && topOffset + trackHeight > -windowHeight * 0.5
      setIsVisible(inView)

      if (inView) {
        const scrollDistance = trackHeight - windowHeight
        if (scrollDistance > 0) {
          // Exactly 0 when top of track reaches top of screen
          // Exactly 1 when bottom of track reaches bottom of screen
          const raw = -topOffset / scrollDistance
          const clamped = Math.min(Math.max(raw, 0), 1)
          setProgress(clamped)
        } else {
          setProgress(topOffset <= 0 ? 1 : 0)
        }
      } else if (topOffset >= windowHeight) {
        setProgress(0)
      } else if (topOffset + trackHeight <= 0) {
        setProgress(1)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateScrollProgress)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section
      ref={trackRef}
      id={id}
      data-scene={sceneNumber}
      className={`cinematic-scene-track ${className}`}
      style={{ minHeight: height }}
    >
      <div className="cinematic-sticky-viewport">
        {typeof children === 'function' ? children(progress, isVisible) : children}
      </div>
    </section>
  )
}
