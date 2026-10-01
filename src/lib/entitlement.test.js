// Run with: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CURRENT_VALORANT_PATCH } from '../data/patch.js'
import { canAccess, canUseTheme, computeIsPremium, FREE_THEMES, PREMIUM_FEATURES, THEMES } from './entitlement.js'
import { premiumFeatures } from '../data/premiumFeatures.js'
import { guides } from '../data/guides.js'
import { PREMIUM_GUIDE_CONTENT } from '../../server/premiumGuides.js'

test('computeIsPremium: active lifetime, or active patch entitlement for the current patch only', () => {
  assert.equal(computeIsPremium({ status: 'active', entitlement_type: 'lifetime' }), true)
  assert.equal(computeIsPremium({ status: 'active', entitlement_type: 'patch', patch_version: CURRENT_VALORANT_PATCH }), true)
  assert.equal(computeIsPremium({ status: 'active', entitlement_type: 'patch', patch_version: 'old' }), false)
  assert.equal(computeIsPremium({ status: 'none', entitlement_type: 'lifetime' }), false)
  assert.equal(computeIsPremium(null), false)
})

test('canAccess / canUseTheme follow the plan, and unknown features fail loudly', () => {
  for (const feature of Object.keys(PREMIUM_FEATURES)) {
    assert.equal(canAccess(feature, true), true)
    assert.equal(canAccess(feature, false), false)
  }
  assert.throws(() => canAccess('typo-feature', true))
  for (const theme of THEMES) assert.equal(canUseTheme(theme, false), FREE_THEMES.includes(theme))
  for (const theme of THEMES) assert.equal(canUseTheme(theme, true), true)
})

test('every "live" comparison row names a real entitlement key', () => {
  const live = premiumFeatures.filter((f) => f.status === 'live')
  assert.ok(live.length > 0)
  for (const f of live) assert.ok(f.entitlement in PREMIUM_FEATURES, f.id)
})

test('premium guide bodies exist only on the server, never in client source', () => {
  const premium = guides.filter((g) => g.premium)
  assert.deepEqual(premium.map((g) => g.id).sort(), Object.keys(PREMIUM_GUIDE_CONTENT).sort())
  for (const g of premium) assert.equal(g.content, undefined, `${g.id} ships content to the browser`)

  // No sentence of any premium body may appear anywhere under src/.
  const SRC = fileURLToPath(new URL('..', import.meta.url))
  const files = (function walk(dir) {
    return readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]))
  })(SRC).filter((f) => /\.(jsx?|tsx?|json)$/.test(f))
  const corpus = files.map((f) => readFileSync(f, 'utf8')).join('\n')
  for (const body of Object.values(PREMIUM_GUIDE_CONTENT)) {
    for (const text of [body.whyItMatters, body.takeaway, ...body.steps]) {
      assert.ok(!corpus.includes(text.slice(0, 60)), `premium text found in src: "${text.slice(0, 40)}…"`)
    }
  }
})
