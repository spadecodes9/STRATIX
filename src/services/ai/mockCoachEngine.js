import {
  CATEGORIES,
  getCategoryById,
  resolveRecommendation,
  getGeneralTip,
  getGeneralFollowUp,
  categoryForSkill,
} from '../../data/coachKnowledge.js'

const INTRO_OPENERS = [
  (label) => `Let's dig into ${label.toLowerCase()}.`,
  (label) => `Good area to work on — ${label.toLowerCase()}.`,
  (label) => `Here's how I'd think about ${label.toLowerCase()}.`,
]

const CONTINUATION_OPENERS = [
  'Building on that —',
  'Following up on the same thread —',
  'Staying on this for a second —',
]

const REPEAT_OPENERS = [
  (label) => `Back to ${label.toLowerCase()} — here's another angle.`,
  (label) => `More on ${label.toLowerCase()}:`,
]

function detectCategory(lowerText) {
  let best = null
  let bestScore = 0
  for (const category of CATEGORIES) {
    const score = category.keywords.filter((k) => lowerText.includes(k)).length
    if (score > bestScore) {
      bestScore = score
      best = category.id
    }
  }
  return best
}

function countCategoryOccurrences(history, categoryId) {
  return history.filter((m) => m.role === 'coach' && m.category === categoryId).length
}

function countCoachMessages(history) {
  return history.filter((m) => m.role === 'coach').length
}

function buildSkillLine(user, skillKey) {
  const entry = user?.skillMatrix?.find((s) => s.skill === skillKey)
  if (!entry) return null
  const { score } = entry
  let tail
  if (score >= 75) tail = `solid, so this is more about refinement than fundamentals`
  else if (score >= 60) tail = `decent, but there's real room to close the gap`
  else tail = `your lowest-leverage skill right now — small gains here tend to move rank fastest`
  return `Your ${skillKey} score is ${score} — ${tail}.`
}

function pickFrom(list, index) {
  return list[index % list.length]
}

function buildCategoryReply({ categoryId, user, history, isContinuation }) {
  const category = getCategoryById(categoryId)
  const occurrences = countCategoryOccurrences(history, categoryId)

  const tip1 = pickFrom(category.tips, occurrences)
  const tip2 = pickFrom(category.tips, occurrences + 1)
  const points = tip1 === tip2 ? [tip1] : [tip1, tip2]

  const skillLine = category.skillKey ? buildSkillLine(user, category.skillKey) : null

  let intro
  if (isContinuation) {
    intro = pickFrom(CONTINUATION_OPENERS, occurrences)
  } else if (occurrences === 0) {
    intro = pickFrom(INTRO_OPENERS, 0)(category.label)
  } else {
    intro = pickFrom(REPEAT_OPENERS, occurrences)(category.label)
  }
  if (skillLine && occurrences === 0) {
    intro = `${intro} ${skillLine}`
  }

  if (category.noDirectResource && occurrences === 0) {
    points.push("Heads up — STRATIX doesn't have a dedicated movement module published yet, so I'm pointing you at the closest available content for now.")
  }

  const recommendation = resolveRecommendation(categoryId, user)

  // Stop interrogating after a couple of follow-ups on the same topic.
  const askFollowUp = occurrences < 2
  const followUp = askFollowUp ? pickFrom(category.followUps, occurrences) : null

  return { category: categoryId, intro, points, recommendation, followUp }
}

function buildGeneralReply({ user, history }) {
  const weakest = [...(user?.skillMatrix || [])].sort((a, b) => a.score - b.score)[0]
  const linkedCategoryId = weakest ? categoryForSkill(weakest.skill) : null
  const coachTurn = countCoachMessages(history)

  const intros = [
    "That's outside anything I can pattern-match precisely as a mock preview, but here's something genuinely useful regardless:",
    "Good question — I can't reason about the specifics yet in this preview, but here's a relevant starting point:",
    "I don't have a canned answer built for that exact phrasing, but this is worth knowing either way:",
  ]
  let intro = pickFrom(intros, coachTurn)

  if (weakest) {
    intro += ` Since your ${weakest.skill} score (${weakest.score}) is your lowest right now, most of your rank gains this month will probably come from there.`
  }

  const points = [getGeneralTip(coachTurn)]
  const recommendation = linkedCategoryId ? resolveRecommendation(linkedCategoryId, user) : null
  const followUp = getGeneralFollowUp(coachTurn)

  return { category: 'general', intro, points, recommendation, followUp }
}

/**
 * Builds a full mock reply. Kept as a pure function of (history, userText, user)
 * so it's trivial to unit test or replace — see coachService.js for the seam
 * where a real model would plug in instead.
 */
export function generateCoachReply({ history, userText, user }) {
  const lower = userText.toLowerCase()
  let categoryId = detectCategory(lower)
  let isContinuation = false

  if (!categoryId) {
    const lastCoachMsg = [...history].reverse().find((m) => m.role === 'coach' && m.category)
    if (lastCoachMsg && lastCoachMsg.category !== 'general') {
      categoryId = lastCoachMsg.category
      isContinuation = true
    }
  }

  if (!categoryId) {
    return buildGeneralReply({ user, history })
  }

  return buildCategoryReply({ categoryId, user, history, isContinuation })
}
