import { BrainCircuit, Map, Swords } from 'lucide-react'

// ==========================================================================
// STRATIX Quizzes — data layer
// --------------------------------------------------------------------------
// quizCatalog: the cards rendered on the Quizzes page, in display order.
//   id          unique slug
//   label       card title
//   icon        lucide-react icon component
//   description card copy
//   tagline     short display line on the card, e.g. "Read the round."
//   focus       4 short uppercase-able skill labels shown on the card
//   status      'available' | 'coming-soon'
//   quiz        playable quiz data object (see shape below) — only present
//               when status === 'available'
//
// Quiz data object shape (see gameSenseQuiz below):
//   id               slug
//   title            shown in the modal header + results heading
//   resultTiers      [{ min, message }] sorted high-to-low; the engine
//                    picks the first tier whose `min` the score percent
//                    clears
//   questions        [{
//     id
//     scenarioTitle    short tactical headline, ~4-8 words
//     scenario         the situation, ~25-45 words
//     meta             optional { round?, side?, teamState?, economy? } —
//                      rendered as one compact line, e.g. "Round 01 ·
//                      Attack · 5v5". Omit any field that doesn't apply.
//     question         the decision prompt, short and punchy, e.g.
//                      "WHAT'S YOUR PLAY?" — NOT a restatement of the
//                      scenario
//     options          [{ id, text, isCorrect }] — 2 or 3 short (3-8 word)
//                      decisions, exactly one isCorrect
//     explanation      ~30-50 words, shown after answering
//   }]
//
// To add a new quiz type later: build its data object in this same shape,
// then flip its quizCatalog entry's status to 'available' and point `quiz`
// at it. QuizModal / useQuizEngine need no changes.
// ==========================================================================

export const gameSenseQuiz = {
  id: 'game-sense',
  title: 'Game Sense',
  resultTiers: [
    { min: 90, message: 'Elite game sense. You read rounds the way a shot-caller does.' },
    { min: 70, message: 'Strong game sense. Your reads hold up when it counts.' },
    { min: 50, message: "Developing game sense. The instincts are there — tighten up the reads." },
    { min: 0, message: 'Room to grow. Revisit the explanations below and run it back.' },
  ],
  questions: [
    {
      id: 'gs1',
      scenarioTitle: 'Opening Pick On A Main',
      scenario:
        "You're attacking A Main with a flash and a smoke ready, but no defender has shown yet. The round just started and information is thin.",
      meta: { round: '1', side: 'Attack', teamState: '5v5' },
      question: "WHAT'S YOUR OPENER?",
      options: [
        { id: 'a', text: 'Push in blind on the flash', isCorrect: false },
        { id: 'b', text: 'Smoke first, then flash to peek', isCorrect: true },
        { id: 'c', text: 'Hold until the team stacks', isCorrect: false },
      ],
      explanation:
        'Smoking removes the crossfire before you commit, and the flash then buys a safe peek for information. Pushing blind risks a bad trade with zero read, while holding wastes the tempo your setup already earned.',
    },
    {
      id: 'gs2',
      scenarioTitle: 'Down A Man On Defense',
      scenario:
        "It's 4v5 after an early trade. Your team is stacked on site while you hold a flank alone with a trip down, and the enemy's route through it is still unconfirmed.",
      meta: { side: 'Defense', teamState: '4v5' },
      question: 'HOW DO YOU HOLD THE FLANK?',
      options: [
        { id: 'a', text: 'Push forward hunting a pick', isCorrect: false },
        { id: 'b', text: 'Abandon it and stack site', isCorrect: false },
        { id: 'c', text: 'Hold behind your utility', isCorrect: true },
      ],
      explanation:
        "Down a player, trading for a low-value pick isn't worth the risk, and leaving the flank open for free hands over a route in. Holding behind the trip gives an early warning while keeping you alive for the real fight.",
    },
    {
      id: 'gs3',
      scenarioTitle: 'Reading A Delayed Execute',
      scenario:
        'Defending B, the enemy has default-executed A within 20 seconds for three straight rounds. This round, 25 seconds pass with no contact anywhere on the map.',
      meta: { round: '11', side: 'Defense' },
      question: 'DO YOU TRUST THE PATTERN?',
      options: [
        { id: 'a', text: 'Hold and wait for a real read', isCorrect: true },
        { id: 'b', text: 'Rotate to A on the pattern', isCorrect: false },
      ],
      explanation:
        'A pattern is a hint, not a guarantee — good teams break tendencies specifically to punish early rotations. With no contact yet, leaving your site is a guess. React to real information, not history alone.',
    },
    {
      id: 'gs4',
      scenarioTitle: 'Holding After The Plant',
      scenario:
        "You've planted with 30 seconds left. Two teammates hold crossfires on the likely retake angles, and the enemy has three players still alive and unaccounted for.",
      meta: { round: '18', side: 'Attack', teamState: 'Spike planted' },
      question: "WHAT'S YOUR POST-PLANT CALL?",
      options: [
        { id: 'a', text: 'Hold your crossfires', isCorrect: true },
        { id: 'b', text: 'Push out to hunt kills', isCorrect: false },
      ],
      explanation:
        'With the spike down and time on your side, defenders must come to you. Holding the crossfire forces a bad engagement while the clock runs out — pushing out throws away the advantage the plant already bought.',
    },
    {
      id: 'gs5',
      scenarioTitle: 'Retaking With A Numbers Edge',
      scenario:
        'The spike is on B with 35 seconds left. You have three players alive against two known defenders, but no exact read on where they\'re holding inside the site.',
      meta: { teamState: '3v2', economy: 'Full buy' },
      question: 'HOW DO YOU RETAKE?',
      options: [
        { id: 'a', text: 'Stack one entry together', isCorrect: false },
        { id: 'b', text: 'Split entries behind utility', isCorrect: true },
      ],
      explanation:
        'With a numbers edge, splitting the retake into separate angles stops one crossfire from trading through your whole team. Utility clears the ambiguity first, turning the advantage into a clean take instead of an even fight.',
    },
  ],
}

