// Run with: npm test
// Guards the "no fake player data" rule: sample data may only reach the
// public, labeled Landing showcase — never an authenticated page, context,
// or the AI Coach.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('..', import.meta.url))
const ALLOWED = new Set(['pages/Landing.jsx', 'components/landing/PlatformShowcase.jsx'])

const sourceFiles = (function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
})(SRC)
  .map((f) => relative(SRC, f).split(sep).join('/'))
  .filter((f) => /\.(jsx?|tsx?)$/.test(f) && !f.startsWith('demo/'))

const read = (f) => readFileSync(join(SRC, f), 'utf8')

test('only the labeled Landing showcase imports demo data', () => {
  const offenders = sourceFiles.filter((f) => /samplePlayer|SAMPLE_PLAYER/.test(read(f)) && !ALLOWED.has(f))
  assert.deepEqual(offenders, [])
})

test('no hardcoded sample rank / identity values outside demo data', () => {
  const offenders = sourceFiles.filter((f) => /\bDiamond 2\b|\b47 RR\b|ShadowStrike|currentUser/.test(read(f)))
  assert.deepEqual(offenders, [])
})
