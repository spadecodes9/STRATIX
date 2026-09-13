export const categories = ['Mechanics', 'Utility', 'Strategy', 'Mental Game']
export const difficulties = ['Beginner', 'Intermediate', 'Advanced']

export const courses = [
  {
    id: 'aim-fundamentals',
    title: 'Aim Fundamentals',
    tagline: 'Build a mechanical foundation that holds up under pressure.',
    category: 'Mechanics',
    difficulty: 'Beginner',
    duration: '3h 20m',
    instructor: 'Coach Vex',
    accent: 'red',
    modules: [
      {
        id: 'm1',
        title: 'Crosshair Placement',
        lessons: [
          { id: 'l1', title: 'Crosshair Placement Basics', type: 'video', duration: '9m' },
          { id: 'l2', title: 'Pre-Aiming Common Angles', type: 'video', duration: '11m' },
          { id: 'l3', title: 'Drill: Angle Isolation', type: 'drill', duration: '15m' },
        ],
      },
      {
        id: 'm2',
        title: 'Sensitivity & Settings',
        lessons: [
          { id: 'l4', title: 'Finding Your eDPI', type: 'reading', duration: '6m' },
          { id: 'l5', title: 'Crosshair Codes That Work', type: 'reading', duration: '5m' },
        ],
      },
      {
        id: 'm3',
        title: 'Flicking vs. Tracking',
        lessons: [
          { id: 'l6', title: 'When to Flick, When to Track', type: 'video', duration: '10m' },
          { id: 'l7', title: 'Drill: Reflex Flicks', type: 'drill', duration: '15m' },
          { id: 'l8', title: 'Drill: Sustained Tracking', type: 'drill', duration: '15m' },
        ],
      },
    ],
  },
  {
    id: 'advanced-utility-usage',
    title: 'Advanced Utility Usage',
    tagline: 'Turn your kit into map control instead of wasted cooldowns.',
    category: 'Utility',
    difficulty: 'Intermediate',
    duration: '4h 05m',
    instructor: 'Coach Iso',
    accent: 'red',
    modules: [
      {
        id: 'm1',
        title: 'Smoke Lineups',
        lessons: [
          { id: 'l_smoke_intro', title: 'Smoke Lineups: Site Executes', type: 'video', duration: '13m' },
          { id: 'l_smoke_timings', title: 'Smoke Timings for Retakes', type: 'video', duration: '12m' },
        ],
      },
      {
        id: 'm2',
        title: 'Info-Gathering Utility',
        lessons: [
          { id: 'l_info_1', title: 'Recon Before You Peek', type: 'video', duration: '10m' },
          { id: 'l_info_2', title: 'Drill: Utility-First Entries', type: 'drill', duration: '18m' },
        ],
      },
      {
        id: 'm3',
        title: 'Trading Utility Between Rounds',
        lessons: [
          { id: 'l_trade_1', title: 'Economy-Aware Utility Usage', type: 'reading', duration: '7m' },
        ],
      },
    ],
  },
  {
    id: 'map-control-mastery',
    title: 'Map Control Mastery',
    tagline: 'Win the fight for space before the fight for the site.',
    category: 'Strategy',
    difficulty: 'Intermediate',
    duration: '3h 45m',
    instructor: 'Coach Vex',
    accent: 'red',
    modules: [
      {
        id: 'm1',
        title: 'Mid-Round Map Reads',
        lessons: [
          { id: 'l_map_1', title: 'Reading Rotations From Sound Cues', type: 'video', duration: '11m' },
          { id: 'l_map_2', title: 'Default Setups Per Map', type: 'reading', duration: '9m' },
        ],
      },
      {
        id: 'm2',
        title: 'Trading Space for Time',
        lessons: [
          { id: 'l_map_3', title: 'Slow Executes vs Fast Executes', type: 'video', duration: '12m' },
          { id: 'l_map_4', title: 'Drill: Space-Trading Scenarios', type: 'drill', duration: '20m' },
        ],
      },
    ],
  },
  {
    id: 'immortal-mindset',
    title: 'Immortal Mindset: The Mental Game',
    tagline: 'Tilt-proof your climb through Diamond and beyond.',
    category: 'Mental Game',
    difficulty: 'Advanced',
    duration: '2h 30m',
    instructor: 'Coach Nyra',
    accent: 'red',
    modules: [
      {
        id: 'm1',
        title: 'Emotional Regulation In-Game',
        lessons: [
          { id: 'l_mind_1', title: 'The 10-Second Reset', type: 'video', duration: '8m' },
          { id: 'l_mind_2', title: 'Reframing a Lost Pistol Round', type: 'reading', duration: '6m' },
        ],
      },
      {
        id: 'm2',
        title: 'Focus & Consistency',
        lessons: [
          { id: 'l_mind_3', title: 'Pre-Match Warmup Routines', type: 'video', duration: '9m' },
        ],
      },
    ],
  },
  {
    id: 'entry-fragging-masterclass',
    title: 'Entry Fragging Masterclass',
    tagline: 'First contact, first blood — on purpose, not by luck.',
    category: 'Strategy',
    difficulty: 'Advanced',
    duration: '3h 10m',
    instructor: 'Coach Iso',
    accent: 'red',
    modules: [
      {
        id: 'm1',
        title: 'Timing the Entry',
        lessons: [
          { id: 'l_entry_1', title: 'Utility-Synced Entries', type: 'video', duration: '10m' },
          { id: 'l_entry_2', title: 'Drill: First-Contact Reactions', type: 'drill', duration: '16m' },
        ],
      },
    ],
  },
  {
    id: 'igl-shotcalling',
    title: 'IGL & Shotcalling Fundamentals',
    tagline: 'Turn five individuals into one decision-making unit.',
    category: 'Strategy',
    difficulty: 'Advanced',
    duration: '4h 40m',
    instructor: 'Coach Nyra',
    accent: 'red',
    modules: [
      {
        id: 'm1',
        title: 'Calling Structure',
        lessons: [
          { id: 'l_igl_1', title: 'Set Plays vs Reactive Calls', type: 'video', duration: '13m' },
          { id: 'l_igl_2', title: 'Building a Round-Start Default', type: 'reading', duration: '8m' },
        ],
      },
    ],
  },
]

export function getCourseById(id) {
  return courses.find((c) => c.id === id)
}

export function getLessonById(courseId, lessonId) {
  const course = getCourseById(courseId)
  if (!course) return null
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId)
    if (lesson) return { lesson, module: mod, course }
  }
  return null
}

export function getAllLessonsFlat(course) {
  return course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })))
}

/**
 * Given a course id and a completion percent (0-100), returns the next lesson
 * the player hasn't reached yet — same "completed count" math CourseDetail.jsx
 * uses to mark lessons done, factored out so other features (like the AI Coach)
 * can point at a real "next lesson" instead of guessing.
 */
export function getNextIncompleteLesson(courseId, progressPercent = 0) {
  const course = getCourseById(courseId)
  if (!course) return null
  const flat = getAllLessonsFlat(course)
  if (flat.length === 0) return null
  const completedCount = Math.round((progressPercent / 100) * flat.length)
  const lesson = flat[completedCount] || flat[flat.length - 1]
  return { ...lesson, courseId }
}
