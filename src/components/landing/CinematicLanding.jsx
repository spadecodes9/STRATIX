import { useEffect, useState, useRef } from 'react'
import './cinematic.css'

// Import all 17 scenes
import Scene01 from './scenes/01_HeroScene.jsx'
import Scene02 from './scenes/02_MovementScene.jsx'
import Scene03 from './scenes/03_ImpactScene.jsx'
import Scene04 from './scenes/04_PrecisionScene.jsx'
import Scene05 from './scenes/05_UtilityScene.jsx'
import Scene06 from './scenes/06_GameSenseScene.jsx'
import Scene07 from './scenes/07_AnalysisScene.jsx'
import Scene08 from './scenes/08_TrainingScene.jsx'
import Scene09 from './scenes/09_CoursesScene.jsx'
import Scene10 from './scenes/10_GuidesScene.jsx'
import Scene11 from './scenes/11_QuizScene.jsx'
import Scene12 from './scenes/12_AICoachScene.jsx'
import Scene13 from './scenes/13_CommandCenterScene.jsx'
import Scene14 from './scenes/14_ProgressionScene.jsx'
import Scene15 from './scenes/15_CommunityScene.jsx'
import Scene16 from './scenes/16_PremiumScene.jsx'
import Scene17 from './scenes/17_FinalScene.jsx'

export default function CinematicLanding() {
  const containerRef = useRef(null)
  const [smoothedProgress, setSmoothedProgress] = useState(0)
  const rawProgressRef = useRef(0)
  const requestIdRef = useRef(null)

  useEffect(() => {
    const updateSmoothedProgress = () => {
      const raw = rawProgressRef.current
      setSmoothedProgress(prev => prev + (raw - prev) * 0.08)
      requestIdRef.current = requestAnimationFrame(updateSmoothedProgress)
    }

    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1)
      rawProgressRef.current = progress
    }

    window.addEventListener('scroll', handleScroll)
    requestIdRef.current = requestAnimationFrame(updateSmoothedProgress)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [])

  const scenes = [
    Scene01, Scene02, Scene03, Scene04, Scene05,
    Scene06, Scene07, Scene08, Scene09, Scene10,
    Scene11, Scene12, Scene13, Scene14, Scene15,
    Scene16, Scene17
  ]

  // Use smoothed progress for cinematic feel
  const progress = Math.min(Math.max(smoothedProgress, 0), 1)
  const sceneIndex = Math.min(Math.floor(progress * 17), 16)
  const sceneProgress = (progress * 17) - sceneIndex // 0 to 1 within current scene's segment

  const CurrentScene = scenes[sceneIndex]
  const NextScene = sceneIndex < 16 ? scenes[sceneIndex + 1] : null

  return (
    <div ref={containerRef} className="cinematic-continuous-landing">
      {/* Single sticky viewport - the stage where all scenes play */}
      <div className="cinematic-stage">
        {/* Render current scene with fade out opacity */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: sceneIndex < 16 ? 1 - sceneProgress : 1
        }}>
          {CurrentScene && (
            <CurrentScene progress={sceneProgress} isVisible={true} />
          )}
        </div>

        {/* Render next scene with fade in opacity (except for the last scene) */}
        {sceneIndex < 16 && NextScene && (
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: sceneProgress
          }}>
          <NextScene progress={sceneProgress} isVisible={true} />
          </div>
        )}
      </div>

      {/* Scroll spacer - controls total scroll length */}
      {/* 1700vh gives each scene ~1 viewport height of scroll range for crossfading */}
      <div className="scroll-spacer" style={{ height: '1700vh' }} />
    </div>
  )
}