export const combatIQQuiz = {
  id: 'combat-iq',
  title: 'Combat IQ',
  resultTiers: [
    { min: 90, message: 'Elite combat IQ. You pick fights on your terms, not theirs.' },
    { min: 70, message: 'Strong combat IQ. Most of your engagements are the right ones.' },
    { min: 50, message: "Developing combat IQ. You're fighting more than you need to — slow down." },
    { min: 0, message: 'Room to grow. Revisit the explanations below and run it back.' },
  ],
  questions: [
    {
      id: 'ci1',
      scenarioTitle: 'Two Enemies Holding Together',
      scenario:
        'You peek a corner and see two enemies holding the same angle, both already looking your way. You have no utility left and a full team behind you.',
      meta: { side: 'Attack' },
      question: 'DO YOU TAKE THIS FIGHT?',
      options: [
        { id: 'a', text: 'Peek and try to trade one', isCorrect: false },
        { id: 'b', text: 'Back off and reset the angle', isCorrect: true },
      ],
      explanation:
        "Two set defenders on the same angle beat one attacker with no utility almost every time. Backing off costs nothing but time, while forcing the duel risks a loss for a fight you didn't need to take.",
    },
    {
      id: 'ci2',
      scenarioTitle: 'Approaching A Held Corner',
      scenario:
        'You know an enemy is holding a tight angle on a common corner, and you still have a flash charge left. Your team is ready to push once you clear it.',
      meta: { side: 'Attack' },
      question: 'HOW DO YOU CLEAR IT?',
      options: [
        { id: 'a', text: 'Flash the corner before peeking', isCorrect: true },
        { id: 'b', text: 'Peek wide and out-aim them', isCorrect: false },
      ],
      explanation:
        "With a confirmed hold and utility in hand, flashing first turns a 50/50 duel into a near-free peek. Dry-peeking a defender who's already set gives up the one advantage you actually have available.",
    },
    {
      id: 'ci3',
      scenarioTitle: 'Swinging A Corner Together',
      scenario:
        "You and a teammate are stacked on the same corner with an enemy holding just past it. You both have full HP and there's no time pressure yet.",
      meta: { side: 'Attack' },
      question: 'DO YOU SWING TOGETHER?',
      options: [
        { id: 'a', text: 'Swing together for a clean trade', isCorrect: true },
        { id: 'b', text: 'Send one in, hold the other', isCorrect: false },
      ],
      explanation:
        'Swinging together against one defender guarantees a trade at worst and a clean pick at best, since the second angle appears before they can react. Sending one in alone throws away the numbers advantage you already have.',
    },
    {
      id: 'ci4',
      scenarioTitle: 'Just Lost A Duel Peeking',
      scenario:
        'You peeked an angle, lost the duel, and got no trade. Your teammate is right behind you with the same angle still contested, and the enemy is likely reloading or repositioning.',
      meta: { side: 'Attack' },
      question: 'WHAT SHOULD YOUR TEAMMATE DO?',
      options: [
        { id: 'a', text: 'Immediately repeek the same angle', isCorrect: false },
        { id: 'b', text: 'Hold and let them show first', isCorrect: true },
      ],
      explanation:
        "Repeeking the exact angle that just won a duel plays into a defender who's likely holding that same line, expecting it. Holding forces the enemy to commit to a rotate or a repeek of their own, on worse terms.",
    },
    {
      id: 'ci5',
      scenarioTitle: 'Isolating A Solo Enemy',
      scenario:
        'You spot a single enemy peeking an open lane alone, with no visible support nearby. You have full utility and two teammates close enough to help if it goes wrong.',
      meta: { teamState: 'Even' },
      question: 'HOW DO YOU TAKE THE FIGHT?',
      options: [
        { id: 'a', text: 'Challenge it solo for the pick', isCorrect: false },
        { id: 'b', text: 'Ignore it and rotate elsewhere', isCorrect: false },
        { id: 'c', text: 'Call it and force a 2v1', isCorrect: true },
      ],
      explanation:
        'An isolated enemy with no support is the best fight on the map right now — calling teammates in turns a fair duel into a guaranteed advantage. Taking it solo risks an even trade you never needed, and skipping it wastes a free opportunity.',
    },
  ],
}

