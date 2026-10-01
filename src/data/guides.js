// ==========================================================================
// STRATIX Guides — data layer
// --------------------------------------------------------------------------
// A curated library: exactly five guides per category, each category ordered
// beginner → beginner → intermediate → intermediate → advanced. Keep it that
// way — replace a guide rather than appending a sixth.
//
// Schema (per guide):
//   id            unique slug, used in routing (/guides/:id) — never rename
//                 an existing id, it's referenced by SKILL_TO_GUIDE below
//   title         card + detail headline
//   category      one of the GUIDE_CATEGORIES keys below
//   difficulty    one of the DIFFICULTIES keys below
//   premium       true = Premium guide: NO `content` here. The body lives in
//                 server/premiumGuides.js and is only returned by the API
//                 after a server-side entitlement check.
//   featured      optional true — exactly one guide should have this
//   excerpt       1-2 sentence card description
//   updated       ISO date string
//   tags          short chips shown on the detail page + used in search
//   maps          optional array of map names this guide is specific to
//   topics        optional search-only synonyms (not displayed)
//   content       (free guides only) structured teaching object, rendered by GuideDetail.jsx:
//                   whyItMatters   string
//                   coreConcept    string
//                   steps          string[]   ("STEP-BY-STEP")
//                   whenToUseIt    string
//                   commonMistakes string[]
//                   example        string     (in-game scenario)
//                   drill          string     (optional practice drill)
//                   takeaway       string     (quick takeaway)
// ==========================================================================

// Display order of the library sections.
export const GUIDE_CATEGORIES = [
  { key: 'maps', label: 'Maps' },
  { key: 'weapons', label: 'Weapons & Aim' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'utility', label: 'Utility' },
  { key: 'mental-game', label: 'Mental Game' },
]

export const DIFFICULTIES = [
  { key: 'beginner', label: 'Beginner', tier: 1 },
  { key: 'intermediate', label: 'Intermediate', tier: 2 },
  { key: 'advanced', label: 'Advanced', tier: 3 },
]

