export const suggestedPrompts = [
  'Why do I keep losing my crosshair after a peek?',
  'How should I play retakes with only 2 utility?',
  'Review my last course progress and suggest what to study next',
  'Give me a warmup routine before ranked queue',
]

export const seedConversation = [
  {
    id: 'm1',
    role: 'coach',
    text: "I'm your AI Coach — a mock preview for now, so responses are pre-written rather than generated live. Ask about aim, utility, positioning, or your recent course progress and I'll point you somewhere useful.",
  },
]

// Very simple keyword-matched canned replies so the mock feels responsive.
const canned = [
  {
    keywords: ['crosshair', 'aim', 'flick'],
    reply:
      "Your skill matrix shows Aim & Mechanics at 78 — solid, but crosshair discipline after peeking is usually a placement habit, not a reflex one. The Crosshair Placement Basics lesson in Aim Fundamentals covers pre-aiming common angles, which is the fix for losing your crosshair mid-peek.",
  },
  {
    keywords: ['retake', 'utility', 'smoke'],
    reply:
      "With limited utility on a retake, prioritize information over damage — a single recon-style ability before you commit tells you where to trade, not just where to peek. Smoke Timings for Retakes in Advanced Utility Usage is your Recommended Next Lesson for exactly this.",
  },
  {
    keywords: ['progress', 'course', 'next', 'study'],
    reply:
      "You're 60% through Advanced Utility Usage and your lowest skill area is Positioning at 57. Once you finish your current course, Map Control Mastery lines up well with closing that gap.",
  },
  {
    keywords: ['warmup', 'routine', 'ranked'],
    reply:
      "A short, boring warmup beats a long, exciting one. 5 minutes of tracking drills, 5 minutes of flick drills, then 2-3 deathmatch rounds focused purely on crosshair placement rather than kill count.",
  },
]

const fallback =
  "That's outside my mock preview scope for now — try asking about aim, utility usage, retakes, or your course progress."

export function getMockCoachReply(userText) {
  const lower = userText.toLowerCase()
  const match = canned.find((c) => c.keywords.some((k) => lower.includes(k)))
  return match ? match.reply : fallback
}
