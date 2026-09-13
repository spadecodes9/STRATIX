import { getCourseById, getNextIncompleteLesson } from './courses.js'
import { getGuideById } from './guides.js'

// STRATIX v1 ships VALORANT only. This id is threaded through the coach
// service so future games (CS, CoD) can carry their own knowledge base
// without changing the engine or the UI that calls it.
export const ACTIVE_GAME = 'valorant'

function courseRec(courseId, subtitle) {
  const course = getCourseById(courseId)
  if (!course) return null
  return { type: 'course', id: course.id, title: course.title, subtitle: subtitle || `${course.difficulty} · ${course.duration}` }
}

function lessonRec(lesson, subtitle) {
  if (!lesson) return null
  const course = getCourseById(lesson.courseId)
  return {
    type: 'lesson',
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    subtitle: subtitle || `${course?.title || 'Lesson'} · ${lesson.duration}`,
  }
}

function guideRec(guideId, subtitle) {
  const guide = getGuideById(guideId)
  if (!guide) return null
  return { type: 'guide', id: guide.id, title: guide.title, subtitle: subtitle || `${guide.category} guide · ${guide.readTime}` }
}

/**
 * Standard "what's the smartest thing to point them at" pattern used by most
 * categories: not started -> the course itself, in progress -> their actual
 * next lesson, finished -> a related guide as a refresher instead of
 * re-suggesting something they already completed.
 */
function progressAwareRec(courseId, user, { finishedGuideId, finishedSubtitle } = {}) {
  const pct = user?.courseProgress?.[courseId]
  if (pct === undefined) return courseRec(courseId, 'Not started yet')
  if (pct >= 100) {
    if (finishedGuideId) return guideRec(finishedGuideId, finishedSubtitle || 'Refresher')
    return courseRec(courseId, 'Already completed — worth revisiting')
  }
  const next = getNextIncompleteLesson(courseId, pct)
  return lessonRec(next, `Your next lesson · ${pct}% through the course`)
}

