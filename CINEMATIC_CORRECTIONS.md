# STRATIX CINEMATIC LANDING - EXECUTION CORRECTIONS

## Date: 2026-09-12

## Problems Identified
1. **Visuals too small** - Animations were at viewport edges instead of being the main focus
2. **PowerPoint feel** - Isolated scenes with large empty gaps between them
3. **Excessive scroll distance** - Too much vertical space with little visual change
4. **Lack of continuity** - Hard cuts between scenes instead of fluid transitions
5. **Dead scroll space** - Large regions where nothing meaningful happened

## Corrections Applied

### 1. Reduced Scene Heights (120vh per scene)
**Before:** 240vh - 320vh per scene
**After:** 120vh for all scenes

This eliminates dead scroll space and creates a tighter, more continuous experience.

### 2. Made Visuals Viewport-Dominant

#### Hero Scene (Scene 01)
- Chassis object now crosses **full viewport** (120vw → -20vw)
- Increased size: 70vw width, 50vh height (was ~30% of viewport)
- Centered positioning instead of corner placement
- Smoother opacity transitions for scene overlap

#### Movement Scene (Scene 02)
- Character now crosses **entire viewport** (110vw → -40vw)
- Increased size: 50vw width, 60vh height
- Positioned center-stage for maximum visual impact
- More prominent speed lines (8 lines instead of 6)
- Added scene fade-in/fade-out for smooth transitions

#### Impact Scene (Scene 03)
- Flash effect now **dominates the viewport**
- Core energy scales dramatically (0.5 → 10x)
- Full-screen flash overlay with proper hold state
- Viewport-filling visual during peak (65-85% progress)
- Content darkens during flash for dramatic contrast

### 3. Viewport-First Architecture

**CSS Changes:**
```css
.scene-container {
  position: absolute;  /* Was: relative */
  inset: 0;           /* Fills entire sticky viewport */
}

.scene-content {
  text-align: center; /* Centered for better composition */
  z-index: 20;        /* Above visual layers */
}
```

All scenes now use absolute positioning within the sticky viewport, allowing visuals to occupy the full stage.

### 4. Continuous Timeline

**Scene Overlap Strategy:**
- Each scene begins fading in around 70-80% of previous scene
- Smooth opacity transitions prevent hard cuts
- Visual elements cross viewport boundaries
- No more "page flip" feeling

### 5. Performance Optimizations

- Maintained lightweight animation approach
- Used `transform`, `opacity`, `scale` for GPU acceleration
- Added `will-change` hints for smoother animations
- Kept `requestAnimationFrame` for scroll updates

## File Changes

### Modified Files:
1. `src/components/landing/CinematicLanding.jsx` - Reduced all scene heights to 120vh
2. `src/components/landing/scenes/01_HeroScene.jsx` - Viewport-crossing motion
3. `src/components/landing/scenes/02_MovementScene.jsx` - Full-screen character movement
4. `src/components/landing/scenes/03_ImpactScene.jsx` - Viewport-dominant flash
5. `src/components/landing/cinematic.css` - Viewport-first styling

### CSS Key Changes:
- Scene containers: `position: absolute; inset: 0;`
- Visual elements: Much larger sizing (50-70vw instead of 20-30%)
- Centered composition instead of edge placement
- Removed excessive padding/margins

## Testing Checklist

✅ Build succeeds without errors
✅ Scenes are 120vh instead of 240-320vh
✅ Visuals are large and viewport-centered
✅ Scroll distance matches visual change density

### Still Required:
- [ ] Visual browser test of actual scrolling experience
- [ ] Verify smooth transitions between scenes
- [ ] Confirm no dead scroll regions
- [ ] Test mobile responsiveness
- [ ] Verify `prefers-reduced-motion` support

## Expected Result

The landing page should now feel like **controlling a continuous cinematic timeline** rather than scrolling through PowerPoint slides. Every scroll movement should produce meaningful visual change, with large, viewport-dominant animations that transition smoothly between scenes.

## Next Steps

1. Test in browser at http://localhost:5175
2. Scroll slowly through first 3-4 scenes
3. Verify visuals dominate the viewport
4. Confirm smooth transitions
5. Check for any remaining dead scroll space
6. Adjust individual scene timings if needed

## Notes

- Preserved all existing routes, auth, and backend
- Did not add new sections or features
- Only modified cinematic execution
- Maintained React + Vite architecture
- No additional libraries required
