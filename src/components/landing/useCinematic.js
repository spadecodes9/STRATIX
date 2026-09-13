import { useContext } from 'react'
import { CinematicContext } from './CinematicLanding'

export function useCinematic(sceneName) {
  const context = useContext(CinematicContext)
  if (!context) {
    throw new Error('useCinematic must be used within a CinematicLanding')
  }

  // Find scene progress by name
  const sceneInfo = context.scenes.find(s => s.name === sceneName)
  if (!sceneInfo) {
    console.warn(`Scene ${sceneName} not found in cinematic landing`)
    return { progress: 0 }
  }

  return { progress: sceneInfo.progress }
}