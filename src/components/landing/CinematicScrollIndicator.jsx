import { useState, useEffect } from 'react'

const SCENES_LIST = [
  { id: 'scene-01', num: '01', title: 'Initialization' },
  { id: 'scene-02', num: '02', title: 'Movement' },
  { id: 'scene-03', num: '03', title: 'Flash Impact' },
  { id: 'scene-04', num: '04', title: 'Precision' },
  { id: 'scene-05', num: '05', title: 'Utility' },
  { id: 'scene-06', num: '06', title: 'Game Sense' },
  { id: 'scene-07', num: '07', title: 'Identify Gap' },
  { id: 'scene-08', num: '08', title: 'Train Intent' },
  { id: 'scene-09', num: '09', title: 'Courses' },
  { id: 'scene-10', num: '10', title: 'Guides' },
  { id: 'scene-11', num: '11', title: 'Quizzes' },
  { id: 'scene-12', num: '12', title: 'AI Coach' },
  { id: 'scene-13', num: '13', title: 'Command Center' },
  { id: 'scene-14', num: '14', title: 'Progression' },
  { id: 'scene-15', num: '15', title: 'Community' },
  { id: 'scene-16', num: '16', title: 'Premium' },
  { id: 'scene-17', num: '17', title: 'Resolution' },
]

export default function CinematicScrollIndicator() {
  const [activeScene, setActiveScene] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const sceneElements = SCENES_LIST.map((s) => document.getElementById(s.id))

      for (let i = sceneElements.length - 1; i >= 0; i--) {
        const el = sceneElements[i]
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= windowHeight * 0.4) {
            setActiveScene(i)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToScene = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className={`cinematic-chapter-nav ${isExpanded ? 'chapter-nav-expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      role="navigation"
      aria-label="Scene Navigator"
    >
      <div className="chapter-nav-header">
        <span className="chapter-nav-badge">STRATIX // CHAPTERS</span>
        <span className="chapter-nav-active-tag">
          {SCENES_LIST[activeScene]?.num} / 17
        </span>
      </div>

      <div className="chapter-nav-list">
        {SCENES_LIST.map((scene, idx) => {
          const isActive = activeScene === idx
          return (
            <button
              key={scene.id}
              className={`chapter-nav-item ${isActive ? 'chapter-nav-item-active' : ''}`}
              onClick={() => scrollToScene(scene.id)}
              aria-label={`Jump to Scene ${scene.num}: ${scene.title}`}
            >
              <span className="chapter-nav-num">{scene.num}</span>
              <span className="chapter-nav-bar">
                <span className="chapter-nav-fill" />
              </span>
              <span className="chapter-nav-label">{scene.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
