// DEMO DATA — marketing-only sample player for the public Landing page
// showcase. Development/demo-only mock data: never use as production player
// data, never merge into a signed-in user, never send to the AI Coach.
// Every place that renders it must label it "SAMPLE PLAYER" / "DEMO DATA".
// The only allowed importers are Landing.jsx and PlatformShowcase.jsx
// (enforced by src/demo/demo-isolation.test.js).
export const SAMPLE_PLAYER = {
  username: 'SamplePlayer',
  level: 42,
  xp: 8450,
  xpToNextLevel: 10000,
  rank: {
    tier: 'Diamond',
    division: 2,
    rr: 47,
  },
  skillMatrix: [
    { skill: 'Aim & Mechanics', score: 78 },
    { skill: 'Game Sense', score: 61 },
    { skill: 'Utility Usage', score: 82 },
    { skill: 'Positioning', score: 57 },
    { skill: 'Communication', score: 69 },
    { skill: 'Economy Mgmt', score: 74 },
  ],
  recommendedNext: {
    title: 'Smoke Timings for Retakes',
  },
}