export const guides = [
  // -------------------------------------------------------- MAPS
  {
    id: 'map-layouts-callouts',
    title: 'Reading Map Layouts & Callouts',
    category: 'maps',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      'Learn how to read a map, understand important areas, and communicate useful information quickly.',
    updated: '2026-09-24',
    tags: ['Callouts', 'Communication', 'Map Knowledge'],
    topics: ['comms', 'minimap', 'layout'],
    content: {
      whyItMatters:
        "Every piece of information your team shares depends on everyone picturing the same spot. A vague 'he's over there' costs a teammate the half-second they needed; a precise callout turns your death into their free kill.",
      coreConcept:
        'Every map breaks down into the same building blocks: sites, the chokes that feed them, a mid (or the lack of one), and the rotation paths connecting them. Learn a map as those blocks first, then attach the official callout names to them — a layout you understand is far easier to communicate than a list of names you memorised.',
      steps: [
        'Open the map in a custom game and walk each attacker route from spawn to both sites.',
        'Identify every choke that feeds a site — these are where most fights and callouts happen.',
        "Learn the callout names on the loading screen minimap before you queue, not while you're dying.",
        'Call in a fixed order: location first, then number of enemies, then health or utility used.',
        'Keep callouts short enough to finish before the next fight starts — three words beats a sentence.',
      ],
      whenToUseIt:
        "Every round on every map — but invest the most on maps you're newest to, where your team is most likely to misread a vague callout.",
      commonMistakes: [
        'Using made-up names that only you understand instead of the in-game callouts.',
        "Talking during a teammate's clutch instead of staying quiet until it matters.",
        'Calling what you felt ("he\'s cracked") instead of what you saw (position, count, health).',
      ],
      example:
        "You die on B Main to two players. Instead of 'two B', you call 'two B Main, one lit 40, Sova dart used' — your rotating teammate now knows exactly which angle to clear first and that the recon is already spent.",
      drill:
        'Before each session, open one map in a custom and say every callout out loud as you walk it. Five minutes per map is enough to stop freezing mid-round.',
      takeaway:
        'A callout is only as good as the shared picture behind it — learn the layout, then name it the same way your team does.',
    },
  },
  {
    id: 'holding-sites',
    title: 'Holding Sites Without Overextending',
    category: 'maps',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      'Learn how to defend space without giving away unnecessary fights or losing control of your site.',
    updated: '2026-09-24',
    tags: ['Defense', 'Positioning', 'Site Hold'],
    topics: ['anchor', 'overextend', 'defending'],
    content: {
      whyItMatters:
        "Most lost defensive rounds don't start with a failed hold — they start with a defender who pushed for a pick, died alone, and left a site one player short. Holding well is mostly about not giving away free fights.",
      coreConcept:
        'Your job on defense is to delay and inform, not to win every duel. Pick a position that sees the entry, has a safe fallback, and can be traded by a teammate. If a position has no escape route and no trade, it is a gamble, not a hold.',
      steps: [
        'Choose an off-angle that sees the entry point without being the first spot attackers pre-aim.',
        'Know your fallback before the round starts — where you go after your first shot or first utility.',
        'Play near enough to a teammate that your death can be traded.',
        'Use utility to slow the push before you peek, not after you are already in the fight.',
        'Call early and fall back instead of re-peeking the same angle once you are spotted.',
      ],
      whenToUseIt:
        'Every defensive round — especially when you are the lone anchor on a site and your survival decides whether a retake is even possible.',
      commonMistakes: [
        'Pushing for early picks with no information and no teammate nearby to trade.',
        'Re-peeking the same angle after getting a kill, when the next attacker is already pre-aiming it.',
        'Holding a position so deep on site that the attackers get the entry for free.',
      ],
      example:
        'You anchor B alone. You hear a rush, throw your slow, take one shot from your off-angle, then fall back toward your rotating teammate instead of re-peeking. The attackers take the site — but they lose two players and the clock doing it, and your retake is 2v3 instead of 0v4.',
      drill:
        'For one defensive half, set yourself a rule: never peek without either utility or a teammate able to trade you. Note how many rounds you are still alive at the 30-second mark.',
      takeaway:
        "A good hold wastes the attackers' time and players — staying alive is part of the job, not a failure to make plays.",
    },
  },
  {
    id: 'mid-control',
    title: 'Mid Control: Why It Matters',
    category: 'maps',
    difficulty: 'intermediate',
    premium: false,
    excerpt:
      'Understand how controlling the middle of a map creates safer rotations and more attacking options.',
    updated: '2026-09-24',
    tags: ['Map Control', 'Mid', 'Rotations'],
    topics: ['rotation', 'rotations', 'map control', 'flank'],
    content: {
      whyItMatters:
        'On most maps, mid is the shortest link between both sites. Whoever controls it rotates faster, can threaten either site, and forces the other team to guess. Losing mid early usually means playing the rest of the round reactively.',
      coreConcept:
        "Mid control isn't about standing in the middle of the map — it's about owning the sightlines that reveal or deny rotations. Once you have them, mid becomes leverage: a way to split the defense or cut off their retake path.",
      steps: [
        'Send information utility into mid before committing a player to it.',
        'Take space slowly — a jiggle-peek that gets info is worth more than a wide peek that dies.',
        'Once mid is yours, use it to pressure the back of a site rather than just walking through it.',
        'If mid is contested, trade cleanly instead of sending a second player into the same angle.',
        'Smoke off mid sightlines the moment your team commits to a site so rotations are blocked.',
      ],
      whenToUseIt:
        'Most valuable on maps with a real mid (Ascent, Split, Pearl, Sunset) and on pistol or eco rounds, when contesting it is cheap and the information payoff is large.',
      commonMistakes: [
        'Fighting for mid with no plan for what to do once you have it.',
        'Burning utility on mid in rounds where the team is not going to use the control.',
        'Taking mid, then leaving it — letting the enemy walk it back for free.',
      ],
      example:
        'Your team wins the opening mid duel on Ascent. Instead of rushing straight into A, you hold Mid Top and Market, denying the defense any rotation — your other three hit B against a defense that cannot reinforce in time.',
      drill:
        'Review five of your own rounds and note which team controlled mid at the 40-second mark. It predicts the round winner more reliably than you would expect.',
      takeaway:
        'Mid is not a destination, it is leverage — take it to decide where the enemy has to guess.',
    },
  },
  {
    id: 'post-plant-and-retakes',
    title: 'Post-Plant Setups & Retakes',
    category: 'maps',
    difficulty: 'intermediate',
    premium: false,
    excerpt:
      'Build stronger post-plant positions and understand when to hold, reposition, or retake.',
    updated: '2026-09-24',
    tags: ['Post-plant', 'Retake', 'Site Hold'],
    topics: ['crossfire', 'defuse', 'plant'],
    content: {
      whyItMatters:
        'A plant means nothing if the site falls a few seconds later, and a retake means nothing if it walks into a set-up crossfire. Both sides of the spike are won by the team that uses position and time better, not the one with better aim.',
      coreConcept:
        'After the plant, cover the paths to the spike — not the spike itself — from angles the retake cannot see from where they enter. On a retake, flip it: gather information on those angles first, then enter from more than one direction at once.',
      steps: [
        'After planting, move off site to a position that watches an entry path rather than the spike.',
        'Split coverage with a teammate so you are not both watching the same entrance.',
        'On a retake, use recon or sound to find how many defenders are left and roughly where.',
        'Enter the site from two directions at the same time to break the crossfire.',
        'Save one piece of utility for the defuse window — for either side, it decides the round.',
      ],
      whenToUseIt:
        'Every post-plant and every retake — most critically when the other team has had time to set up, and every second you spend guessing helps them.',
      commonMistakes: [
        'Standing on the spike after planting, where every retaker already knows to look.',
        'Retaking through one choke, straight into the crossfire the post-plant was built for.',
        'Using all utility on the initial push and having nothing left to protect the defuse.',
      ],
      example:
        'You plant A with one teammate alive. Instead of holding the spike, you fall back to a side angle while your teammate watches the other entrance. The retake has to clear two positions before they can even see the spike, and the clock runs out on them.',
      drill:
        'In customs, practise planting and reaching a post-plant position within three seconds, every round, until it is automatic. Then swap sides and practise two-direction retakes.',
      takeaway:
        'After the plant, time is on your side — spend it covering paths. On a retake, spend it gathering information before you commit.',
    },
  },
  {
    id: 'reading-rotations',
    title: 'Reading Rotations & Taking Space',
    category: 'maps',
    difficulty: 'advanced',
    premium: false,
    featured: true,
    excerpt: 'Learn to recognize rotation patterns and convert map control into meaningful space.',
    updated: '2026-09-24',
    tags: ['Game Sense', 'Rotations', 'Map Control'],
    topics: ['audio', 'sound', 'space', 'lurk'],
    content: {
      whyItMatters:
        'Every rotation makes noise and leaves space behind it. The players who climb fastest notice both: they read where the enemy is going, and they immediately take the ground the enemy just gave up.',
      coreConcept:
        "Footstep direction and ability sounds tell you the rotation path; timing tells you whether it's real. Once a rotation is confirmed, the space it vacates is free — a player who walks into it can flank, cut off the retake, or pressure a now-empty site.",
      steps: [
        'Track footstep direction first, volume second — the path matters more than the distance.',
        'Weight ability sounds heavily: a smoke or flash on the far side usually commits a whole unit.',
        'Cross-reference with the round timer — the same sound means something different at 1:30 than at 0:30.',
        'When a rotation is confirmed, move a player into the space it left instead of just following it.',
        'Call rotations as probabilities ("likely B, two players") so the team can act before full confirmation.',
      ],
      whenToUseIt:
        'Every round, but it is most decisive in the first 20–30 seconds and right after a site hit, when the enemy is moving and the map is most open.',
      commonMistakes: [
        'Treating every single sound as a full rotation and whiplashing the team between sites.',
        'Reading the rotation correctly but never taking the space it opened.',
        "Staying silent about a read you're not 100% sure of instead of sharing it as a probability.",
      ],
      example:
        "You hear two players and a smoke moving toward B. You call 'rotating B, sounds committed', and instead of following them, you push through the mid they just abandoned — you arrive behind their retake while your team holds the site.",
      drill:
        'In your next ten matches, call one rotation per round from sound alone before the minimap confirms it, and note what space it left open.',
      takeaway:
        'A rotation tells you where the enemy is going — and where they no longer are. Read the first, then take the second.',
    },
  },

  // ----------------------------------------------- WEAPONS & AIM
  {
    id: 'crosshair-codes',
    title: 'Crosshair Settings That Actually Help',
    category: 'weapons',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      'Build a clean crosshair setup that improves visual information instead of distracting you.',
    updated: '2026-07-30',
    tags: ['Settings', 'Crosshair', 'Beginner'],
    content: {
      whyItMatters:
        "A crosshair has one job: tell you exactly where your bullets go without covering the thing you're trying to shoot. Everything else — color, outlines, center dot — is secondary to that.",
      coreConcept:
        "Good crosshair settings reduce visual clutter and maximize contrast against VALORANT's environments, so the pixel you need to see stays visible instead of being covered by your own UI.",
      steps: [
        "Keep the crosshair small enough that it doesn't obscure a head at mid-to-long range.",
        'Choose an outline color that contrasts with common backgrounds — cyan or green typically stand out better than white against smoke and sky.',
        "Test your crosshair against a smoke cloud specifically, since that's where visibility usually breaks down.",
        'Turn off the center dot if you rely on tracking rather than flicking, since it reduces clutter during sustained spray control.',
        "Save your settings as a code once you're happy, so you're never rebuilding it from scratch on a new account or PC.",
      ],
      whenToUseIt:
        'Revisit your crosshair any time you change monitors or resolution — contrast and apparent size can shift enough to matter.',
      commonMistakes: [
        'Using a large, thick cross that blocks the exact spot you need to see.',
        'Picking a color that looks good in the menu but disappears against in-game backgrounds.',
        "Copying a pro's exact crosshair without testing whether it suits your own aiming style.",
      ],
      example:
        "You've been missing headshots that felt like they should've landed. After shrinking your crosshair and switching from white to cyan, you realize several of those 'misses' were actually your own crosshair outline covering the target's head.",
      drill:
        "Spend five minutes in the range with a smoke grenade popped, checking your crosshair's visibility against it at several distances.",
      takeaway:
        'Your crosshair should disappear into the game except for the one pixel that matters — optimize for information, not aesthetics.',
    },
  },
  {
    id: 'first-bullet-accuracy',
    title: 'Why Your First Bullet Should Always Count',
    category: 'weapons',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      'Understand first-shot accuracy, discipline, and why unnecessary movement costs fights.',
    updated: '2026-08-14',
    tags: ['Accuracy', 'Spray Control', 'Fundamentals'],
    content: {
      whyItMatters:
        "VALORANT's gunplay is built around precision — your first bullet, fired while standing still or after your movement has stopped, is far more accurate than bullets fired while moving. Ignoring this single mechanic costs more duels than any aim-training gap.",
      coreConcept:
        "Every weapon has a period where firing while moving spreads your bullets wide, and a moment where stopping resets you to full accuracy. Winning duels consistently means managing your own movement so your first shot lands where you're aiming.",
      steps: [
        'Counter-strafe or stop moving briefly before taking your first shot in a duel, rather than firing mid-run.',
        'In close-range duels, a stationary first shot often beats a moving spray, even against a faster-reacting opponent.',
        "Practice recognizing the moment your movement has 'settled' so stopping becomes automatic rather than a conscious pause.",
        'When you must fire while moving, expect the first bullet to miss and adjust your tactics accordingly.',
        'Combine this with crosshair placement: a perfectly placed crosshair fired while moving still loses to a slightly worse placement fired while stopped.',
      ],
      whenToUseIt:
        'This matters most in medium-to-long range duels, where movement spread has the biggest visible impact. Very close-range fights are more forgiving, but the habit still helps.',
      commonMistakes: [
        'Full-sprinting into a duel and firing immediately without settling.',
        'Assuming spray control alone compensates for a wide-open first bullet.',
        'Over-correcting into standing completely still for too long, becoming an easy target instead.',
      ],
      example:
        "You round a corner at full sprint and open fire immediately — your shots spray past the target's head despite good crosshair placement. The next duel, you tap a quick stop as you round the same corner, and your first bullet lands clean.",
      drill:
        "In the range, practice strafing into cover, stopping, and firing a single precise shot as fast as possible — build the stop-then-shoot rhythm until it's instinctive.",
      takeaway:
        'A stopped first bullet beats a moving spray almost every time — manage your movement before you manage your aim.',
    },
  },
  {
    id: 'vandal-vs-phantom',
    title: 'Vandal vs. Phantom: Choosing Your Rifle',
    category: 'weapons',
    difficulty: 'intermediate',
    premium: false,
    excerpt:
      'Learn how weapon characteristics affect fights and when each rifle fits your situation.',
    updated: '2026-08-06',
    tags: ['Rifles', 'Loadout', 'Decision Making'],
    content: {
      whyItMatters:
        "The Vandal and Phantom are VALORANT's two full-auto rifles, and the choice between them shapes how you play a round more than most players realize — it's not just a cosmetic preference.",
      coreConcept:
        "The Vandal is a one-shot headshot kill at any range with no damage falloff, but it's louder and shows visible tracers. The Phantom has a slight range-based damage falloff and no tracers, trading a little long-range power for stealth and marginally easier spray control.",
      steps: [
        'On open maps with long sightlines, lean toward the Vandal — the lack of falloff matters more the further the fight.',
        "On tighter maps or when you expect to flank or hold an off-angle, consider the Phantom's lack of tracers.",
        "If you're inconsistent with recoil control, the Phantom's marginally gentler spray can be more forgiving in sustained fights.",
        "Don't switch weapons round-to-round just to experiment mid-competitive game — build comfort with one as your default, then adapt situationally.",
        "Factor in your team's read on the enemy: if they're tracking tracers to find angles, the Phantom denies them that information.",
      ],
      whenToUseIt:
        "This decision matters most on maps like Breeze and Pearl with long sightlines (favoring the Vandal) versus tighter maps like Bind and Sunset (where the Phantom's silence has more value).",
      commonMistakes: [
        'Picking a rifle based on appearance rather than the map or role being played.',
        'Ignoring damage falloff on the Phantom when holding very long angles.',
        'Switching weapons every round without a clear reason, preventing muscle memory from building.',
      ],
      example:
        "You're holding a long angle on Breeze with a Phantom and land three body shots on a distant target that don't quite secure the kill due to falloff — the same shots with a Vandal would have. The next round, you swap for the long sightline and the trade goes your way.",
      drill:
        'Spend a session in the range comparing your spray control and reaction time with each rifle specifically at ranges over 20 meters, where the practical differences show up most.',
      takeaway:
        "Neither rifle is strictly better — match the Vandal's range consistency or the Phantom's stealth to the fight you're actually walking into.",
    },
  },
  {
    id: 'burst-vs-spray-control',
    title: 'Burst Fire vs. Spray Control',
    category: 'weapons',
    difficulty: 'intermediate',
    premium: false,
    excerpt:
      'Understand when to tap, burst, or spray instead of forcing one firing pattern into every fight.',
    updated: '2026-08-20',
    tags: ['Spray Control', 'Rifles', 'Technique'],
    content: {
      whyItMatters:
        "Rifles in VALORANT reward precise single shots or short bursts at range and controlled sprays up close — using the wrong technique for the distance either wastes accuracy or wastes time you don't have.",
      coreConcept:
        "At long range, each bullet's individual spread matters more than fire rate, so single taps or two-round bursts with a reset between them keep your shots accurate. At close range, a controlled spray, pulling down against the weapon's recoil pattern, outputs more damage per second than repeated taps.",
      steps: [
        'At long-to-medium range, fire single shots or short bursts, resetting your aim between each one.',
        "At close range, hold the trigger and pull your mouse down to counter the weapon's vertical recoil pattern.",
        "Learn your weapon's specific recoil pattern in the range — it's consistent and memorizable, not random.",
        'Transition technique mid-fight if the range changes, such as when an enemy closes distance during a duel.',
        'Practice both techniques separately rather than only ever using your comfortable default.',
      ],
      whenToUseIt:
        "Use bursts by default when you don't have a clear read on engagement distance, and commit to a full spray only once you're confident you're in close range.",
      commonMistakes: [
        'Spraying at long range, where the same bullets fired as taps would have hit.',
        'Tapping repeatedly at close range instead of committing to a spray, losing the DPS advantage.',
        "Not adjusting technique when an enemy's distance changes mid-fight.",
      ],
      example:
        "You're holding a long sightline and see movement at range. Instead of holding the trigger, you fire two-round bursts, resetting your crosshair between each — your accuracy stays high enough to win a fight most players would lose by spraying.",
      drill:
        "In the range, practice your weapon's spray pattern against a static target at 5, 15, and 25 meters, noting where burst-tapping starts to outperform a full spray.",
      takeaway:
        'Match your firing technique to the range of the fight — bursts for distance, controlled sprays for close range.',
    },
  },
  {
    id: 'sheriff-fundamentals',
    title: 'Sheriff Fundamentals: High-Risk Precision',
    category: 'weapons',
    difficulty: 'advanced',
    premium: false,
    excerpt:
      'Improve pistol-round discipline, positioning, and precision when every bullet matters.',
    updated: '2026-07-25',
    tags: ['Sheriff', 'Pistols', 'Economy'],
    content: {
      whyItMatters:
        'The Sheriff is the only pistol capable of a one-shot headshot kill, which makes it a genuine threat to full-buy rifles when aimed well — but its low fire rate punishes inaccurate players hard.',
      coreConcept:
        "The Sheriff rewards the same discipline as a rifle's tap-fire: a single, precise shot per engagement. It punishes spamming shots far more than a cheaper, higher fire-rate pistol, since a miss leaves you with almost no follow-up before an enemy closes distance or returns fire.",
      steps: [
        'Treat every Sheriff shot like a rifle tap — commit to one precise shot rather than a rushed follow-up.',
        'Use crosshair placement fundamentals even harder here, since you have very little margin for a second correction shot.',
        'Consider your accuracy under pressure honestly — if your headshot percentage with pistols is low, a cheaper, higher-fire-rate pistol may win you more rounds overall.',
        'Buy the Sheriff on rounds where you expect a clean, isolated duel rather than a chaotic multi-person fight.',
        'Pair it with utility that isolates a single opponent, since the Sheriff struggles against being flanked mid-reload.',
      ],
      whenToUseIt:
        "The Sheriff shines on pistol rounds and light-buy rounds where you're likely to get a clean angle, and struggles in close-quarters chaos where reload speed and fire rate matter more.",
      commonMistakes: [
        'Buying the Sheriff without the aim consistency to justify it, then losing the economy round it was meant to win.',
        'Panicking into a rushed second shot instead of relying on the power of the first.',
        'Using it the same way as a spray-friendly, cheaper pistol.',
      ],
      example:
        'On a pistol round, you hold an angle with the Sheriff and land a clean headshot on the first enemy who peeks, one-tapping them the same way a rifle would. A teammate who panics and fires wildly with the same weapon misses both shots and gets punished by the slow follow-up.',
      drill:
        'Practice one-tap accuracy in the range using only the Sheriff at varying ranges, tracking your headshot percentage over several sessions before committing to it in ranked.',
      takeaway:
        "The Sheriff is a rifle in a pistol's body — only buy it if your aim can commit to one precise shot per duel.",
    },
  },

  // ---------------------------------------------------- STRATEGY
  {
    id: 'economy-management',
    title: 'Economy Management for Solo Queue',
    category: 'strategy',
    difficulty: 'beginner',
    premium: false,
    excerpt: 'Understand how to manage credits without relying on perfect team coordination.',
    updated: '2026-06-18',
    tags: ['Economy', 'Solo Queue'],
    content: {
      whyItMatters:
        "In solo queue, coordinated team buys are rare. The lever you actually control is your own individual economy, so treating it as a personal budget rather than a team decision keeps you useful even when your team's calls are inconsistent.",
      coreConcept:
        "A simple rule protects most solo-queue economies: never drop below enough credits for a full buy two rounds later unless the round is genuinely winnable. Half-buys that don't change the round's outcome just delay your own reset.",
      steps: [
        'Track your own credits every round, independent of what your team seems to be doing.',
        'If your team is clearly forcing and you disagree, consider a light buy — armor plus a cheap weapon — to keep some resistance without bleeding your economy.',
        "Loosely track the enemy's economy by round number and loss streaks — a team on a bonus round after two losses is more dangerous than a first-round force.",
        'Prioritize armor over a marginally better weapon when your economy is tight; survivability often matters more than firepower on a save round.',
        "Communicate your buy intention to your team early in the round, not after they've already committed to a different plan.",
      ],
      whenToUseIt:
        "Apply this thinking every round, but it matters most after a loss — the temptation to force-buy to 'catch up' is exactly when a disciplined save protects your next full buy.",
      commonMistakes: [
        'Force-buying every round after a loss out of frustration rather than a read on winnability.',
        "Buying a full loadout when the rest of the team is saving, walking into a round you can't realistically win alone.",
        "Ignoring the enemy's likely economy when deciding how aggressively to play a round.",
      ],
      example:
        "Your team is 0-2 and three teammates buy full rifles anyway. Rather than matching them, you assess the round as unlikely to be won and buy armor plus a cheap weapon instead — when the round is lost, you're the only one with credits for a real buy next round.",
      drill:
        "Track your own buy decisions for ten matches against the outcome of each round — you'll start to see which buys were actually justified by winnability versus frustration.",
      takeaway:
        "You can't control your team's economy, but disciplined personal buying keeps you useful even when the team read is wrong.",
    },
  },
  {
    id: 'trading-effectively',
    title: 'Trading Effectively: Why Your Team Wins the Second Duel',
    category: 'strategy',
    difficulty: 'beginner',
    premium: false,
    excerpt: 'Learn how spacing and timing turn individual fights into favorable trades.',
    updated: '2026-08-11',
    tags: ['Trading', 'Teamwork', 'Positioning'],
    content: {
      whyItMatters:
        "Most rounds aren't decided by a single duel — they're decided by whether a death gets traded. A team that consistently trades its own deaths effectively plays with a numbers disadvantage for only a moment, while a team that doesn't ends up losing fights it should have won.",
      coreConcept:
        "Trading requires positioning, not just proximity — you need to be close enough to punish whoever killed your teammate, but positioned so you're not exposed to the same angle that killed them.",
      steps: [
        'Stay within trading distance of teammates during pushes rather than spreading out too far.',
        "Watch the angle your teammate is about to clear, not just your own — you're the trade if it goes wrong.",
        'When a teammate dies, immediately identify where the shot came from rather than pushing blindly into the space.',
        'Peek from a slightly different angle than your teammate did, so the enemy has to reacquire you rather than just holding the same spot.',
        "After trading a kill, reassess rather than immediately pushing further — you've won the exchange, but the round isn't automatically won.",
      ],
      whenToUseIt:
        'Prioritize trade positioning on every entry push and every retake — these are the situations where a missed trade most directly costs the round.',
      commonMistakes: [
        'Standing too far from an entrying teammate to punish whoever kills them.',
        'Pushing into the exact angle that just killed a teammate instead of a different one.',
        "Hesitating after a teammate's death instead of immediately capitalizing on the enemy's now-revealed position.",
      ],
      example:
        "Your teammate pushes into a site and dies to an angle you didn't expect. Instead of freezing, you immediately peek from a slightly different position — the enemy who just fired is still repositioning, and you win the trade before they can reset.",
      drill:
        "Review a handful of your losses specifically for untraded deaths — count how many of your team's losses came from deaths that had no immediate follow-up.",
      takeaway:
        "A duel lost isn't a round lost if it's traded immediately — position to punish, not just to support.",
    },
  },
  {
    id: 'numbers-advantage',
    title: 'Playing a Numbers Advantage',
    category: 'strategy',
    difficulty: 'intermediate',
    premium: false,
    excerpt:
      'Learn how to convert a player advantage into a controlled round instead of giving the enemy openings.',
    updated: '2026-08-04',
    tags: ['Man Advantage', 'Decision Making', 'Strategy'],
    content: {
      whyItMatters:
        "A numbers advantage is only valuable if you play differently because of it. Teams that play a 4v3 the same way they'd play a 4v4 waste the single biggest strategic edge the round can offer.",
      coreConcept:
        'With a numbers advantage, your priority shifts from winning individual duels to reducing risk — every unnecessary 1-for-1 trade erodes the advantage you already have, even if you technically win the exchange.',
      steps: [
        'Avoid isolated duels that could trade down your advantage — a 4v3 that trades into a 3v2 has made no real progress.',
        'Force the remaining defenders into unfavorable engagements by taking space slowly and giving them fewer angles to work with.',
        'Use trade positioning even more aggressively than usual, since a missed trade costs you your numerical edge.',
        'Consider playing for time rather than a fast execute — the objective clock favors you when you already have map control.',
        'Communicate the numbers clearly so every teammate is playing with the same read on how much risk to take.',
      ],
      whenToUseIt:
        "This mindset matters most immediately after winning an early duel or a trade that puts you ahead — the first ten seconds after gaining an advantage are when it's easiest to give it back through impatience.",
      commonMistakes: [
        'Playing for individual kills instead of round control once ahead.',
        'Isolating yourself for a pick that risks the advantage instead of playing patiently.',
        'Rushing an execute out of impatience instead of using the extra time a numbers advantage buys you.',
      ],
      example:
        'Your team wins an early duel, making it a 4v3. Instead of immediately pushing for more picks, you take slow, coordinated space toward the site — the defenders, now outnumbered and unable to find a good angle, are forced into a crossfire your team set up rather than one they chose.',
      drill:
        'Review a few of your wins and losses specifically from numbers-advantage situations — note how many advantages were converted into round wins versus traded away.',
      takeaway:
        "A numbers advantage is a resource to spend carefully, not a license to play more aggressively — reduce risk, don't increase it.",
    },
  },
  {
    id: 'mid-round-decision-making',
    title: 'Mid-Round Decision Making',
    category: 'strategy',
    difficulty: 'intermediate',
    premium: false,
    excerpt: 'Learn how to adapt when the original plan stops working and the round changes.',
    updated: '2026-08-17',
    tags: ['Decision Making', 'Rotations', 'Strategy'],
    topics: ['rotation'],
    content: {
      whyItMatters:
        "Every round starts with a plan, and almost every round requires that plan to change based on new information. Teams that can't adapt mid-round keep executing a plan that's already been read by the enemy.",
      coreConcept:
        'Good mid-round decisions come from continuously updating a small set of questions: where are the enemies, how many are accounted for, and what does our team gain or lose by changing the plan now.',
      steps: [
        'Re-evaluate the round plan any time new information arrives — a rotation sound, a trade, a lost duel.',
        'Weigh the cost of switching plans (lost time, spent utility) against the benefit of avoiding a now-predictable execute.',
        'Communicate plan changes clearly and immediately — an unclear mid-round call is worse than sticking with the original plan.',
        'Default to your original read if new information is ambiguous, rather than second-guessing constantly.',
        "Assign someone (often the in-game leader) to make the final call when the team's reads conflict, so decisions don't stall out.",
      ],
      whenToUseIt:
        'This applies constantly, but the highest-leverage moments are right after a rotation is confirmed, right after your team wins or loses an early duel, and in the final 15 seconds before a spike timer forces a decision.',
      commonMistakes: [
        "Sticking rigidly to the round-start plan even after it's clearly been read by the enemy.",
        'Changing plans too often, wasting utility and time without committing to anything.',
        'Multiple teammates making conflicting mid-round calls at the same time.',
      ],
      example:
        "Your team planned an A execute, but a rotation sound confirms three defenders have shifted there. Instead of committing anyway, your IGL calls a switch to B with the utility you have left — the defense, caught mid-rotation, can't reinforce in time.",
      drill:
        "Review a few losses specifically for moments where the original round plan should have changed but didn't — identify the information that was available but ignored.",
      takeaway:
        'A plan is a starting point, not a contract — the best teams adjust it constantly based on what the round is actually telling them.',
    },
  },
  {
    id: 'breaking-enemy-defaults',
    title: 'Breaking Enemy Defaults',
    category: 'strategy',
    difficulty: 'advanced',
    premium: true,
    excerpt: 'Recognize predictable enemy patterns and learn how to punish repeated habits.',
    updated: '2026-08-21',
    tags: ['Default', 'Reads', 'Strategy'],
    // content: Premium — served by the API after a server-side entitlement check (server/premiumGuides.js)
  },

  // ----------------------------------------------------- UTILITY
  {
    id: 'smoke-fundamentals',
    title: 'Smoke Fundamentals: Blocking Information, Not Just Angles',
    category: 'utility',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      'Understand what a smoke should accomplish and how it changes the information available to both teams.',
    updated: '2026-07-20',
    tags: ['Smokes', 'Utility', 'Fundamentals'],
    content: {
      whyItMatters:
        'New players often think of smokes purely as vision blockers, but their real value is denying the enemy information at the exact moment your team is most vulnerable — during an execute or a rotation.',
      coreConcept:
        "A smoke is well-placed when it blocks the specific angle that would otherwise punish your team's plan, timed to land right before that vulnerability, not just 'somewhere in the way.'",
      steps: [
        'Identify the single angle most dangerous to your plan before throwing a smoke, rather than smoking a general area.',
        'Time smokes to land just before your team is exposed to that angle, not immediately at round start.',
        'Communicate smoke duration to your team, since pushing too late lets it expire before you capitalize on it.',
        'Reserve at least one smoke for retakes or post-plant situations rather than using all utility on the initial push.',
        "Re-smoke a lineup that's about to expire if the round state still calls for denying that angle.",
      ],
      whenToUseIt:
        'Prioritize smoking the angle with the highest kill potential for the defense — usually a long sightline or an elevated position — over smoking purely for cosmetic site coverage.',
      commonMistakes: [
        "Smoking angles that aren't actually dangerous to the current plan.",
        'Throwing smokes too early, letting them expire before the team is ready to use them.',
        'Using every smoke on the initial execute, leaving nothing for the retake.',
      ],
      example:
        'Your team is executing B, but a long sightline from outside the site threatens the push. Instead of smoking the site itself, you smoke that specific sightline — your team pushes in without being picked from range, and the smoke does its job before anyone even reaches the plant spot.',
      drill:
        'In customs, practice identifying the single most dangerous angle on a site before throwing any utility, and only smoke that angle.',
      takeaway:
        'Smoke the danger, not the destination — a well-placed smoke denies the angle that actually threatens your plan.',
    },
  },
  {
    id: 'flash-timing',
    title: 'Flash Timing: Blind vs. Wasted Flash',
    category: 'utility',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      'Learn how timing determines whether a flash creates an opportunity or simply disappears.',
    updated: '2026-08-03',
    tags: ['Flashes', 'Utility', 'Timing'],
    content: {
      whyItMatters:
        'Flashes are only useful during the window an enemy is actually blinded and your team is capitalizing on it — timing errors turn a well-aimed flash into a wasted cooldown that tells the enemy exactly where you are.',
      coreConcept:
        "Good flash timing syncs the pop of the flash with your team's push, so the enemy is blind at the exact moment they'd otherwise be able to see and shoot you — not a second before or after.",
      steps: [
        'Throw the flash with enough lead time to pop right as your team rounds the corner, not before.',
        "Communicate 'flashing in 3, 2, 1' so teammates can time their push to the exact pop, not a rough estimate.",
        "Pre-aim the throw so the flash pops in the enemy's likely holding area, not just generally in their direction.",
        "Use off-angle or blind throws (bouncing around a corner) when a direct throw would expose you to the same angle you're trying to counter.",
        "Don't flash yourself — check your own sightline to the pop point before throwing.",
      ],
      whenToUseIt:
        "Flash timing matters most on entry pushes and retakes, where the window between 'enemy still sighted' and 'enemy about to reposition' is only a second or two.",
      commonMistakes: [
        "Throwing the flash and pushing immediately, before it's actually popped.",
        "Waiting too long after the flash pops, letting the enemy's vision return before capitalizing.",
        'Flashing an angle without confirming an enemy is actually likely to be looking at it.',
      ],
      example:
        'Your team calls an entry push. Instead of throwing the flash and pushing right away, you count down out loud and time the push to the exact moment the flash pops — the enemy holding the angle is blinded precisely when your entry fragger rounds the corner, rather than a beat too early.',
      drill:
        "Practice flash-into-push timing with a teammate in customs, refining the exact gap between throw and push until the flash's peak blind window lines up with your entry.",
      takeaway:
        'A flash only works during its blind window — sync your push to that window exactly, not to a rough guess.',
    },
  },
  {
    id: 'initiator-utility-management',
    title: 'Initiator Utility: Information Before You Need It',
    category: 'utility',
    difficulty: 'intermediate',
    premium: false,
    excerpt: 'Learn how to gather useful information early enough for your team to act on it.',
    updated: '2026-08-15',
    tags: ['Initiator', 'Recon', 'Utility'],
    content: {
      whyItMatters:
        "Recon and initiator utility loses most of its value if it's used reactively, after a fight has already started. Its real strength is telling your team what to expect before you commit to a plan.",
      coreConcept:
        'Initiator utility should usually be spent to inform a decision, not to win a duel directly — knowing where two enemies are standing is often worth more than the small amount of direct damage or disruption the ability provides.',
      steps: [
        'Use recon utility before committing bodies to a push, not as a follow-up after contact.',
        'Communicate the information gained immediately and specifically — exact positions, not vague callouts.',
        'Save at least one charge for retakes or post-plant situations, where information is just as valuable as during the initial push.',
        "Combine initiator utility with your team's actual push timing, so the information translates into an advantage rather than just being interesting.",
        "Don't waste charges checking angles that are already confirmed clear by other means.",
      ],
      whenToUseIt:
        'Use initiator utility earliest on rounds where your team has no read on enemy positioning, and hold charges in reserve on rounds where you already have strong information from sound or a previous duel.',
      commonMistakes: [
        'Saving all initiator charges until the execute, missing the chance to inform the approach.',
        'Using recon utility on already-confirmed-clear areas out of habit rather than need.',
        'Not communicating the information gained clearly enough for teammates to act on it.',
      ],
      example:
        'Before committing to an A execute, you use a recon ability into the site and confirm two defenders holding a specific crossfire. Instead of walking into it blind, your team adjusts the entry angle to avoid the crossfire entirely, based on information gathered before any bodies were exposed.',
      drill:
        'In customs, practice using initiator utility purely for information — call out exactly what you learned before your team makes any other move.',
      takeaway:
        "Information wins more rounds than damage — spend initiator utility to know what's ahead, not just to disrupt what's already in front of you.",
    },
  },
  {
    id: 'sentinel-utility-usage',
    title: 'Sentinel Utility: Protecting Space, Not Just Watching It',
    category: 'utility',
    difficulty: 'intermediate',
    premium: false,
    excerpt: 'Use utility to control routes, detect pressure, and protect valuable areas.',
    updated: '2026-07-12',
    tags: ['Sentinel', 'Flank Watch', 'Utility'],
    content: {
      whyItMatters:
        "Sentinel utility (trips, slows, anchors) is often treated as a passive 'set and forget' tool, but its real value comes from actively shaping where the enemy is willing to go — a well-placed piece of utility changes enemy behavior even if it's never directly triggered.",
      coreConcept:
        'The goal of sentinel utility is to make a route expensive enough that the enemy avoids it, buying your team time or forcing them into a worse route entirely — not just to get a single trade if someone walks into it.',
      steps: [
        'Place utility on the routes an enemy is most likely to use for a flank, not just the most obvious open path.',
        'Reposition sentinel utility as the round develops — a placement that made sense at round start may be irrelevant two rotations later.',
        'Communicate immediately when utility is triggered, since it usually means a flank attempt is in progress right now.',
        'Use sentinel utility to buy time for a rotation, not just to secure a kill — even an avoided trap has done its job.',
        "Don't over-commit charges to flank watch on rounds where your team already has strong map control from another source.",
      ],
      whenToUseIt:
        'This matters most when your team is executing a site and leaving your back exposed, or when defending a site alone and needing early warning of a flank.',
      commonMistakes: [
        'Placing utility once at round start and never adjusting it as the round develops.',
        'Treating a triggered trap as the goal, rather than valuing the routes it successfully denied.',
        'Failing to communicate a triggered trap quickly enough for the team to react.',
      ],
      example:
        'You place flank-watch utility on a common rotation path while your team executes the opposite site. A flanking enemy triggers it — even though they escape without dying, the delay and noise give your team enough warning to finish the execute before the flank can interfere.',
      drill:
        "Track how often your placed utility is triggered versus how often it changes an enemy's route without being triggered at all — both count as a win.",
      takeaway:
        'Sentinel utility succeeds by shaping enemy behavior, not just by securing a kill when someone walks into it.',
    },
  },
  {
    id: 'post-plant-utility',
    title: 'Post-Plant Utility: Spending What You Have Left',
    category: 'utility',
    difficulty: 'advanced',
    premium: false,
    excerpt:
      'Learn how to use remaining utility after the spike is planted to create stronger win conditions.',
    updated: '2026-08-18',
    tags: ['Post-plant', 'Utility', 'Strategy'],
    content: {
      whyItMatters:
        'Teams that spend all their utility on the initial execute often have nothing left to defend the plant, even when the site itself was won cleanly. Post-plant utility usage is what actually converts a plant into a round win.',
      coreConcept:
        'Post-plant utility should be spent to deny specific retake routes and to cover the defuse window, not held indefinitely or spent the same way as pre-plant utility.',
      steps: [
        'Reserve at least one piece of utility specifically for after the plant, even if it means using slightly less on the initial execute.',
        "Place post-plant utility on the routes the retake is most likely to come from, based on the site's typical retake paths.",
        'Time a molotov, wall, or area-denial ability to cover the defuse itself, not just the approach to the site.',
        "Coordinate with teammates so post-plant utility isn't duplicated on the same angle while another route goes uncovered.",
        'Adjust post-plant setup based on the number of defenders remaining — fewer defenders means fewer angles need covering.',
      ],
      whenToUseIt:
        "This planning should happen before the execute even starts — decide as a team what utility is 'execute utility' versus 'post-plant utility' rather than figuring it out after the plant is already down.",
      commonMistakes: [
        'Using all utility during the execute, leaving no coverage for the retake.',
        "Placing post-plant utility on a route that doesn't actually threaten the plant.",
        'Multiple teammates saving utility for the same angle while another goes completely uncovered.',
      ],
      example:
        "Your team wins the site but has used most of its utility getting there. The one player who saved a molotov places it directly on the defuse spot's most common approach — when the retake comes, that single piece of utility delays the defuse long enough for your team to finish the round.",
      drill:
        'In scrims, deliberately plan pre-plant versus post-plant utility allocation before the round starts, and review whether the split actually matched what the retake needed.',
      takeaway:
        "A plant isn't secure until the post-plant setup is — decide what utility you're saving for it before the execute even begins.",
    },
  },

  // ------------------------------------------------- MENTAL GAME
  {
    id: 'recovering-after-losing-rounds',
    title: 'Recovering After Losing Rounds',
    category: 'mental-game',
    difficulty: 'beginner',
    premium: false,
    excerpt: 'Learn how to reset quickly instead of carrying the previous round into the next one.',
    updated: '2026-07-08',
    tags: ['Mindset', 'Consistency'],
    content: {
      whyItMatters:
        'A single lost round rarely loses a game on its own — but a string of rounds played poorly because of frustration after that loss often does. Recovery speed between rounds is a trainable skill, not a fixed trait.',
      coreConcept:
        "Fast recovery comes from treating each round as its own decision space, separate from the last one, rather than carrying frustration or overcorrection into the next round's calls.",
      steps: [
        "Give yourself a fixed, short window to feel frustrated, then deliberately shift focus to the next round's plan.",
        "Avoid making buy or strategy decisions in direct reaction to the previous round's outcome — decide based on the current round's information instead.",
        'Use the buy phase as a natural reset point — a consistent routine here redirects focus away from the last loss.',
        'If a specific mistake caused the loss, name it once, briefly, and move on rather than replaying it repeatedly.',
        'Communicate normally with your team even after a bad round — going silent often signals tilt to teammates and can spread it.',
      ],
      whenToUseIt:
        'This applies after every lost round, but especially after rounds lost to an individual mistake, which tend to generate more lingering frustration than a round lost to a good enemy play.',
      commonMistakes: [
        'Carrying frustration from a lost round into an overly aggressive or overly passive next round.',
        'Replaying the mistake mentally instead of briefly acknowledging it and refocusing.',
        'Going quiet on comms after a bad round, which often makes coordination worse for the whole team.',
      ],
      example:
        "You lose a round to a mistimed peek. Instead of forcing an aggressive play next round to 'make up for it,' you use the buy phase to reset, confirm the actual plan with your team, and play the round on its own terms — free of the previous round's frustration.",
      drill:
        'Track your in-game decisions for the round immediately following a loss across a few matches — look for patterns where frustration, not information, drove the call.',
      takeaway:
        'Each round is a fresh decision — the fastest climbers separate what just happened from what they do next.',
    },
  },
  {
    id: 'avoiding-autopilot',
    title: 'Avoiding Autopilot',
    category: 'mental-game',
    difficulty: 'beginner',
    premium: false,
    excerpt:
      "Recognize when you're mechanically playing without thinking and rebuild active decision-making.",
    updated: '2026-08-10',
    tags: ['Focus', 'Consistency', 'Mindset'],
    content: {
      whyItMatters:
        "Long matches make it easy to slip into autopilot — running the same default, checking the same angles, without actually processing new information. Autopilot rounds are some of the easiest to lose, because you're not really adapting to what's happening.",
      coreConcept:
        "Staying engaged isn't about trying harder in a vague sense — it's about deliberately asking a few active questions each round instead of repeating the same routine by habit.",
      steps: [
        "At the start of each round, briefly note one thing that's different from the last similar round — enemy economy, a new read, a change in your own utility.",
        'Vary your positioning and habits round to round specifically to prevent both autopilot and predictability against the enemy.',
        'Use natural breaks (buy phase, round transitions) as check-in points to refocus rather than letting them blur together.',
        "Notice when you're making a decision 'because that's what I always do' rather than because of the current round's information, and pause to reconsider.",
        'Take a short mental break between maps or during timeouts rather than staying tunnel-focused for the entire match.',
      ],
      whenToUseIt:
        'This matters most in the middle rounds of a long half, after the initial adrenaline of the match start has worn off but before the tension of a close scoreline kicks back in.',
      commonMistakes: [
        'Holding the exact same angle every round regardless of new information, purely out of habit.',
        'Making buy decisions automatically based on the previous round instead of the current one.',
        'Losing track of small details (utility used, enemy tendencies) because attention has drifted.',
      ],
      example:
        "By round 15, you notice you've held the same off-angle the entire half without adjusting. You deliberately switch it up, and when the enemy — who had clearly noted your habit — pre-aims your old spot, you're already somewhere else.",
      drill:
        "Pick one specific detail to actively track each round (an enemy's utility usage, a rotation pattern) for a full half, and notice how much more information you retain compared to a passive match.",
      takeaway:
        "Autopilot loses rounds quietly — stay actively engaged by asking what's different this round, not just repeating the last one.",
    },
  },
  {
    id: 'maintaining-consistency',
    title: 'Maintaining Consistency Across a Session',
    category: 'mental-game',
    difficulty: 'intermediate',
    premium: false,
    excerpt:
      'Learn how to reduce performance swings and maintain decision quality over longer sessions.',
    updated: '2026-07-27',
    tags: ['Consistency', 'Mindset', 'Routine'],
    content: {
      whyItMatters:
        "Most players' mechanical skill doesn't actually swing wildly within a single session — what swings is focus, patience, and decision-making. Treating inconsistency as a mental problem, not an aim problem, is often the faster fix.",
      coreConcept:
        'Consistency comes from a repeatable pre-round and pre-session routine that puts you in the same mental state regardless of the score, rather than letting your state be dictated entirely by how the last few rounds went.',
      steps: [
        'Build a short warm-up routine before competitive play and stick to it every session, so your mechanical baseline is consistent going in.',
        'Set session-level goals around process (crosshair placement, communication) rather than only outcome, since process goals stay achievable even in a loss.',
        'Notice early signs of fatigue or frustration and treat them as information, not weakness — a short break can prevent a full session slide.',
        "Avoid queueing 'one more' game specifically to fix a bad feeling from the last one — that's usually when performance dips further.",
        'Review sessions after the fact for patterns (time of day, number of games played) that correlate with your best and worst performances.',
      ],
      whenToUseIt:
        'Apply this thinking across an entire session, checking in with yourself between matches rather than only reacting within a single game.',
      commonMistakes: [
        'Skipping warm-up on days when motivation is low, then blaming aim for what was actually a cold start.',
        "Chaining games together to 'fix' a bad session instead of stepping away.",
        'Judging the whole session by the most recent game rather than the overall pattern.',
      ],
      example:
        "After two rough losses, you notice the pull to immediately queue again to 'fix it.' Instead, you take a short break, revisit your warm-up routine, and return with the same process-focused mindset you started the session with — the next few rounds play noticeably more stable.",
      drill:
        'Log a week of sessions with start time, number of games, and a rough self-rated performance — look for the point in a session where your play consistently starts to decline.',
      takeaway:
        'Inconsistency is usually a focus problem, not an aim problem — a repeatable routine protects your baseline better than raw motivation does.',
    },
  },
  {
    id: 'tilt-proofing',
    title: 'Tilt-Proofing a Losing Half',
    category: 'mental-game',
    difficulty: 'intermediate',
    premium: false,
    excerpt: 'Build a better reset process when a match starts moving against you.',
    updated: '2026-08-22',
    tags: ['Mindset', 'Tilt'],
    content: {
      whyItMatters:
        "Tilt itself isn't the problem — tilt that changes your decisions (chasing picks, forcing buys, going silent on comms) is. Separating the feeling from the behavior is what keeps a bad round from becoming a lost half.",
      coreConcept:
        "You can't always control whether you feel frustrated after a loss, but you can build a consistent, boring response to that feeling that keeps your decision-making unaffected.",
      steps: [
        'Build a single, boring reset habit between rounds — a breath, a fixed phrase, a glance away from the screen.',
        'Keep the habit dull enough that you barely notice doing it, which is exactly why it works under pressure.',
        "After a losing half, redefine the next five rounds' goal as 'play my role correctly' instead of 'win the game.'",
        'Save VOD review and self-criticism for after the match, not during it — in-game criticism competes with the focus your mechanics need.',
        'Notice specifically when frustration starts changing your buys or your aggression, and treat that as the signal to reset, not the loss itself.',
      ],
      whenToUseIt:
        'Apply this every round, but it matters most immediately after a lost round or a lost half, when the temptation to force a fix is highest.',
      commonMistakes: [
        'Letting frustration translate directly into forced buys or overly aggressive peeks.',
        'Reviewing mistakes mid-match instead of waiting until after, adding mental noise to rounds still in progress.',
        'Treating a single bad round as evidence the whole game is lost, changing decision-making for the rest of the half.',
      ],
      example:
        "You're down two rounds and feel the urge to force a big peek to 'get something going.' Instead, you use your reset habit, redefine the next round's goal as simply holding your angle correctly, and play it straight — the disciplined round wins cleanly instead of feeding a frustrated push.",
      drill:
        "Practice your reset habit deliberately in low-stakes matches until it happens automatically, so it's already built by the time a real losing half tests it.",
      takeaway:
        'Tilt is inevitable sometimes — letting it change your decisions is not. Separate the feeling from the behavior.',
    },
  },
  {
    id: 'decision-making-under-pressure',
    title: 'Decision Making Under Pressure',
    category: 'mental-game',
    difficulty: 'advanced',
    premium: true,
    excerpt:
      'Improve your ability to make clear decisions when time, information, and pressure are limited.',
    updated: '2026-08-23',
    tags: ['Clutch', 'Mindset', 'Decision Making'],
    // content: Premium — served by the API after a server-side entitlement check (server/premiumGuides.js)
  },
]

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

