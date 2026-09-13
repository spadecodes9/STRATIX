export const guideCategories = ['All', 'Agents', 'Maps', 'Weapons', 'Utility', 'Strategy', 'Mental Game']

export const guides = [
  {
    id: 'post-plant-bind',
    title: 'Post-Plant Setups on Bind',
    category: 'Maps',
    excerpt: 'The three post-plant crossfires that hold up against every common retake path on Bind.',
    readTime: '6 min',
    difficulty: 'Intermediate',
    updated: '2026-08-12',
    tags: ['Bind', 'Post-plant', 'Site Hold'],
    content: [
      'A plant means nothing if the site falls a few seconds later. On Bind, the defenders retake through a narrow set of chokes, which means your post-plant crossfire only has to cover two or three real angles instead of five.',
      'On A site, plant toward the elbow and hold a crossfire between Short and Hookah. One player watches the door, the other watches the corner — neither should be able to see the plant directly, which forces the retake to walk into open ground.',
      'On B site, the plant near the back-right corner lets you clear the tower and the main choke without rotating your body more than a few degrees. Stagger your two holders by roughly three seconds so the second player punishes whoever cleans up the first pick.',
      'The common mistake is holding straight lines toward the spike. Angle your positions so the retaking team has to commit to a crossfire before they can even see the plant location.',
    ],
  },
  {
    id: 'crosshair-codes',
    title: 'Crosshair Settings That Actually Help You Aim',
    category: 'Weapons',
    excerpt: 'Most crosshair guides optimize for looks. This one optimizes for information.',
    readTime: '4 min',
    difficulty: 'Beginner',
    updated: '2026-07-30',
    tags: ['Settings', 'Crosshair', 'Beginner'],
    content: [
      'A crosshair has one job: tell you exactly where your bullets go without covering the thing you are trying to shoot. Everything else — color, outlines, center dot — is secondary to that.',
      'Keep the crosshair small enough that it does not obscure a head at mid-to-long range. A common beginner mistake is a large, thick cross that blocks the exact pixel you need to see.',
      'Cyan or green outlines stand out against most VALORANT maps better than pure white, which blends into smoke and sky. Test your crosshair against a smoke cloud before committing to a color.',
      'Turn off the center dot if you rely on tracking rather than flicking — it reduces visual clutter during sustained spray control.',
    ],
  },
  {
    id: 'reading-rotations',
    title: 'Reading Rotations From Sound Alone',
    category: 'Strategy',
    featured: true,
    excerpt: 'Footsteps, bomb-defuse voice lines, and ability call-outs will tell you where the enemy team is going before your teammates do.',
    readTime: '7 min',
    difficulty: 'Intermediate',
    updated: '2026-08-01',
    tags: ['Game Sense', 'Audio', 'Rotations'],
    content: [
      'Every rotation makes noise. Footsteps on stairs, doors opening, abilities being cast in the distance — the players who climb fastest are the ones who convert that noise into a mental map, updated every few seconds.',
      'Start by isolating footstep direction rather than volume. Volume tells you distance; direction (left ear vs right ear) tells you the actual rotation path, which matters more for your decision-making.',
      'Ability sounds carry further than footsteps and are harder to fake. A smoke cast on the opposite side of the map is a stronger rotation signal than a single set of footsteps, because it usually commits an entire executing unit.',
      'Practice this passively: in your next ten matches, try to call out one rotation per round based purely on sound before your team\'s minimap confirms it.',
    ],
  },
  {
    id: 'economy-management',
    title: 'Economy Management for Solo Queue',
    category: 'Strategy',
    excerpt: 'You cannot force your team into a full buy, but you can control your own economy well enough to never be the reason it collapses.',
    readTime: '5 min',
    difficulty: 'Beginner',
    updated: '2026-06-18',
    tags: ['Economy', 'Solo Queue'],
    content: [
      'In solo queue, coordinated buys are rare. The most reliable lever you actually control is your own individual economy, so treat it as a personal budget rather than a team decision.',
      'A simple rule: never drop below enough credits for a full buy two rounds later unless the round is genuinely winnable. Half-buys that do not change round outcome just delay your own reset.',
      'If your team is clearly forcing and you disagree, a light buy — armor plus a cheap weapon — keeps you from bleeding credits while still contributing some resistance.',
      'Track the enemy economy loosely by round number and loss streaks. Teams on a bonus round after two losses are far more dangerous than a first-round force; adjust your aggression accordingly.',
    ],
  },
  {
    id: 'tilt-proofing',
    title: 'Tilt-Proofing a Losing Half',
    category: 'Mental Game',
    excerpt: 'The players who climb consistently are not the ones who never tilt — they are the ones whose tilt does not change their decision-making.',
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-08-22',
    tags: ['Mindset', 'Tilt'],
    content: [
      'Tilt is not the problem. Tilt that changes your decisions — chasing picks, forcing buys, going silent on comms — is the problem. Separate the feeling from the behavior.',
      'Build a single, boring reset habit between rounds: a breath, a fixed phrase, a glance away from the screen. It should be dull enough that you barely notice doing it, which is exactly why it works under pressure.',
      'Down a half? Redefine the goal for the next five rounds as "play my role correctly" rather than "win the game." Smaller, controllable goals are harder for tilt to hijack.',
      'Review VOD after a loss, not during. In-game self-criticism just adds another voice competing for attention that your mechanics need.',
    ],
  },
  {
    id: 'smoke-lineups-ascent',
    title: 'Five Smoke Lineups Every Ascent Player Should Know',
    category: 'Utility',
    excerpt: 'Fast, repeatable lineups for both sites that do not require a controller-main memory bank.',
    readTime: '6 min',
    difficulty: 'Beginner',
    updated: '2026-07-05',
    tags: ['Ascent', 'Smokes', 'Lineups'],
    content: [
      'Ascent rewards fast, simple executes more than almost any other map, which means your smoke lineups need to be quick to line up under pressure rather than technically impressive.',
      'A-site market smoke from spawn covers the single most contested angle on the map and takes under two seconds to line up from a fixed spawn position.',
      'On B site, a single smoke on generator removes the most common retake angle without needing a second controller ability to back it up.',
      'Practice these in the range until they take less than three seconds from ability-press to confirmed line — anything slower and you are giving away the executes timing.',
    ],
  },
]

export function getGuideById(id) {
  return guides.find((g) => g.id === id)
}

export function getFeaturedGuide() {
  return guides.find((g) => g.featured) || guides[0]
}

export function getRelatedGuides(guide, limit = 2) {
  return guides.filter((g) => g.category === guide.category && g.id !== guide.id).slice(0, limit)
}

// Only categories that actually have guides — an empty "Agents" filter with
// zero results isn't useful, so it's left out rather than shown as a dead end.
export function getActiveCategories() {
  const counts = new Map()
  for (const g of guides) counts.set(g.category, (counts.get(g.category) || 0) + 1)
  return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
}

// Maps a skill-matrix skill to the single guide that most directly addresses
// it, used for the personalized "Tactical Gaps Detected" section. Skills with
// no matching guide yet resolve to null rather than a loose/fake match.
const SKILL_TO_GUIDE = {
  'Aim & Mechanics': 'crosshair-codes',
  'Utility Usage': 'smoke-lineups-ascent',
  'Positioning': 'post-plant-bind',
  'Game Sense': 'reading-rotations',
  'Economy Mgmt': 'economy-management',
  'Communication': null,
}

export function getGuideForSkill(skillName) {
  const id = SKILL_TO_GUIDE[skillName]
  return id ? getGuideById(id) : null
}