export const agentMapIQQuiz = {
  id: 'agent-map-iq',
  title: 'Agent & Map IQ',
  resultTiers: [
    { min: 90, message: 'Elite map sense. You read setups and convert them fast.' },
    { min: 70, message: 'Strong map sense. Your positioning decisions are mostly sound.' },
    { min: 50, message: 'Developing map sense. You know the concepts — apply them faster.' },
    { min: 0, message: 'Room to grow. Revisit the explanations below and run it back.' },
  ],
  questions: [
    {
      id: 'am1',
      scenarioTitle: 'Enemy Duelist Keeps Re-Entering',
      scenario:
        "An enemy Duelist keeps dashing into the site right after your Controller's smoke fades, catching your team resetting. It's happened twice already this half.",
      meta: { side: 'Defense' },
      question: "WHAT'S YOUR ADJUSTMENT?",
      options: [
        { id: 'a', text: 'Keep holding the same angles', isCorrect: false },
        { id: 'b', text: "Pre-aim the smoke's fade timing", isCorrect: true },
      ],
      explanation:
        "Once a pattern like this shows up, holding an angle on where the smoke will fade turns their timing against them. Repeating the same passive hold just lets the same read beat you a third time.",
    },
    {
      id: 'am2',
      scenarioTitle: 'Taking Map Control Mid-Round',
      scenario:
        "Your team just won an early duel in mid with utility still in reserve. The enemy hasn't rotated to contest it yet, and both sites are still fully held.",
      meta: { side: 'Attack', teamState: '5v4' },
      question: "WHAT'S THE PRIORITY NOW?",
      options: [
        { id: 'a', text: 'Hold mid and deny the rotate', isCorrect: true },
        { id: 'b', text: 'Push a site immediately', isCorrect: false },
      ],
      explanation:
        'Converting a mid pick into map control starves one site of defenders before you commit anywhere. Rushing a site immediately gives back the space you just won and lets the enemy reset their setup.',
    },
    {
      id: 'am3',
      scenarioTitle: 'Entering Without Your Initiator',
      scenario:
        "Your Initiator died early this round, and you're the Duelist expected to open the site. You still have your own utility, but no flash or recon support is coming.",
      meta: { side: 'Attack' },
      question: 'HOW DO YOU ENTER?',
      options: [
        { id: 'a', text: 'Enter exactly as planned', isCorrect: false },
        { id: 'b', text: 'Wait for someone else to enter first', isCorrect: false },
        { id: 'c', text: 'Use your own utility to self-clear', isCorrect: true },
      ],
      explanation:
        'Without support, entering on the original plan ignores that your read on the site just got worse. Using your own utility to clear an angle first replaces the missing information, while waiting stalls a round your team needs to open.',
    },
    {
      id: 'am4',
      scenarioTitle: 'Retaking A Site With Unknown Utility',
      scenario:
        "You're retaking a site and know the defenders still have at least one recon or slow utility left, but not which. Your team has full utility and a numbers edge.",
      meta: { teamState: '4v2' },
      question: 'HOW DO YOU APPROACH?',
      options: [
        { id: 'a', text: 'Clear from multiple angles at once', isCorrect: true },
        { id: 'b', text: 'Execute from one entry point', isCorrect: false },
      ],
      explanation:
        "Unknown utility means committing to a single entry risks walking into whatever's left. Clearing from multiple angles forces the defenders to split their attention and burns their remaining utility before you're fully exposed.",
    },
    {
      id: 'am5',
      scenarioTitle: 'Facing A Stacked Site Setup',
      scenario:
        'Scouting shows the enemy has committed four players to one site early, leaving the other one thin. Your team is still full strength with all utility available.',
      meta: { round: '7', teamState: '5v5' },
      question: 'WHERE DO YOU ATTACK?',
      options: [
        { id: 'a', text: 'Hit the stacked site anyway', isCorrect: false },
        { id: 'b', text: 'Attack the thin site immediately', isCorrect: true },
        { id: 'c', text: 'Split even pressure on both', isCorrect: false },
      ],
      explanation:
        'A four-player commit to one site leaves the other close to undefended — attacking there converts the read into a fast, low-risk site take. Hitting the stacked site fights their strength on purpose, and splitting evenly wastes the numbers advantage you just found.',
    },
  ],
}

export const quizCatalog = [
  {
    id: 'game-sense',
    label: 'Game Sense',
    icon: BrainCircuit,
    description: 'Read the round — rotations, timing, trades, and when to commit.',
    tagline: 'Read the round.',
    focus: ['Rotations', 'Timing', 'Trades', 'Information'],
    status: 'available',
    quiz: gameSenseQuiz,
  },
  {
    id: 'combat-iq',
    label: 'Combat IQ',
    icon: Swords,
    description: 'Fight selection and decision-making — when to peek, hold, or pull out.',
    tagline: 'Win the right fights.',
    focus: ['Peeks', 'Duels', 'Movement', 'Utility'],
    status: 'available',
    quiz: combatIQQuiz,
  },
  {
    id: 'agent-map-iq',
    label: 'Agent & Map IQ',
    icon: Map,
    description: 'Utility, site control, and positioning across agents and maps.',
    tagline: 'Use the map intelligently.',
    focus: ['Utility', 'Positioning', 'Site control', 'Adaptation'],
    status: 'available',
    quiz: agentMapIQQuiz,
  },
]