export function getCategoryLabel(key) {
  return GUIDE_CATEGORIES.find((c) => c.key === key)?.label || key
}

export function getDifficulty(key) {
  return DIFFICULTIES.find((d) => d.key === key) || DIFFICULTIES[0]
}

export function getGuideById(id) {
  return guides.find((g) => g.id === id)
}

export function getFeaturedGuide() {
  return guides.find((g) => g.featured) || guides[0]
}

export function getRelatedGuides(guide, limit = 3) {
  return guides.filter((g) => g.category === guide.category && g.id !== guide.id).slice(0, limit)
}

// Builds the searchable text for one guide: title, excerpt, category label,
// difficulty, tags, maps, and topics (search-only synonyms).
function searchHaystack(guide) {
  return [
    guide.title,
    guide.excerpt,
    getCategoryLabel(guide.category),
    guide.difficulty,
    ...(guide.tags || []),
    ...(guide.maps || []),
    ...(guide.topics || []),
  ]
    .join(' ')
    .toLowerCase()
}

export function searchMatches(guide, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return searchHaystack(guide).includes(q)
}

// Maps a skill-matrix skill to the single guide that most directly addresses
// it, used for the personalized training-path section.
const SKILL_TO_GUIDE = {
  'Aim & Mechanics': 'crosshair-codes',
  'Utility Usage': 'smoke-fundamentals',
  'Positioning': 'holding-sites',
  'Game Sense': 'reading-rotations',
  'Economy Mgmt': 'economy-management',
  'Communication': 'map-layouts-callouts',
}

// Short, human framing for each skill gap, shown as the step label in the
// training-path section.
export const SKILL_GAP_LABELS = {
  'Aim & Mechanics': 'Sharpen your aim',
  'Utility Usage': 'Get more from your utility',
  'Positioning': 'Fix your positioning',
  'Game Sense': 'Improve your game sense',
  'Economy Mgmt': 'Clean up your economy',
  'Communication': 'Communicate with clarity',
}

export function getGuideForSkill(skillName) {
  const id = SKILL_TO_GUIDE[skillName]
  return id ? getGuideById(id) : null
}
