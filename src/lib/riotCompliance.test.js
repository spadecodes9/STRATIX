// Run with: npm test
// Guards Riot's required texts against drift or paraphrase.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RIOT_LEGAL_NOTICE, RIOT_LINKING_DISCLOSURE } from '../data/legal.js'

const SRC = fileURLToPath(new URL('..', import.meta.url))
const read = (rel) => readFileSync(join(SRC, rel), 'utf8')
const sourceFiles = (function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
})(SRC)
  .map((f) => relative(SRC, f).split(sep).join('/'))
  .filter((f) => /\.(jsx?)$/.test(f) && !f.endsWith('.test.js'))

// Riot Developer Policies, "Legal Jibber Jabber" — verbatim template.
const RIOT_TEMPLATE =
  "[Your product] isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc."

test('legal notice is Riot\'s exact wording with only the product name substituted', () => {
  assert.equal(RIOT_LEGAL_NOTICE, RIOT_TEMPLATE.replace('[Your product]', 'STRATIX'))
})

test('legal notice is rendered site-wide (footer) and nothing still paraphrases it', () => {
  const footer = read('components/layout/Footer.jsx')
  assert.match(footer, /import \{ RIOT_LEGAL_NOTICE \} from '..\/..\/data\/legal.js'/)
  assert.match(footer, /\{RIOT_LEGAL_NOTICE\}/)
  const paraphrases = sourceFiles.filter((f) => f !== 'data/legal.js' && /not affiliated with|isn't endorsed by Riot|not endorsed by Riot/i.test(read(f)))
  assert.deepEqual(paraphrases, [])
})

test('linking disclosure contains Riot\'s required statement', () => {
  assert.match(RIOT_LINKING_DISCLOSURE, /Account linking makes player data public\./)
})

test('every control that starts a Riot link shows the disclosure before opt-in', () => {
  const starters = sourceFiles.filter((f) => /riot\.connect\b|onClick=\{onRiot\}/.test(read(f)))
  assert.deepEqual(starters.sort(), ['components/auth/OAuthButtons.jsx', 'components/riot/Riot.jsx', 'pages/AICoach.jsx'])
  for (const f of starters) {
    const text = read(f)
    const linkControls = (text.match(/riot\.connect\b|onClick=\{onRiot\}/g) || []).length
    const disclosures = (text.match(/<RiotLinkDisclosure\b/g) || []).length
    assert.ok(disclosures >= linkControls, `${f}: ${linkControls} Riot link control(s) but ${disclosures} disclosure(s)`)
  }
})
