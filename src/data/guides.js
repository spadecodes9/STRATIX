// ==========================================================================
// STRATIX Guides — data layer
// --------------------------------------------------------------------------
// Schema (per guide):
//   id            unique slug, used in routing (/guides/:id) — never rename
//                 an existing id, it's referenced by SKILL_TO_GUIDE and by
//                 coachKnowledge.js
//   title         card + detail headline
//   category      one of the CATEGORY keys in components/guides/categoryMeta.js
//                 ('Maps' | 'Weapons' | 'Strategy' | 'Utility' | 'Mental Game')
//   excerpt       1-2 sentence card description
//   readTime      display string, e.g. '5 min'
//   difficulty    'Beginner' | 'Intermediate' | 'Advanced'
//   updated       ISO date string
//   tags          short chips shown on the card + used in search
//   maps          optional array of map names this guide is specific to —
//                 also used in search and preferred as the card's tag
//   topics        optional array of extra search-only synonyms (not shown
//                 as chips) so a guide can be found by a term it doesn't
//                 display, e.g. "rotation" also matching "map control"
//   featured      optional true — exactly one guide should have this
//   content       structured teaching object, rendered by GuideDetail.jsx:
//                   whyItMatters   string
//                   coreConcept    string
//                   steps          string[]   ("STEP-BY-STEP")
//                   whenToUseIt    string
//                   commonMistakes string[]
//                   example        string     (in-game scenario)
//                   drill          string     (optional practice drill)
//                   takeaway       string     (quick takeaway)
//
// To add a new guide: append an object to `guides` below. No UI changes are
// needed — the library, search, filters, and detail page all read from this
// array and the helper functions at the bottom.
// ==========================================================================

export const guideCategories = ['All', 'Maps', 'Weapons', 'Strategy', 'Utility', 'Mental Game']

