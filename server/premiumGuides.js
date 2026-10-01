// Premium guide bodies — SERVER ONLY. Never import this from src/: it must not
// ship in the client bundle. Served by GET /api/guides/:id/content after the
// server verifies the session and Premium entitlement (server/premium.js).
// Card metadata (title, excerpt, tags, premium: true) stays in src/data/guides.js.
export const PREMIUM_GUIDE_CONTENT = {
  "breaking-enemy-defaults": {
    "whyItMatters": "Most defenses fall back on a consistent default positioning when they don't have strong information. Recognizing that default and specifically attacking its weak points is one of the highest-value reads a team can make.",
    "coreConcept": "A default is built around covering the most common attack paths with the least risk — which means it usually has at least one area that's lightly watched or slow to reinforce. Breaking the default means identifying and exploiting that gap rather than attacking head-on.",
    "steps": [
      "Watch for patterns in where the enemy holds when they have no information — this is their default.",
      "Identify the area of the default that's most lightly covered or slowest to reinforce.",
      "Use fake executes or utility to bait the default into committing before your real push, rather than attacking it directly.",
      "Vary your own attack patterns round to round so the enemy can't build a counter-default against you.",
      "Debrief as a team after rounds where the default held — figure out whether it was a good read by the enemy or a predictable mistake on your side."
    ],
    "whenToUseIt": "This is most valuable in the middle rounds of a half, once your team has seen enough defensive setups to recognize a pattern, and especially against opponents who don't seem to be adjusting their default round to round.",
    "commonMistakes": [
      "Attacking the same 'weak point' every round once it's found, letting the enemy adjust their default against you.",
      "Committing to breaking a default without a fake or feint, walking straight into the strongest part of it instead.",
      "Failing to notice when the enemy has already adjusted their default in response to your reads."
    ],
    "example": "You've noticed the enemy defense consistently under-commits to one flank when they have no info. Instead of hitting it directly every round, you fake toward it with utility to bait a rotation, then execute the actual site through the space that rotation vacates.",
    "drill": "Track the enemy's default setup for the first three rounds of a half before committing to any exploit — patterns take a few reps to confirm.",
    "takeaway": "A default is a compromise, not a perfect answer — find its weak point and attack it indirectly before the enemy adjusts."
  },
  "decision-making-under-pressure": {
    "whyItMatters": "In high-pressure moments — a 1vX clutch, match point, a must-win round — players often abandon sound fundamentals in favor of desperate, low-percentage plays. The skill gap in clutch situations is usually decision-making, not mechanics.",
    "coreConcept": "Pressure narrows attention and pushes toward action for its own sake. Staying with slow, information-based decision-making — the same process you'd use in a normal round — usually outperforms the instinct to force something dramatic.",
    "steps": [
      "Slow down your information-gathering specifically in high-pressure moments, since the instinct is to speed up and gather less.",
      "Isolate one opponent at a time rather than trying to solve the whole situation at once.",
      "Use the same crosshair placement and pre-aim habits you'd use in any other round — pressure doesn't change what wins a duel.",
      "Play for time when the situation allows it (spike timer, remaining round time) rather than forcing an immediate resolution.",
      "Accept that some clutch situations are genuinely low-percentage — playing them out with sound decisions is still better than a low-percentage all-in."
    ],
    "whenToUseIt": "This applies specifically to 1vX situations, match points, and any moment where the outcome of a single round carries unusually high stakes.",
    "commonMistakes": [
      "Rushing decisions specifically because the moment feels high-pressure, gathering less information than usual.",
      "Trying to fight multiple remaining enemies at once instead of isolating them one at a time.",
      "Abandoning normal aim fundamentals in favor of a panicked flick-and-pray."
    ],
    "example": "You're in a 1v2 with the spike planted and time on your side. Instead of rushing to find both enemies immediately, you use sound and patience to isolate one at a time — the same discipline you'd use in an even round — and the situation resolves in your favor because you didn't add unnecessary risk.",
    "drill": "Practice 1vX scenarios in customs specifically focusing on maintaining normal pre-aim and pacing habits, rather than optimizing for speed alone.",
    "takeaway": "Pressure changes how a situation feels, not what actually wins it — the same fundamentals that work in a normal round work here too."
  }
}
