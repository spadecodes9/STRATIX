// public/sitemap.xml is a static file: this keeps it in step with the guide
// data and keeps private/auth routes out of it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { guides } from '../data/guides.js'

const sitemap = readFileSync(new URL('../../public/sitemap.xml', import.meta.url), 'utf8')
const robots = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const paths = locs.map((u) => new URL(u).pathname)

test('sitemap lists every free guide, and no Premium-locked guide', () => {
  const listed = paths.filter((p) => p.startsWith('/guides/')).map((p) => p.slice('/guides/'.length)).sort()
  const free = guides.filter((g) => !g.premium).map((g) => g.id).sort()
  assert.deepEqual(listed, free)
})

test('sitemap uses only canonical production URLs, no duplicates, no private routes', () => {
  assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
  assert.ok(locs.every((u) => u.startsWith('https://www.stratix.pro/')))
  assert.equal(new Set(locs).size, locs.length)
  for (const p of paths) {
    assert.ok(!/^\/(dashboard|ai-coach|profile|sign-in|create-account|auth|api)(\/|$)/.test(p), p)
  }
})

test('robots.txt allows crawling and points to the sitemap', () => {
  assert.match(robots, /^User-agent: \*$/m)
  assert.match(robots, /^Allow: \/$/m)
  assert.match(robots, /^Sitemap: https:\/\/www\.stratix\.pro\/sitemap\.xml$/m)
})