export const guides = [
  // ------------------------------------------------------------------ MAPS
  {
    id: 'post-plant-bind',
    title: 'Post-Plant Setups on Bind',
    category: 'Maps',
    excerpt: "The two post-plant crossfires that hold up against Bind's narrow retake paths.",
    readTime: '6 min',
    difficulty: 'Intermediate',
    updated: '2026-08-12',
    tags: ['Bind', 'Post-plant', 'Site Hold'],
    maps: ['Bind'],
    content: {
      whyItMatters:
        "A plant means nothing if the site falls a few seconds later. Bind's retakes funnel through a small number of chokes, so a well-placed two-player crossfire can hold a numbers-even retake far longer than the raw player count suggests.",
      coreConcept:
        "Because Bind has no mid and each site is fed by only two or three real paths, your post-plant only needs to cover those paths — not the whole site. The goal is a crossfire where neither holder can be seen from the plant, forcing the retake to commit to open ground before they can even see the spike.",
      steps: [
        'On A, plant toward Hookah or the elbow rather than fully exposed on site.',
        'Hold a crossfire between Short A and the Hookah doorway — one player watches the door, the other watches the corner.',
        'On B, plant near the back-right and hold Tower and the main choke from separate angles.',
        'Stagger your two holders by a few seconds so the second player punishes whoever cleans up the first pick.',
        'Confirm ultimates and utility timing before the retake starts, not after you hear footsteps.',
      ],
      whenToUseIt:
        "Use this whenever you're planting with at least one piece of utility or a full-health teammate left alive — a lone post-plant with no support is closer to a coinflip regardless of positioning.",
      commonMistakes: [
        'Holding straight lines toward the spike instead of angled crossfires.',
        'Both players watching the same entry point instead of splitting coverage.',
        'Peeking to check on the spike instead of trusting sound and the kill feed.',
      ],
      example:
        "You plant A with one teammate alive and one flash in reserve. Instead of standing on the plant, you fall back to Short with your teammate on Hookah — the defusing team has to clear two angles before they can even see the spike, buying time for the rest of your team to rotate back.",
      drill:
        'In custom games, practice planting and immediately rotating to a crossfire position within 3 seconds, every round, until it becomes automatic.',
      takeaway:
        'Cover the paths to the spike, not the spike itself — a good crossfire wins the fight before the enemy is close enough to defuse.',
    },
  },
  {
    id: 'ascent-mid-control',
    title: 'Winning the Fight for Mid on Ascent',
    category: 'Maps',
    excerpt: "Ascent is decided by who controls mid — here's how to take it and what to do once you have it.",
    readTime: '6 min',
    difficulty: 'Intermediate',
    updated: '2026-08-16',
    tags: ['Ascent', 'Map Control', 'Mid'],
    maps: ['Ascent'],
    topics: ['rotation', 'rotations'],
    content: {
      whyItMatters:
        "Ascent's open mid connects both sites, so whichever team controls it can rotate faster, flank either site, and force the defense to split attention. Losing mid early usually means playing reactive for the rest of the round.",
      coreConcept:
        "Mid control on Ascent isn't about holding the exact center of the map — it's about controlling the sightlines (Market, Mid Top, Mid Bottom) that let you see or deny enemy rotations. Whoever wins those sightlines decides where the round goes.",
      steps: [
        'Send info-gathering utility into Market and Mid Top before committing bodies.',
        'Take space slowly — a jiggle-peek that gets info is worth more than a peek that dies.',
        "Once mid is clear, use it to pressure the back of whichever site you're not hitting, not just to walk through.",
        'If mid is contested, trade cleanly rather than sending a second player into the same angle.',
        "Rotate your controller's smokes to block mid sightlines the instant you commit to a site.",
      ],
      whenToUseIt:
        "Prioritize mid control on pistol rounds and eco rounds especially — it's cheap to contest and the payoff (map info, flank denial) is disproportionately large when both teams have weak weapons.",
      commonMistakes: [
        'Fighting for mid with no plan for what to do once you have it.',
        "Overcommitting utility to mid on rounds where you're not planning to use it.",
        'Forgetting to hold mid once taken, letting the enemy walk it back for free.',
      ],
      example:
        "Your team wins the opening mid duel. Instead of pushing straight into A, you hold Mid Top and Market, denying the defense any rotation between sites — your other three players hit B against a defense that can't reinforce in time.",
      drill:
        "Review five of your own Ascent rounds and note who had mid control at the 40-second mark. It usually predicts the round winner more reliably than the site execute itself.",
      takeaway:
        "Mid isn't a destination on Ascent, it's leverage — take it to control where the enemy defense has to guess.",
    },
  },
  {
    id: 'haven-three-site-defense',
    title: 'Defending Three Sites on Haven',
    category: 'Maps',
    excerpt: "Haven's extra site stretches every defense thin — here's how to defend efficiently without overcommitting.",
    readTime: '7 min',
    difficulty: 'Intermediate',
    updated: '2026-08-05',
    tags: ['Haven', 'Defense', 'Rotations'],
    maps: ['Haven'],
    topics: ['rotation', 'map control'],
    content: {
      whyItMatters:
        "Haven is the only map with three bomb sites, which means a standard defensive split leaves every site thinner than a normal map. Fast, correct rotations matter more here than on any other map in the pool.",
      coreConcept:
        "You can't out-position a three-site map with raw bodies — you win Haven by gathering information early and rotating on the first real signal, not the first sound you hear. A defense that rotates on every footstep will get caught out of position by fakes.",
      steps: [
        'Assign one player to hold C Long or C Link for early info — it\'s the site most easily isolated from help.',
        'Keep two players roaming between A and mid so they can reinforce either in under ten seconds.',
        'Wait for a committed signal (utility used, multiple players heard) before fully rotating off a site.',
        'If B is hit, both A and C defenders should already be moving — B is the site everyone can reach.',
        'Call out numbers, not just location, so rotating teammates know if it\'s a real execute or a probe.',
      ],
      whenToUseIt:
        "This default applies most rounds; adjust only when you have a strong read on the enemy's tendencies or your utility economy is low.",
      commonMistakes: [
        'Rotating an entire site off a single distant footstep.',
        'Leaving C completely unwatched because it feels far away.',
        'Anchors pushing for picks instead of holding their assigned site until a rotation call.',
      ],
      example:
        "You're anchoring C alone. You hear two players' footsteps on C Long but no utility yet — instead of calling a full rotation, you hold and gather one more piece of information. When a smoke lands on C Link a second later, you call the real execute and your team rotates with confidence instead of confusion.",
      drill:
        'Spend a defensive half exclusively as a roamer between A and mid, timing how long it takes you to reach each site from different starting points.',
      takeaway:
        'On Haven, the team that rotates on real information — not raw sound — wins the site fight before it starts.',
    },
  },
  {
    id: 'split-mid-control',
    title: 'Controlling Mid on Split',
    category: 'Maps',
    excerpt: "Split's mid decides rotations for the entire round — control it and both sites open up.",
    readTime: '6 min',
    difficulty: 'Advanced',
    updated: '2026-08-19',
    tags: ['Split', 'Mid', 'Vertical Play'],
    maps: ['Split'],
    content: {
      whyItMatters:
        "Split has some of the slowest rotation paths in the map pool — the ropes connecting mid to the sites are the only fast way across. A team that controls mid can rotate in seconds; a team that doesn't is stuck taking the long way around.",
      coreConcept:
        "Mid on Split is fought vertically as much as horizontally — Vents, Mid Top, and the ropes themselves are all separate fights. Winning mid isn't one duel, it's a sequence of small space-taking wins that add up to control of the ropes.",
      steps: [
        "Clear Vents first — it's the single most common flank point into mid from either side.",
        'Take Mid Top space with utility before bodies, since sightlines there are long and unforgiving.',
        'Once mid is won, immediately decide whether to rope up to a site or hold mid as a flank-watch position.',
        "Don't send your whole team up one rope — split so the defense can't collapse a single choke on you.",
        'If mid is lost early, fall back to a default rather than trading utility to retake it immediately.',
      ],
      whenToUseIt:
        "Contest mid hardest on rounds where your team has utility to spare — Split punishes utility-less mid fights more than most maps because there's little cover once you commit to a rope.",
      commonMistakes: [
        "Taking mid space without a plan for which rope you're using it for.",
        "Pushing Vents without checking it's clear first.",
        "Forgetting mid is a flank route defenders can use against you after you've committed to a site.",
      ],
      example:
        'Your team clears Vents and Mid Top early. Instead of sitting on the space, two players rope up to B Heaven while the rest hold mid as a flank watch — the B defenders now have to worry about a push from two directions at once.',
      drill:
        'Time how long each rope takes to climb under fire versus uncontested — knowing the real numbers helps you commit or bail on a rope decision faster.',
      takeaway:
        'Split rewards teams who treat mid as a resource to spend on a rotation advantage, not a place to sit.',
    },
  },
  {
    id: 'icebox-vertical-play',
    title: 'Playing the Verticality on Icebox',
    category: 'Maps',
    excerpt: 'Icebox punishes players who only think in two dimensions — here\'s how to use height to your advantage.',
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-07-22',
    tags: ['Icebox', 'Verticality', 'Off-angles'],
    maps: ['Icebox'],
    content: {
      whyItMatters:
        "Icebox has more vertical angles than any other map — ziplines, container roofs, and elevated boxes all create sightlines that a purely horizontal mindset walks straight into. Ignoring height is one of the fastest ways to lose easy duels here.",
      coreConcept:
        "Every major area on Icebox has a 'high ground' version of itself. Winning a fight on Icebox often comes down to who checked the elevated angle first, not who had the faster reaction time.",
      steps: [
        'Before pushing into any open area, glance up — container tops and ziplines are common holding spots.',
        'Use elevated positions for information, not just kills — height gives you sightlines onto multiple approach paths at once.',
        'When defending, rotate through Tube or the ziplines rather than the long way around when time is tight.',
        'Clear off-angle boxes methodically rather than sprinting past them.',
        'When holding an elevated spot, pick one you can disengage from — a height advantage with no retreat path is a trap.',
      ],
      whenToUseIt:
        'Prioritize checking verticality any time you\'re pushing into Kitchen, Orange, or the Tube complex — these are the areas with the most stacked sightlines on the map.',
      commonMistakes: [
        'Only clearing ground-level angles and getting picked from above.',
        'Holding an elevated angle with no way to retreat if it\'s contested.',
        'Ignoring ziplines as rotation options and taking slower ground routes instead.',
      ],
      example:
        "You're pushing into Orange and clear the ground-level corners as usual — but you take a pick from someone holding the container roof above the doorway you just walked past. Checking that angle first would have flipped the duel in your favor.",
      drill:
        'Spend a few range sessions specifically flicking to elevated positions from common approach angles until checking "up" becomes automatic.',
      takeaway:
        "On Icebox, the fight isn't just left-right — it's up-down too. Check height before you commit to a push.",
    },
  },
  {
    id: 'breeze-long-range-duels',
    title: 'Winning Long-Range Duels on Breeze',
    category: 'Maps',
    excerpt: "Breeze's open sightlines reward precision over speed — here's how to win the long fights.",
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-07-15',
    tags: ['Breeze', 'Aim', 'Long Range'],
    maps: ['Breeze'],
    content: {
      whyItMatters:
        "Breeze has some of the longest uninterrupted sightlines in the game. Fights here are decided by pre-aim discipline and first-bullet accuracy far more than the close-range reflexes that win most duels on tighter maps.",
      coreConcept:
        "On open maps, whoever's crosshair is already at head height on the correct spot before the peek happens wins the duel — reaction-based aiming rarely closes the gap over long range.",
      steps: [
        "Identify the most common angle you're about to be shot from before you peek it, and pre-aim there.",
        'Use wide swings sparingly on Breeze — a wide peek on a long sightline gives the enemy more time to track you.',
        'Favor jiggle-peeks for information gathering on long angles rather than committing fully.',
        'When holding a long angle yourself, rest your crosshair at head height on the exact spot enemies appear.',
        "Communicate exact positions of enemies you see, not just 'someone's there' — distance matters more here than on tight maps.",
      ],
      whenToUseIt:
        "This applies any time you're contesting Cave, Halls, or the open ground toward A or B — the tighter interior spaces play more like a normal map.",
      commonMistakes: [
        'Peeking wide into long sightlines out of habit from tighter maps.',
        'Holding an angle with the crosshair too low, needing an extra flick to punish a peek.',
        'Standing still in the open while gathering information instead of using cover.',
      ],
      example:
        "You're holding a long sightline toward Halls. Instead of resting your crosshair at chest height and waiting, you pre-aim head height on the exact spot enemies round the corner — when someone peeks, you win the duel on your first shot instead of needing a correction.",
      drill:
        'Run aim-trainer scenarios focused on long-range tracking and flick precision — Breeze punishes imprecise long-range aim more than any other map in rotation.',
      takeaway:
        'Long sightlines reward the player whose crosshair was already right — pre-aim discipline beats raw reflexes on Breeze.',
    },
  },
  {
    id: 'pearl-mid-control',
    title: 'Controlling Mid on Pearl',
    category: 'Maps',
    excerpt: "Pearl's mid connects both sites through multiple paths — control it to pressure either site at will.",
    readTime: '6 min',
    difficulty: 'Intermediate',
    updated: '2026-08-02',
    tags: ['Pearl', 'Mid', 'Map Control'],
    maps: ['Pearl'],
    content: {
      whyItMatters:
        "Pearl's mid links to both A and B through several connectors, which means controlling it lets your team threaten either site without fully committing. Losing mid forces you into predictable, single-site executes.",
      coreConcept:
        "Mid control on Pearl is about the connectors (Link, Art, Tower) as much as the mid area itself — each one is a smaller fight that determines whether you can actually use mid control once you have it.",
      steps: [
        'Contest Link and Art early with info utility before sending bodies through them.',
        "Once mid space is won, decide which connector to push through based on where the defense is weakest.",
        "Keep at least one player watching the connector you're not using, to prevent a flank.",
        'Use mid control to delay a site commitment until you see how the defense reacts, rather than always executing immediately.',
        'On defense, deny mid control cheaply with utility rather than trading bodies for it every round.',
      ],
      whenToUseIt:
        "Fight hardest for mid on rounds where you have flexible utility and want to keep your execute site a secret as long as possible — Pearl rewards patience more than a rushed default.",
      commonMistakes: [
        'Winning mid but then executing predictably through the same connector every round.',
        'Sending too many players into mid and leaving an executable site undefended.',
        'Ignoring Tower as a flank route once mid is contested elsewhere.',
      ],
      example:
        "Your team takes mid control and instead of immediately committing to A, you hold the space for a few extra seconds to see how the defense rotates — when two defenders shift toward A, you switch the execute to B through Art and catch the site light.",
      drill:
        'Practice both connector routes (Link into A, Art into B) from a won mid position until either feels equally comfortable to call live.',
      takeaway:
        'Mid control on Pearl is only valuable if you keep your options open — use it to react to the defense, not to commit blindly.',
    },
  },
  {
    id: 'lotus-rotating-doors',
    title: "Reading Lotus's Rotating Doors",
    category: 'Maps',
    excerpt: "Lotus's destructible, rotating doors change every fight they touch — here's how to play around them.",
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-07-28',
    tags: ['Lotus', 'Utility', 'Site Control'],
    maps: ['Lotus'],
    content: {
      whyItMatters:
        "Lotus's rotating doors are unique in the map pool — they can be opened, closed, or destroyed, and each state changes what's a safe angle and what isn't. Misreading a door state is one of the most common ways to die on this map.",
      coreConcept:
        "A closed door isn't just cover — it's information. If a door you expected to be open is closed, or vice versa, that tells you something about where the enemy has been, even before you see them.",
      steps: [
        'Check the state of a nearby door before peeking an angle it affects — an open door can turn a safe angle into an exposed one.',
        'Use utility to destroy doors proactively when you want to deny the enemy a piece of cover or a rotation option.',
        "On defense, closing a door behind you can slow a push without needing to hold the angle yourself.",
        "Don't assume a door is permanent — it can be reopened or destroyed mid-round, so re-check before committing to a plan built around it.",
        "Communicate door states clearly to teammates rotating through the same area — 'door's open' is as useful as a sound cue.",
      ],
      whenToUseIt:
        'Pay closest attention to door states around A Dagger and the mid tunnels, where the doors most directly affect common sightlines and rotation paths.',
      commonMistakes: [
        "Peeking an angle without checking whether a nearby door changes what's visible.",
        "Wasting utility destroying a door that wasn't affecting the round anyway.",
        'Forgetting a door can be closed again after you open it, undoing your read.',
      ],
      example:
        "You're about to push through a doorway you cleared a few seconds ago. Before committing, you notice the door is now closed — someone closed it since you last checked, which means an enemy has rotated through the area. You reroute instead of walking into an ambush.",
      drill:
        'In custom games, practice opening, closing, and destroying doors deliberately to build a feel for how quickly the map state can change mid-round.',
      takeaway:
        "On Lotus, the doors are part of the intel — read their state the same way you'd read a footstep or a used ability.",
    },
  },
  {
    id: 'sunset-close-quarters',
    title: 'Close-Quarters Combat on Sunset',
    category: 'Maps',
    excerpt: "Sunset's tight corners reward fast reactions over long-range precision — here's how to adapt.",
    readTime: '5 min',
    difficulty: 'Beginner',
    updated: '2026-07-10',
    tags: ['Sunset', 'Close Range', 'Aim'],
    maps: ['Sunset'],
    content: {
      whyItMatters:
        "Sunset is built around short, tight sightlines rather than Breeze-style open duels. Fights are won and lost in under a second, which means crosshair placement and pre-fire habits matter even more than usual.",
      coreConcept:
        "In close quarters, the player who pre-aims the correct corner wins almost every duel, because there's rarely enough distance to out-aim a bad initial read.",
      steps: [
        "Pre-aim tight corners at head height before rounding them — there's rarely time to adjust after you see the enemy.",
        "Use flashes and other utility to clear corners you can't safely pre-aim, rather than peeking blind.",
        'Favor a slightly closer crosshair rest distance than you would on an open map, since duels resolve faster here.',
        "When holding an angle, pick tight, defensible spots rather than open rotational space.",
        "Communicate exact corner locations, not general directions — distance information matters more when fights are this fast.",
      ],
      whenToUseIt:
        'This mindset applies almost everywhere on Sunset, but especially around Market and the site entrances, where the sightlines are shortest.',
      commonMistakes: [
        'Peeking corners at the same pace you would on an open map, giving up the reaction-time advantage.',
        'Standing in the open gathering information instead of using cover between duels.',
        'Under-using flashes on a map built for exactly this kind of close-range disruption.',
      ],
      example:
        "You're clearing Market. Instead of walking in and reacting to whatever's there, you pre-aim the most common holding spot at head height and clear it decisively — the enemy holding that corner never gets the reaction-time advantage they were counting on.",
      drill:
        'Practice reflex-flick drills in the range focused on sub-0.3-second target acquisition — that\'s closer to the real decision window Sunset gives you.',
      takeaway:
        'Sunset is a pre-aim map disguised as a reflex map — win the corner before you round it, not after.',
    },
  },

  // --------------------------------------------------------------- WEAPONS
  {
    id: 'crosshair-codes',
    title: 'Crosshair Settings That Actually Help You Aim',
    category: 'Weapons',
    excerpt: 'Most crosshair guides optimize for looks. This one optimizes for information.',
    readTime: '4 min',
    difficulty: 'Beginner',
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
        "Turn off the center dot if you rely on tracking rather than flicking, since it reduces clutter during sustained spray control.",
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
    id: 'crosshair-placement-fundamentals',
    title: 'Crosshair Placement Fundamentals',
    category: 'Weapons',
    excerpt: 'The single habit that separates players who win duels before they start from players who react to them.',
    readTime: '5 min',
    difficulty: 'Beginner',
    updated: '2026-08-09',
    tags: ['Crosshair Placement', 'Pre-aim', 'Fundamentals'],
    content: {
      whyItMatters:
        "Most gunfights in VALORANT are decided before either player consciously reacts — by whoever's crosshair was already closer to where the enemy's head appeared. Crosshair placement is the highest-leverage mechanical habit you can build.",
      coreConcept:
        "Your crosshair should rest at head height on the spot an enemy is statistically most likely to appear — not the center of a doorway, not the floor, and not wherever your mouse happens to be.",
      steps: [
        "Before rounding any corner or clearing any doorway, ask 'where would a head appear here?' and rest your crosshair there.",
        'Adjust height for elevation changes — stairs, ramps, and boxes all shift where a head sits relative to the ground.',
        'Narrow, single-entry angles deserve tight, specific pre-aim; wide open areas need a default resting position you sweep from.',
        'After every kill or trade, reset your crosshair to the next likely angle instead of leaving it where the last fight ended.',
        "Review your own deaths in VOD specifically for crosshair height — it's the fastest way to spot a systemic habit issue.",
      ],
      whenToUseIt:
        'This applies on every single engagement, but it matters most on entry pushes and site holds, where you control when the duel starts.',
      commonMistakes: [
        'Resting the crosshair at chest or waist height out of habit.',
        'Aiming at the center of an opening instead of the specific spot a head appears.',
        'Moving the crosshair only after seeing the enemy, instead of before.',
      ],
      example:
        'You hold a doorway with your crosshair centered on the frame. An enemy peeks and you need a full second to correct upward to their head. The next round, you rest your crosshair at head height on the exact spot they peeked from — the same duel resolves in your favor without any extra movement.',
      drill:
        'In the range, practice holding common angles with your crosshair pre-placed, then have a friend or bot walk through — count how often you need to adjust before firing.',
      takeaway:
        "Whoever's crosshair is already on the head when the duel starts usually wins it — placement beats reaction.",
    },
  },
  {
    id: 'first-bullet-accuracy',
    title: 'Why Your First Bullet Should Always Count',
    category: 'Weapons',
    excerpt: "VALORANT's weapons are built around a precise first shot — spraying from the hip gives that advantage away for free.",
    readTime: '4 min',
    difficulty: 'Beginner',
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
        'In the range, practice strafing into cover, stopping, and firing a single precise shot as fast as possible — build the stop-then-shoot rhythm until it\'s instinctive.',
      takeaway:
        'A stopped first bullet beats a moving spray almost every time — manage your movement before you manage your aim.',
    },
  },
  {
    id: 'burst-vs-spray-control',
    title: 'Burst Fire vs. Spray Control: When to Use Each',
    category: 'Weapons',
    excerpt: 'Tapping and spraying solve different problems — using the wrong one at the wrong range costs duels.',
    readTime: '5 min',
    difficulty: 'Intermediate',
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
        "Transition technique mid-fight if the range changes, such as when an enemy closes distance during a duel.",
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
    id: 'vandal-vs-phantom',
    title: 'Vandal vs. Phantom: Choosing Your Rifle',
    category: 'Weapons',
    excerpt: 'Both rifles kill in the same number of hits — the real difference is in the tradeoffs, not the raw power.',
    readTime: '5 min',
    difficulty: 'Beginner',
    updated: '2026-08-06',
    tags: ['Rifles', 'Loadout', 'Decision Making'],
    content: {
      whyItMatters:
        "The Vandal and Phantom are VALORANT's two full-auto rifles, and the choice between them shapes how you play a round more than most players realize — it's not just a cosmetic preference.",
      coreConcept:
        'The Vandal is a one-shot headshot kill at any range with no damage falloff, but it\'s louder and shows visible tracers. The Phantom has a slight range-based damage falloff and no tracers, trading a little long-range power for stealth and marginally easier spray control.',
      steps: [
        'On open maps with long sightlines, lean toward the Vandal — the lack of falloff matters more the further the fight.',
        "On tighter maps or when you expect to flank or hold an off-angle, consider the Phantom's lack of tracers.",
        "If you're inconsistent with recoil control, the Phantom's marginally gentler spray can be more forgiving in sustained fights.",
        "Don't switch weapons round-to-round just to experiment mid-competitive game — build comfort with one as your default, then adapt situationally.",
        "Factor in your team's read on the enemy: if they're tracking tracers to find angles, the Phantom denies them that information.",
      ],
      whenToUseIt:
        'This decision matters most on maps like Breeze and Pearl with long sightlines (favoring the Vandal) versus tighter maps like Bind and Sunset (where the Phantom\'s silence has more value).',
      commonMistakes: [
        'Picking a rifle based on appearance rather than the map or role being played.',
        'Ignoring damage falloff on the Phantom when holding very long angles.',
        'Switching weapons every round without a clear reason, preventing muscle memory from building.',
      ],
      example:
        'You\'re holding a long angle on Breeze with a Phantom and land three body shots on a distant target that don\'t quite secure the kill due to falloff — the same shots with a Vandal would have. The next round, you swap for the long sightline and the trade goes your way.',
      drill:
        'Spend a session in the range comparing your spray control and reaction time with each rifle specifically at ranges over 20 meters, where the practical differences show up most.',
      takeaway:
        "Neither rifle is strictly better — match the Vandal's range consistency or the Phantom's stealth to the fight you're actually walking into.",
    },
  },
  {
    id: 'sheriff-fundamentals',
    title: 'Sheriff Fundamentals: The High-Risk Pistol',
    category: 'Weapons',
    excerpt: 'The Sheriff can one-shot headshot on a pistol round — but only if your aim can cash the check.',
    readTime: '4 min',
    difficulty: 'Intermediate',
    updated: '2026-07-25',
    tags: ['Sheriff', 'Pistols', 'Economy'],
    content: {
      whyItMatters:
        "The Sheriff is the only pistol capable of a one-shot headshot kill, which makes it a genuine threat to full-buy rifles when aimed well — but its low fire rate punishes inaccurate players hard.",
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
        'The Sheriff shines on pistol rounds and light-buy rounds where you\'re likely to get a clean angle, and struggles in close-quarters chaos where reload speed and fire rate matter more.',
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
        'The Sheriff is a rifle in a pistol\'s body — only buy it if your aim can commit to one precise shot per duel.',
    },
  },
  {
    id: 'operator-positioning',
    title: 'Operator Positioning: Picks Without Getting Punished',
    category: 'Weapons',
    excerpt: 'The Operator wins any duel at any range — but only if you\'re not the one getting flanked while scoped in.',
    readTime: '6 min',
    difficulty: 'Advanced',
    updated: '2026-08-24',
    tags: ['Operator', 'Positioning', 'Advanced'],
    content: {
      whyItMatters:
        "The Operator can one-shot kill anywhere on the body at any range, making it the strongest single-target weapon in the game — but it's slow to equip and slow to move with while scoped, and extremely expensive to lose. Bad positioning turns its strength into a liability.",
      coreConcept:
        "Playing Operator well is less about the shot itself and more about picking angles where you can't be easily flanked or rushed while scoped in, since the weapon's downsides are punished hardest by anything other than a clean, single-angle duel.",
      steps: [
        'Choose off-angles or positions with a single, clear approach rather than open areas with multiple flank routes.',
        "Have an escape plan before you commit to holding an angle — know which direction you'll retreat if pushed.",
        'Coordinate with teammates to watch your flank while you hold the primary angle, rather than holding completely alone.',
        'Peek to shoot, not to hold — the Operator often performs best as a quick peek-and-reposition weapon rather than a static hold.',
        'After taking a pick, reposition immediately rather than staying in the same spot, since your location is now known.',
      ],
      whenToUseIt:
        "The Operator earns its cost most on maps with long sightlines and on rounds where your team's economy can absorb losing it if the round goes badly.",
      commonMistakes: [
        'Holding a wide-open angle with no flank cover, getting rushed while scoped in.',
        'Staying in the same spot after a pick, letting the enemy team play around your known position.',
        "Overcommitting to the Operator on rounds where the map or the enemy's playstyle doesn't reward long-range holds.",
      ],
      example:
        'You hold a long sightline from a tight off-angle with a single approach route. After landing a pick, you immediately swap to a secondary and reposition rather than staying scoped in — when a flanker checks your old spot seconds later, you\'re already gone.',
      drill:
        'Practice quick-scope duels in the range specifically from off-angle, single-entry positions to build comfort holding angles that are hard to flank.',
      takeaway:
        "The Operator's power is only as good as the angle it's fired from — pick positions that protect you from everything except the duel you're expecting.",
    },
  },

  // -------------------------------------------------------------- STRATEGY
  {
    id: 'reading-rotations',
    title: 'Reading Rotations From Sound Alone',
    category: 'Strategy',
    featured: true,
    excerpt: 'Footsteps, defuse voice lines, and ability sounds tell you where the enemy is going before your teammates do.',
    readTime: '7 min',
    difficulty: 'Intermediate',
    updated: '2026-08-01',
    tags: ['Game Sense', 'Audio', 'Rotations'],
    content: {
      whyItMatters:
        "Every rotation makes noise. The players who climb fastest convert that noise into a mental map, updated every few seconds, rather than waiting for a teammate's callout or the minimap to confirm it.",
      coreConcept:
        "Footstep volume tells you distance; footstep direction (left ear vs right ear) tells you the actual rotation path — and the path matters far more for your decision-making than how close the sound is.",
      steps: [
        'Isolate footstep direction rather than volume when you first hear movement.',
        'Weight ability sounds heavily — a smoke or flash cast on the opposite side of the map is a stronger signal than a single set of footsteps, since it usually commits a whole executing unit.',
        'Cross-reference sound with time — footsteps heard early in the round mean something different than the same sound at the 30-second mark.',
        "Call rotations out loud even when you're not certain, so your team can weigh the information alongside their own reads.",
        'Practice this passively in every match rather than treating it as a separate drill.',
      ],
      whenToUseIt:
        "This applies every round, but it's most valuable in the first 20-30 seconds, when a correct early read lets your team commit to a site before the enemy has fully set up.",
      commonMistakes: [
        'Reacting to every single sound cue as a full rotation, causing your team to whiplash between sites.',
        'Ignoring ability sounds in favor of footsteps, missing the stronger signal.',
        "Staying silent about a read you're not 100% sure of, instead of sharing it as a probability.",
      ],
      example:
        "You hear two sets of footsteps moving toward B and, a second later, a smoke cast on the same side. Instead of waiting for full confirmation, you call 'rotating B, sounds committed' — your team starts shifting immediately instead of losing the five seconds it would take to see it on the minimap.",
      drill:
        "In your next ten matches, try to call one rotation per round based purely on sound before your team's minimap confirms it, and track how often you were right.",
      takeaway:
        "Sound is a live feed of enemy intent — the fastest climbers read it constantly, not just when it's loud enough to be obvious.",
    },
  },
  {
    id: 'economy-management',
    title: 'Economy Management for Solo Queue',
    category: 'Strategy',
    excerpt: "You can't force your team into a full buy, but you can control your own economy well enough to never be the reason it collapses.",
    readTime: '5 min',
    difficulty: 'Beginner',
    updated: '2026-06-18',
    tags: ['Economy', 'Solo Queue'],
    content: {
      whyItMatters:
        "In solo queue, coordinated team buys are rare. The lever you actually control is your own individual economy, so treating it as a personal budget rather than a team decision keeps you useful even when your team's calls are inconsistent.",
      coreConcept:
        "A simple rule protects most solo-queue economies: never drop below enough credits for a full buy two rounds later unless the round is genuinely winnable. Half-buys that don't change the round's outcome just delay your own reset.",
      steps: [
        'Track your own credits every round, independent of what your team seems to be doing.',
        "If your team is clearly forcing and you disagree, consider a light buy — armor plus a cheap weapon — to keep some resistance without bleeding your economy.",
        'Loosely track the enemy\'s economy by round number and loss streaks — a team on a bonus round after two losses is more dangerous than a first-round force.',
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
    category: 'Strategy',
    excerpt: 'The first duel of a fight matters less than who wins the trade that follows it.',
    readTime: '5 min',
    difficulty: 'Intermediate',
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
        'Review a handful of your losses specifically for untraded deaths — count how many of your team\'s losses came from deaths that had no immediate follow-up.',
      takeaway:
        "A duel lost isn't a round lost if it's traded immediately — position to punish, not just to support.",
    },
  },
  {
    id: 'numbers-advantage',
    title: 'Playing a Numbers Advantage',
    category: 'Strategy',
    excerpt: "Being a player up changes what a 'good' decision looks like — here's how to actually convert the advantage.",
    readTime: '5 min',
    difficulty: 'Intermediate',
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
        'This mindset matters most immediately after winning an early duel or a trade that puts you ahead — the first ten seconds after gaining an advantage are when it\'s easiest to give it back through impatience.',
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
        'A numbers advantage is a resource to spend carefully, not a license to play more aggressively — reduce risk, don\'t increase it.',
    },
  },
  {
    id: 'numbers-disadvantage',
    title: 'Playing a Numbers Disadvantage',
    category: 'Strategy',
    excerpt: "Being a player down doesn't mean the round is lost — but it does mean your decisions need to change.",
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-08-08',
    tags: ['Man Disadvantage', 'Decision Making', 'Strategy'],
    content: {
      whyItMatters:
        'Rounds are lost more often by panicked decisions after falling behind than by the numbers disadvantage itself. Knowing how to play a 3v4 correctly turns a likely loss into a real chance.',
      coreConcept:
        "Down a player, your best tool is information and patience, not aggression — you need to find or create a situation where the fight is even again, rather than accepting bad odds in the open.",
      steps: [
        'Regroup with remaining teammates rather than staying spread out and getting picked off individually.',
        'Use utility to isolate a single enemy rather than engaging multiple opponents at once.',
        'Play for information first — knowing where all remaining enemies are lets you choose the fight instead of being ambushed into one.',
        'Consider playing for time on defense, since a delayed round can still be won on the clock or a late retake.',
        "Avoid panicked, low-percentage pushes just to 'do something' — a disciplined rotation beats a desperate peek.",
      ],
      whenToUseIt:
        "This applies the moment a teammate dies without a trade — reassess the round's plan immediately rather than continuing the original strategy shorthanded.",
      commonMistakes: [
        'Continuing an aggressive execute plan meant for full strength after losing a player.',
        'Splitting up further when already outnumbered, making it easier for the enemy to pick you off one at a time.',
        'Forcing risky duels out of frustration rather than looking for a more favorable engagement.',
      ],
      example:
        'Your team is down a player early in a round. Instead of continuing the planned execute, you regroup near a choke point and use a slow, info-heavy approach — when the enemy overextends looking for a pick, you isolate and win a 1v1 that evens the numbers.',
      drill:
        "Review your team's decision-making specifically in the ten seconds right after going down a player — identify moments where the original plan should have been abandoned sooner.",
      takeaway:
        'A numbers disadvantage calls for patience and isolation, not desperation — find a fair fight instead of accepting an unfair one.',
    },
  },
  {
    id: 'mid-round-decision-making',
    title: 'Mid-Round Decision Making',
    category: 'Strategy',
    excerpt: "The plan you made at round start rarely survives contact — here's how to adapt without falling apart.",
    readTime: '6 min',
    difficulty: 'Intermediate',
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
        'Sticking rigidly to the round-start plan even after it\'s clearly been read by the enemy.',
        'Changing plans too often, wasting utility and time without committing to anything.',
        'Multiple teammates making conflicting mid-round calls at the same time.',
      ],
      example:
        "Your team planned an A execute, but a rotation sound confirms three defenders have shifted there. Instead of committing anyway, your IGL calls a switch to B with the utility you have left — the defense, caught mid-rotation, can't reinforce in time.",
      drill:
        'Review a few losses specifically for moments where the original round plan should have changed but didn\'t — identify the information that was available but ignored.',
      takeaway:
        'A plan is a starting point, not a contract — the best teams adjust it constantly based on what the round is actually telling them.',
    },
  },
  {
    id: 'entry-timing',
    title: 'Entry Timing: When to Push, Not Just How',
    category: 'Strategy',
    excerpt: 'A well-executed entry at the wrong moment still loses the fight — timing matters as much as technique.',
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-07-18',
    tags: ['Entry', 'Timing', 'Utility'],
    content: {
      whyItMatters:
        'Entry fraggers are often taught the mechanics of clearing an angle, but timing — when to push relative to your team\'s utility and positioning — decides whether that mechanical skill actually pays off.',
      coreConcept:
        "A good entry push happens at the exact moment your supporting utility (flashes, smokes) takes effect, and with teammates already in trading position — pushing too early or too late wastes both.",
      steps: [
        "Coordinate your push with the exact timing of a flash or smoke, not a rough estimate of when it 'should' be ready.",
        "Confirm trading teammates are in position before committing, not after you've already engaged.",
        "Vary your entry timing round to round — a predictable rhythm lets the defense pre-aim your push.",
        'If supporting utility is delayed or fails, be willing to abort the push rather than entering blind.',
        "Communicate clearly when you're about to go, so trades happen immediately rather than a beat too late.",
      ],
      whenToUseIt:
        "This matters on every coordinated execute, but especially on utility-heavy sites where a mistimed push means walking into an angle your own smoke or flash hasn't actually cleared yet.",
      commonMistakes: [
        'Pushing before a flash has actually popped, walking into a still-sighted angle.',
        "Waiting too long after utility lands, letting its effect expire before you capitalize on it.",
        'Entering without confirming teammates are close enough to trade.',
      ],
      example:
        "Your flash is thrown, but you push a half-second before it actually pops, taking a duel while still able to be seen. The next round, you wait for the flash to visibly land before committing — the enemy is blinded exactly when you round the corner.",
      drill:
        'Practice entry timing in customs with a teammate throwing utility on your call — refine the exact gap between "utility thrown" and "safe to push" until it\'s consistent.',
      takeaway:
        "Entry timing is a coordination skill, not just an aiming one — sync your push to your utility, not to a rough guess.",
    },
  },
  {
    id: 'breaking-enemy-defaults',
    title: 'Breaking Enemy Defaults',
    category: 'Strategy',
    excerpt: 'Every defense has a default setup — learning to recognize and break it turns a predictable round into a free site.',
    readTime: '6 min',
    difficulty: 'Advanced',
    updated: '2026-08-21',
    tags: ['Default', 'Reads', 'Strategy'],
    content: {
      whyItMatters:
        "Most defenses fall back on a consistent default positioning when they don't have strong information. Recognizing that default and specifically attacking its weak points is one of the highest-value reads a team can make.",
      coreConcept:
        "A default is built around covering the most common attack paths with the least risk — which means it usually has at least one area that's lightly watched or slow to reinforce. Breaking the default means identifying and exploiting that gap rather than attacking head-on.",
      steps: [
        'Watch for patterns in where the enemy holds when they have no information — this is their default.',
        'Identify the area of the default that\'s most lightly covered or slowest to reinforce.',
        'Use fake executes or utility to bait the default into committing before your real push, rather than attacking it directly.',
        "Vary your own attack patterns round to round so the enemy can't build a counter-default against you.",
        'Debrief as a team after rounds where the default held — figure out whether it was a good read by the enemy or a predictable mistake on your side.',
      ],
      whenToUseIt:
        "This is most valuable in the middle rounds of a half, once your team has seen enough defensive setups to recognize a pattern, and especially against opponents who don't seem to be adjusting their default round to round.",
      commonMistakes: [
        "Attacking the same 'weak point' every round once it's found, letting the enemy adjust their default against you.",
        'Committing to breaking a default without a fake or feint, walking straight into the strongest part of it instead.',
        'Failing to notice when the enemy has already adjusted their default in response to your reads.',
      ],
      example:
        "You've noticed the enemy defense consistently under-commits to one flank when they have no info. Instead of hitting it directly every round, you fake toward it with utility to bait a rotation, then execute the actual site through the space that rotation vacates.",
      drill:
        "Track the enemy's default setup for the first three rounds of a half before committing to any exploit — patterns take a few reps to confirm.",
      takeaway:
        "A default is a compromise, not a perfect answer — find its weak point and attack it indirectly before the enemy adjusts.",
    },
  },
  {
    id: 'retake-fundamentals',
    title: 'Retake Fundamentals',
    category: 'Strategy',
    excerpt: "Retaking a site isn't about winning a gunfight — it's about controlling information before you commit.",
    readTime: '6 min',
    difficulty: 'Intermediate',
    updated: '2026-08-13',
    tags: ['Retake', 'Utility', 'Strategy'],
    content: {
      whyItMatters:
        'A rushed retake usually loses to a set-up post-plant, even with equal or superior numbers — because the defenders committed to a crossfire and the retaking team is walking in blind. Retakes are won with information and utility, not raw aggression.',
      coreConcept:
        'Before committing to a retake, gather information on the post-plant setup — how many defenders, roughly where, and whether utility has already been used. Only commit once you have a plan that accounts for what you know, not a guess.',
      steps: [
        'Use recon utility to gather information on defender positions before pushing in.',
        "Coordinate entry from multiple angles simultaneously rather than funneling through a single choke the post-plant is set up to cover.",
        'Save at least one piece of utility specifically for the defuse window, not just the initial push.',
        'Communicate confirmed kills and remaining defender count constantly during the retake, not just at the start.',
        "If the information suggests the retake isn't winnable in time, consider playing for a delayed defuse or trading the spike's value against the round instead of forcing a loss.",
      ],
      whenToUseIt:
        'Every retake benefits from this approach, but it\'s most critical when the defending team had time to fully set up their post-plant.',
      commonMistakes: [
        'Rushing in as soon as the spike is planted without any information on defender positions.',
        'Funneling the whole team through one entry point, walking into a crossfire the setup was built to punish.',
        'Using all retake utility on the initial push, leaving nothing for the actual defuse.',
      ],
      example:
        'The spike is planted and your team has three players left. Instead of rushing in immediately, you use a recon ability to confirm two defenders are holding a crossfire near the plant — your team enters from two separate angles at once, splitting the crossfire before it can be used as intended.',
      drill:
        'In scrims or customs, practice retakes specifically with a teammate calling out confirmed information before your team commits, rather than pushing on instinct.',
      takeaway:
        'A retake is an information problem first and a gunfight second — gather what you can before committing to how you enter.',
    },
  },

  // --------------------------------------------------------------- UTILITY
  {
    id: 'smoke-lineups-ascent',
    title: 'Five Smoke Lineups Every Ascent Player Should Know',
    category: 'Utility',
    excerpt: 'Fast, repeatable lineups for both sites that do not require a controller-main memory bank.',
    readTime: '6 min',
    difficulty: 'Beginner',
    updated: '2026-07-05',
    tags: ['Ascent', 'Smokes', 'Lineups'],
    maps: ['Ascent'],
    content: {
      whyItMatters:
        'Ascent rewards fast, simple executes more than almost any other map, which means your smoke lineups need to be quick to line up under pressure rather than technically impressive.',
      coreConcept:
        "The goal of a good lineup isn't complexity — it's speed and reliability. A smoke you can throw in under three seconds from a consistent spot beats a technically 'better' smoke that takes ten seconds to line up correctly.",
      steps: [
        'Learn the Market smoke from spawn first — it covers the single most contested angle on the map and takes under two seconds to line up from a fixed position.',
        'On B site, learn the Generator smoke, which removes the most common retake angle without needing a second controller ability to back it up.',
        "Practice each lineup from the exact spawn position you'll actually be standing in during a real round, not an idealized spot.",
        'Time yourself — aim to get each lineup under three seconds from ability-press to confirmed placement.',
        "Once comfortable, practice calling the smoke's timing out loud so your team can sync their push to it.",
      ],
      whenToUseIt:
        "Use these on standard executes where speed matters more than a perfectly optimized smoke placement — save more complex lineups for rounds where your team has time to set them up properly.",
      commonMistakes: [
        "Practicing lineups from a spot you won't actually be standing in during a live round.",
        "Prioritizing a 'perfect' smoke placement over speed, giving away the execute's timing.",
        'Not communicating smoke timing to teammates, causing pushes to be mistimed around it.',
      ],
      example:
        'Your team calls an A execute. Instead of walking to a precise spot and carefully lining up a smoke, you use your practiced two-second Market lineup from spawn — the execute starts on time instead of being delayed by a slow smoke setup.',
      drill:
        'Practice these lineups until they take under three seconds from ability-press to confirmed line — anything slower gives away your execute\'s timing.',
      takeaway:
        'A fast, reliable lineup beats a technically perfect one that takes too long to set up under pressure.',
    },
  },
  {
    id: 'smoke-fundamentals',
    title: 'Smoke Fundamentals: Blocking Information, Not Just Angles',
    category: 'Utility',
    excerpt: "A smoke's real job is to control what the enemy knows, not just what they can see.",
    readTime: '5 min',
    difficulty: 'Beginner',
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
        'Re-smoke a lineup that\'s about to expire if the round state still calls for denying that angle.',
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
    title: 'Flash Timing: The Difference Between a Blind Enemy and a Wasted Flash',
    category: 'Utility',
    excerpt: 'A perfectly aimed flash that pops too early or too late is functionally the same as no flash at all.',
    readTime: '5 min',
    difficulty: 'Intermediate',
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
        'Use off-angle or blind throws (bouncing around a corner) when a direct throw would expose you to the same angle you\'re trying to counter.',
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
        "A flash only works during its blind window — sync your push to that window exactly, not to a rough guess.",
    },
  },
  {
    id: 'initiator-utility-management',
    title: 'Initiator Utility: Using Information Before You Need It',
    category: 'Utility',
    excerpt: "Initiator utility is most valuable spent early, gathering information you can act on — not saved until it's too late.",
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-08-15',
    tags: ['Initiator', 'Recon', 'Utility'],
    content: {
      whyItMatters:
        'Recon and initiator utility loses most of its value if it\'s used reactively, after a fight has already started. Its real strength is telling your team what to expect before you commit to a plan.',
      coreConcept:
        'Initiator utility should usually be spent to inform a decision, not to win a duel directly — knowing where two enemies are standing is often worth more than the small amount of direct damage or disruption the ability provides.',
      steps: [
        'Use recon utility before committing bodies to a push, not as a follow-up after contact.',
        "Communicate the information gained immediately and specifically — exact positions, not vague callouts.",
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
    category: 'Utility',
    excerpt: "Sentinel utility works best when it actively denies the enemy a route, not when it's placed and forgotten.",
    readTime: '5 min',
    difficulty: 'Intermediate',
    updated: '2026-07-12',
    tags: ['Sentinel', 'Flank Watch', 'Utility'],
    content: {
      whyItMatters:
        "Sentinel utility (trips, slows, anchors) is often treated as a passive 'set and forget' tool, but its real value comes from actively shaping where the enemy is willing to go — a well-placed piece of utility changes enemy behavior even if it's never directly triggered.",
      coreConcept:
        "The goal of sentinel utility is to make a route expensive enough that the enemy avoids it, buying your team time or forcing them into a worse route entirely — not just to get a single trade if someone walks into it.",
      steps: [
        'Place utility on the routes an enemy is most likely to use for a flank, not just the most obvious open path.',
        'Reposition sentinel utility as the round develops — a placement that made sense at round start may be irrelevant two rotations later.',
        'Communicate immediately when utility is triggered, since it usually means a flank attempt is in progress right now.',
        'Use sentinel utility to buy time for a rotation, not just to secure a kill — even an avoided trap has done its job.',
        "Don't over-commit charges to flank watch on rounds where your team already has strong map control from another source.",
      ],
      whenToUseIt:
        "This matters most when your team is executing a site and leaving your back exposed, or when defending a site alone and needing early warning of a flank.",
      commonMistakes: [
        'Placing utility once at round start and never adjusting it as the round develops.',
        'Treating a triggered trap as the goal, rather than valuing the routes it successfully denied.',
        'Failing to communicate a triggered trap quickly enough for the team to react.',
      ],
      example:
        'You place flank-watch utility on a common rotation path while your team executes the opposite site. A flanking enemy triggers it — even though they escape without dying, the delay and noise give your team enough warning to finish the execute before the flank can interfere.',
      drill:
        'Track how often your placed utility is triggered versus how often it changes an enemy\'s route without being triggered at all — both count as a win.',
      takeaway:
        'Sentinel utility succeeds by shaping enemy behavior, not just by securing a kill when someone walks into it.',
    },
  },
  {
    id: 'post-plant-utility',
    title: 'Post-Plant Utility: Spending What You Have Left',
    category: 'Utility',
    excerpt: 'The utility you save for after the plant often matters more than what you used to get there.',
    readTime: '5 min',
    difficulty: 'Intermediate',
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

  // ----------------------------------------------------------- MENTAL GAME
  {
    id: 'tilt-proofing',
    title: 'Tilt-Proofing a Losing Half',
    category: 'Mental Game',
    excerpt: 'The players who climb consistently are not the ones who never tilt — they are the ones whose tilt does not change their decision-making.',
    readTime: '5 min',
    difficulty: 'Intermediate',
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
    id: 'recovering-after-losing-rounds',
    title: 'Recovering After Losing Rounds',
    category: 'Mental Game',
    excerpt: 'How you play the round immediately after a loss says more about your rank ceiling than how you play after a win.',
    readTime: '4 min',
    difficulty: 'Beginner',
    updated: '2026-07-08',
    tags: ['Mindset', 'Consistency'],
    content: {
      whyItMatters:
        "A single lost round rarely loses a game on its own — but a string of rounds played poorly because of frustration after that loss often does. Recovery speed between rounds is a trainable skill, not a fixed trait.",
      coreConcept:
        "Fast recovery comes from treating each round as its own decision space, separate from the last one, rather than carrying frustration or overcorrection into the next round's calls.",
      steps: [
        'Give yourself a fixed, short window to feel frustrated, then deliberately shift focus to the next round\'s plan.',
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
    title: 'Avoiding Autopilot: Staying Engaged for 24 Rounds',
    category: 'Mental Game',
    excerpt: "The rounds you lose to inattention rarely feel like a mechanical failure — they feel like nothing happened at all.",
    readTime: '4 min',
    difficulty: 'Intermediate',
    updated: '2026-08-10',
    tags: ['Focus', 'Consistency', 'Mindset'],
    content: {
      whyItMatters:
        'Long matches make it easy to slip into autopilot — running the same default, checking the same angles, without actually processing new information. Autopilot rounds are some of the easiest to lose, because you\'re not really adapting to what\'s happening.',
      coreConcept:
        'Staying engaged isn\'t about trying harder in a vague sense — it\'s about deliberately asking a few active questions each round instead of repeating the same routine by habit.',
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
        'Pick one specific detail to actively track each round (an enemy\'s utility usage, a rotation pattern) for a full half, and notice how much more information you retain compared to a passive match.',
      takeaway:
        "Autopilot loses rounds quietly — stay actively engaged by asking what's different this round, not just repeating the last one.",
    },
  },
  {
    id: 'maintaining-consistency',
    title: 'Maintaining Consistency Across a Session',
    category: 'Mental Game',
    excerpt: 'Your best round and your worst round in the same session are usually closer in skill than they feel — consistency is a mental skill, not a talent gap.',
    readTime: '5 min',
    difficulty: 'Intermediate',
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
    id: 'decision-making-under-pressure',
    title: 'Decision Making Under Pressure',
    category: 'Mental Game',
    excerpt: "Clutch situations don't require different mechanics — they require the same decisions made without the extra noise pressure adds.",
    readTime: '5 min',
    difficulty: 'Advanced',
    updated: '2026-08-23',
    tags: ['Clutch', 'Mindset', 'Decision Making'],
    content: {
      whyItMatters:
        'In high-pressure moments — a 1vX clutch, match point, a must-win round — players often abandon sound fundamentals in favor of desperate, low-percentage plays. The skill gap in clutch situations is usually decision-making, not mechanics.',
      coreConcept:
        'Pressure narrows attention and pushes toward action for its own sake. Staying with slow, information-based decision-making — the same process you\'d use in a normal round — usually outperforms the instinct to force something dramatic.',
      steps: [
        'Slow down your information-gathering specifically in high-pressure moments, since the instinct is to speed up and gather less.',
        'Isolate one opponent at a time rather than trying to solve the whole situation at once.',
        "Use the same crosshair placement and pre-aim habits you'd use in any other round — pressure doesn't change what wins a duel.",
        'Play for time when the situation allows it (spike timer, remaining round time) rather than forcing an immediate resolution.',
        'Accept that some clutch situations are genuinely low-percentage — playing them out with sound decisions is still better than a low-percentage all-in.',
      ],
      whenToUseIt:
        'This applies specifically to 1vX situations, match points, and any moment where the outcome of a single round carries unusually high stakes.',
      commonMistakes: [
        'Rushing decisions specifically because the moment feels high-pressure, gathering less information than usual.',
        'Trying to fight multiple remaining enemies at once instead of isolating them one at a time.',
        'Abandoning normal aim fundamentals in favor of a panicked flick-and-pray.',
      ],
      example:
        "You're in a 1v2 with the spike planted and time on your side. Instead of rushing to find both enemies immediately, you use sound and patience to isolate one at a time — the same discipline you'd use in an even round — and the situation resolves in your favor because you didn't add unnecessary risk.",
      drill:
        'Practice 1vX scenarios in customs specifically focusing on maintaining normal pre-aim and pacing habits, rather than optimizing for speed alone.',
      takeaway:
        'Pressure changes how a situation feels, not what actually wins it — the same fundamentals that work in a normal round work here too.',
    },
  },
]

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

export function getGuideById(id) {
  return guides.find((g) => g.id === id)
}

export function getFeaturedGuide() {
  return guides.find((g) => g.featured) || guides[0]
}

export function getRelatedGuides(guide, limit = 3) {
  return guides.filter((g) => g.category === guide.category && g.id !== guide.id).slice(0, limit)
}

// Only categories that actually have guides — an empty filter with zero
// results isn't useful, so it's left out rather than shown as a dead end.
export function getActiveCategories() {
  const counts = new Map()
  for (const g of guides) counts.set(g.category, (counts.get(g.category) || 0) + 1)
  return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
}

// Builds the searchable text for one guide: title, excerpt, category,
// difficulty, tags, maps, and topics (topics are search-only synonyms that
// don't render as chips). Used by both the live search box and any future
// search surface so the matching logic only lives in one place.
function searchHaystack(guide) {
  return [
    guide.title,
    guide.excerpt,
    guide.category,
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
// it, used for the personalized "Tactical Gaps Detected" / Training Path
// section. Skills with no matching guide yet resolve to null rather than a
// loose/fake match.
const SKILL_TO_GUIDE = {
  'Aim & Mechanics': 'crosshair-codes',
  'Utility Usage': 'smoke-lineups-ascent',
  'Positioning': 'post-plant-bind',
  'Game Sense': 'reading-rotations',
  'Economy Mgmt': 'economy-management',
  'Communication': null,
}

// Short, human framing for each skill gap, shown as the numbered step label
// in the Training Path section (e.g. "01 — Fix your positioning").
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