export const CATEGORIES = [
  {
    id: 'crosshair-placement',
    label: 'Crosshair Placement',
    skillKey: 'Aim & Mechanics',
    keywords: ['crosshair placement', 'crosshair', 'pre-aim', 'preaim', 'pre-fire', 'holding an angle', 'holding angles', 'angle isolation'],
    tips: [
      'Rest your crosshair at head height on every angle before you clear it — not chest height, not the floor.',
      'Pre-aim the spot an enemy is statistically most likely to appear, not the center of the doorway.',
      'When you peek, your crosshair should already be where the fight happens — if you\'re moving it after you see them, you\'re reacting instead of pre-aiming.',
      'Narrow, common angles (like a single doorway) deserve tight pre-aim. Wide open angles need a default resting position you sweep from.',
    ],
    followUps: [
      'Do you find your crosshair drifts low when you\'re moving, or is it more of a "forgot to reset it" problem after a trade?',
      'Is this happening more on defense holding angles, or on attack pushing into sites?',
    ],
  },
  {
    id: 'aim',
    label: 'Aim & Mechanics',
    skillKey: 'Aim & Mechanics',
    keywords: ['aim', 'flick', 'flicking', 'tracking', 'headshot', 'spray control', 'recoil', 'reaction time', 'sensitivity', 'edpi', 'dpi'],
    tips: [
      'Separate your practice: flicking and tracking use different muscle memory, so drilling them together tends to improve neither.',
      'A short, boring warmup (5-10 min of the same drill) beats an hour of unfocused deathmatch.',
      'If your sensitivity has changed more than once this month, that\'s likely costing you more than it\'s fixing — give a setting at least a week before judging it.',
      'Spray control is a memorized pattern plus a starting pre-aim — if your first bullet is already off-target, no amount of pattern memory saves the spray.',
    ],
    followUps: [
      'Is it flicking to targets that feels off, or tracking them once you\'re on target?',
      'Want a quick warmup routine, or are you looking to fix a specific mechanical habit?',
    ],
  },
  {
    id: 'movement',
    label: 'Movement',
    skillKey: null,
    keywords: ['movement', 'counter-strafe', 'counter strafe', 'counter strafing', 'strafe', 'stutter step', 'jiggle peek', 'jiggle-peek', 'peeker'],
    tips: [
      'Counter-strafing (tapping the opposite direction key) kills your momentum almost instantly, letting you shoot accurately far sooner than just releasing a key.',
      'Peeker\'s advantage means the person moving into an angle sees the defender slightly before being seen back — use short, deliberate peeks rather than long exposed ones.',
      'Jiggle-peeking works best for information, not for trading — don\'t expect to win a duel while jiggling, expect to learn where someone is.',
    ],
    followUps: [
      'Is this about peeking cleanly into duels, or more about repositioning without giving away your location?',
    ],
    // No dedicated movement lesson exists yet in the v1 catalog — acknowledge
    // that honestly rather than inventing content, and point at the closest match.
    noDirectResource: true,
  },
  {
    id: 'utility',
    label: 'Utility Usage',
    skillKey: 'Utility Usage',
    keywords: ['utility', 'smoke', 'smokes', 'flash', 'flashes', 'molly', 'molotov', 'wall', 'ability', 'cooldown', 'lineup', 'lineups', 'grenade', 'retake'],
    tips: [
      'Utility spent for information is almost always worth more than utility spent for damage — a recon tool before a peek tells your whole team where to trade.',
      'Sync your utility with your team\'s timing, not your own reaction — a smoke thrown a second early or late can undo the whole execute.',
      'Save at least one piece of utility for the retake or post-plant, not just the initial push — most rounds are decided after the first engagement, not during it.',
    ],
    followUps: [
      'Is this about executing onto a site, or about using utility to survive a retake?',
    ],
  },
  {
    id: 'positioning',
    label: 'Positioning',
    skillKey: 'Positioning',
    keywords: ['position', 'positioning', 'off-angle', 'off angle', 'crossfire', 'site hold', 'holding site', 'rotate', 'rotation timing', 'default position'],
    tips: [
      'Two players holding a straight line toward the same entry point isn\'t a crossfire — it\'s one trade waiting to happen. Angle your positions so neither of you can be cleared by the same peek.',
      'An off-angle only works once per round — the first time someone dies to it, the enemy team adjusts. Don\'t rely on the same off-angle every round.',
      'Positioning is a moving target: where you should stand at 1:40 on the clock is different from where you should stand at 0:20. Reposition as information changes, not just at round start.',
    ],
    followUps: [
      'Is this more about holding a site solo, or coordinating a crossfire with a teammate?',
    ],
  },
  {
    id: 'game-sense',
    label: 'Game Sense',
    skillKey: 'Game Sense',
    keywords: ['game sense', 'read', 'reading', 'info', 'information', 'map awareness', 'sound cue', 'sound cues', 'anticipate', 'prediction', 'rotation'],
    tips: [
      'Footstep direction tells you the rotation path; footstep volume just tells you distance — most players only listen for the second one.',
      'Ability sounds carry further than footsteps and are harder to fake, which makes them a stronger rotation signal than a single set of footsteps.',
      'Build the habit of calling one rotation per round from sound alone before your minimap confirms it — it\'s a skill that compounds fast.',
    ],
    followUps: [
      'Is this about reading rotations mid-round, or more about map awareness in general?',
    ],
  },
  {
    id: 'economy',
    label: 'Economy Management',
    skillKey: 'Economy Mgmt',
    keywords: ['economy', 'eco', 'ecos', 'buy', 'buying', 'save round', 'force buy', 'credits', 'loadout', 'full buy', 'half buy'],
    tips: [
      'Treat your own economy as a personal budget in solo queue — coordinated team buys are rare, but you can still avoid being the reason a round-two buy falls apart.',
      'A half-buy that doesn\'t change the round outcome usually just delays your own reset — either commit to a light buy that adds real resistance, or save cleanly.',
      'Track loss streaks loosely: a team on a bonus round after two losses is far more dangerous than a first-round force, so hold utility and positioning accordingly.',
    ],
    followUps: [
      'Is this about your own individual buys, or reading what the enemy team\'s economy is doing?',
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    skillKey: 'Communication',
    keywords: ['communication', 'comms', 'callout', 'callouts', 'call outs', 'shotcall', 'shotcalling', 'igl', 'team coordination', 'coordination'],
    tips: [
      'Good callouts are short and location-first: "two mid, pushing" beats a play-by-play. Say where before why.',
      'A shotcaller\'s job during the round is to reduce decisions for teammates, not add options — one clear call beats three good suggestions.',
      'If comms go quiet after a loss, that\'s the moment they matter most — silence after a bad round usually snowballs into a worse one.',
    ],
    followUps: [
      'Is this about giving better callouts yourself, or about shotcalling for the team?',
    ],
  },
  {
    id: 'mental-game',
    label: 'Mental Game',
    skillKey: null,
    keywords: ['mental', 'tilt', 'tilted', 'confidence', 'anxiety', 'nervous', 'choke', 'choking', 'stress', 'mindset', 'focus', 'frustrated'],
    tips: [
      'Tilt itself isn\'t the problem — tilt that changes your decisions (forcing buys, chasing picks, going silent) is. Separate the feeling from the behavior.',
      'A single, boring reset habit between rounds — one breath, one fixed phrase — works precisely because it\'s dull enough to do under pressure without thinking.',
      'After a losing half, redefine the next five rounds as "play my role correctly" instead of "win the game." Smaller, controllable goals are harder for tilt to hijack.',
    ],
    followUps: [
      'Is this tilt during a match, or more about nerves before you even queue up?',
    ],
  },
]

const GENERAL_TIPS = [
  'A consistent VOD review habit — even just your deaths, ten minutes after a session — tends to move rank faster than more hours of unreviewed queueing.',
  'Small, specific goals for a session ("hold my crosshair at head height this game") beat vague ones ("play better") because you can actually tell if you did them.',
  'Most rank plateaus come from one under-trained fundamental, not a lack of overall skill — that\'s usually visible in a skill matrix like yours.',
]

const GENERAL_FOLLOWUPS = [
  'Want me to go deeper on aim, utility, positioning, game sense, economy, communication, or mental game specifically?',
  'Is there a particular part of your last few games that\'s been frustrating you?',
]

/**
 * Resolves the best real resource to recommend for a category, factoring in
 * the player's actual course progress. Falls back gracefully when v1's
 * content catalog genuinely doesn't have a matching lesson yet.
 */
export function resolveRecommendation(categoryId, user) {
  switch (categoryId) {
    case 'crosshair-placement':
    case 'aim':
      return progressAwareRec('aim-fundamentals', user, { finishedGuideId: 'crosshair-codes' })
    case 'movement':
      // No dedicated movement lesson in the v1 catalog yet — point at the
      // closest existing content rather than inventing something that isn't there.
      return courseRec('aim-fundamentals', 'Closest available module for now')
    case 'utility':
      return progressAwareRec('advanced-utility-usage', user, { finishedGuideId: 'smoke-lineups-ascent' })
    case 'positioning':
      return progressAwareRec('map-control-mastery', user)
    case 'game-sense': {
      const pct = user?.courseProgress?.['map-control-mastery']
      if (pct !== undefined && pct >= 100) return guideRec('reading-rotations')
      return lessonRec({ id: 'l_map_1', title: 'Reading Rotations From Sound Cues', duration: '11m', courseId: 'map-control-mastery' })
    }
    case 'economy':
      return guideRec('economy-management')
    case 'communication':
      return progressAwareRec('igl-shotcalling', user)
    case 'mental-game':
      return progressAwareRec('immortal-mindset', user, { finishedGuideId: 'tilt-proofing' })
    default:
      return null
  }
}

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null
}

export function getGeneralTip(seedIndex = 0) {
  return GENERAL_TIPS[seedIndex % GENERAL_TIPS.length]
}

export function getGeneralFollowUp(seedIndex = 0) {
  return GENERAL_FOLLOWUPS[seedIndex % GENERAL_FOLLOWUPS.length]
}

// Maps a skill-matrix skill name back to the coach category that covers it,
// used when falling back to "let's talk about your weakest skill".
export function categoryForSkill(skillName) {
  const found = CATEGORIES.find((c) => c.skillKey === skillName)
  return found ? found.id : null
}
