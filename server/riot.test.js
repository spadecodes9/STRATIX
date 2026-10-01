// Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { signState, verifyState, tierName, mapName, summarizeMatches } from './riot.js'

const SECRET = 'test-secret'

test('state round-trips only with matching nonce, valid MAC, and before expiry', () => {
  const state = signState({ mode: 'link', userId: 'u1', nonce: 'n1', exp: 2000 }, SECRET)
  assert.equal(verifyState(state, 'n1', SECRET, 1000).userId, 'u1')
  assert.equal(verifyState(state, 'other-browser', SECRET, 1000), null)
  assert.equal(verifyState(state, 'n1', 'wrong-secret', 1000), null)
  assert.equal(verifyState(state, 'n1', SECRET, 3000), null)
  const [body, mac] = state.split('.')
  const forged = Buffer.from(JSON.stringify({ mode: 'link', userId: 'attacker', nonce: 'n1', exp: 2000 })).toString('base64url')
  assert.equal(verifyState(`${forged}.${mac}`, 'n1', SECRET, 1000), null)
  assert.equal(verifyState(body, 'n1', SECRET, 1000), null)
})

test('tier and map names', () => {
  assert.equal(tierName(3), 'Iron 1')
  assert.equal(tierName(20), 'Diamond 3')
  assert.equal(tierName(26), 'Immortal 3')
  assert.equal(tierName(27), 'Radiant')
  assert.equal(tierName(0), null)
  assert.equal(mapName('/Game/Maps/Duality/Duality'), 'Bind')
  assert.equal(mapName('/Game/Maps/Ascent/Ascent'), 'Ascent')
})

test('summarizeMatches computes stats only for the given puuid', () => {
  const match = (id, queueId, won, tier, stats, hs) => ({
    matchInfo: { matchId: id, mapId: '/Game/Maps/Ascent/Ascent', queueId, gameStartMillis: 0 },
    players: [
      { puuid: 'me', teamId: 'Red', characterId: 'AGENT-1', competitiveTier: tier, stats },
      { puuid: 'other', teamId: 'Blue', characterId: 'x', competitiveTier: 27, stats: { kills: 99, deaths: 0, score: 9999, roundsPlayed: 1 } },
    ],
    teams: [{ teamId: 'Red', won }, { teamId: 'Blue', won: !won }],
    roundResults: [{ playerStats: [{ puuid: 'me', damage: [{ headshots: hs, bodyshots: 10 - hs, legshots: 0 }] }] }],
  })
  const s = summarizeMatches('me', [
    match('m1', 'unrated', true, 0, { kills: 20, deaths: 10, assists: 2, score: 4000, roundsPlayed: 20 }, 3),
    match('m2', 'competitive', false, 19, { kills: 10, deaths: 20, assists: 5, score: 2000, roundsPlayed: 20 }, 1),
    match('m3', 'competitive', true, 18, { kills: 1, deaths: 1, assists: 0, score: 100, roundsPlayed: 1 }, 0),
  ], { 'agent-1': 'Jett' })

  assert.deepEqual(s.rank, { tier: 19, name: 'Diamond 2' }) // newest competitive, not the other player's Radiant
  assert.equal(s.mostPlayedAgent, 'Jett')
  assert.deepEqual(s.stats, { matches: 3, winRate: 67, kd: 1, acs: 149, headshotPct: 13 })
  assert.equal(s.recentMatches[1].result, 'loss')
  assert.equal(s.recentMatches[0].acs, 200)
})

test('no matches -> no stats, no rank (never a placeholder)', () => {
  assert.deepEqual(summarizeMatches('me', []), { rank: null, mostPlayedAgent: null, stats: null, recentMatches: [] })
})
