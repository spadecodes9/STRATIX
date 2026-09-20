# STRATIX: Remove Courses, Add Premium Hub + Theme System

Status: Approved by user 2026-09-20. Proceeding directly to implementation plan per user instruction (no separate spec-review pause).

## Overview

Two changes to the existing STRATIX app, bundled because the second (Premium)
subsumes navbar/profile work that touches the same surfaces as the first
(Courses removal):

1. Remove the not-yet-launched Courses section completely (nav, routes,
   pages, cross-references) while keeping the rest of the app intact. Fully
   recoverable via git history if reintroduced later — nothing is soft-hidden.
2. Add a Premium subsystem: a golden navbar tab, a modular Premium Hub page,
   a real (non-boolean) entitlement data model, a site-wide theme
   customization system (red/blue/green/gold accents) gated to Premium, and
   light gating on two existing features (AI Coach, Guides) to demonstrate
   the entitlement hook end-to-end.

No payment provider exists yet and none is built here. The entitlement model
is shaped so a future webhook handler has a natural row to write to.

## Non-goals (explicitly out of scope this pass)

- Real payment/subscription provider integration or webhooks.
- Server-persisted AI Coach usage counts (see "AI Coach gating" below — this
  is the one point the user corrected during design review).
- Enforcement beyond AI Coach + Guides (Crosshair, Match/VOD, Saved Configs,
  Quizzes stay hook-ready but unenforced).
- A real Crosshair Generator tool (doesn't exist in the codebase today — Hub
  card is a styled placeholder, matching the existing Quizzes "Coming soon"
  pattern).
- Full-app theme coverage of decorative/illustrative graphics that use raw
  hex/rgba instead of the shared CSS custom properties (e.g. the Landing
  page hero visualization). Core UI chrome (buttons, borders, nav, cards,
  focus states, progress bars) already uses the shared tokens and retheme
  automatically; anything that doesn't is listed in the implementation
  plan's file list so it's a known, named gap, not a silent one.

## 1. Remove Courses

Hard delete (not feature-flagged/hidden) — this is a git repo, full history
stays recoverable.

**Delete outright:**
- `src/pages/Courses.jsx`, `src/pages/CourseDetail.jsx`, `src/pages/LessonView.jsx`
- `src/pages/Courses.css`
- `src/components/courses/CourseCard.jsx`
- `src/data/courses.js`

**Edit to remove references (file stays, only Courses-specific parts go):**
- `src/App.jsx` — remove `/courses`, `/courses/:courseId`,
  `/courses/:courseId/lessons/:lessonId` routes and their imports.
- `src/components/layout/Navbar.jsx` — remove the Courses `navLinks` entry.
- `src/components/layout/Footer.jsx` — remove the Courses link.
- `src/components/landing/PlatformShowcase.jsx` — remove the `courses` tile
  from its config array.
- `src/pages/Landing.jsx` — remove any Courses-specific copy/links.
- `src/pages/Dashboard.jsx` — remove the "Courses completed" `StatCard`.
- `src/components/dashboard/ContinueLearning.jsx` — remove
  Courses-progress-specific rendering (keep whatever else it renders, e.g.
  recommended-next-lesson-independent content, if any exists after removal —
  otherwise the component may become Courses-only and get deleted too;
  confirm during implementation).
- `src/pages/Quizzes.jsx` — its footer CTA currently links to `/courses` and
  says "Courses and Guides cover the same ground"; rewrite to drop the
  Courses reference (Guides only).
- `src/pages/Profile.jsx` / `src/pages/Profile.css` — remove the
  `activeCourses` / `course-progress-panel` block.
- `src/data/user.js` — remove `courseProgress` and `stats.coursesCompleted`
  fields (check other readers of these fields before deleting).
- `src/pages/Disclaimer.jsx` — remove the Courses mention in copy.

Implementation will re-grep for `Course` across `src/` immediately before
starting, since some of this may have shifted between design and build.

## 2. Premium navbar tab

`Navbar.jsx`'s `navLinks` array gets a `Premium` entry, rendered with an
additional `nav-link-premium` class so it can be styled independently of
the other five links rather than sharing their look:

- New tokens in `src/index.css`: `--gold`, `--gold-bright`, `--gold-glow`
  (paralleling the existing `--red`/`--red-bright`/`--red-glow` trio).
- Rest state: gold text, subtle glow via `box-shadow` using `--gold-glow`.
- Hover: brighter glow + slight lift, consistent with how `.oauth-btn:hover`
  and other existing hover states already animate (`transform:
  translateY(-1px)`, border/shadow brighten) — reusing that existing motion
  language rather than inventing a new one.
- Links to `/premium`. No premium functionality lives in the navbar itself.

## 3. Premium Hub — architecture

New route `/premium` → `src/pages/Premium.jsx`, added to `App.jsx` (not
behind `ProtectedRoute` — signed-out visitors should be able to see what
Premium offers; individual actions like "Upgrade" prompt sign-in same as
other CTAs do today).

**Data-driven feature cards:** `src/data/premiumFeatures.js` exports an
array of `{ id, icon, title, freeDescription, premiumDescription, status }`
objects (status: `'gated'` for AI Coach/Guides which have real enforcement,
`'coming-soon'` for everything else per the free/premium table). One
`src/components/premium/PremiumFeatureCard.jsx` renders each entry. Adding
a future feature later is a new array entry, not new markup.

Page sections, top to bottom: hero ("Unlock STRATIX Premium" + subtitle),
feature card grid (from the config above), Theme Customization section
(§5/§6), Premium Quizzes section (§7).

## 4. Entitlement architecture

**New Supabase table `subscriptions`** (not a `profiles.is_premium`
boolean):

| column | type | notes |
|---|---|---|
| `id` | uuid, pk, default `gen_random_uuid()` | |
| `user_id` | uuid, fk → `auth.users.id` | one row per user |
| `plan` | text | e.g. `'free'`, `'premium'` |
| `status` | text | `'active'` \| `'canceled'` \| `'none'` |
| `current_period_end` | timestamptz, nullable | when a real provider exists |
| `created_at` | timestamptz, default `now()` | |
| `updated_at` | timestamptz, default `now()` | |

RLS: user can `select` their own row; no `insert`/`update`/`delete` from the
client (a future webhook handler, running with service-role or via an edge
function, is the only writer — matches "do not create fake payment
verification").

Every existing user gets a `status: 'none'` row (migration backfills one
per existing `auth.users` row, same pattern as the existing
`profiles`-per-user setup). No row / `status !== 'active'` ⇒ free tier.

**`usePremium()` hook** (`src/context/` or alongside `AuthContext`) reads
this table the same way `AuthContext` already reads `profiles` — joined at
session-load time in the same effect, exposed as
`{ isPremium, plan, status, isLoading }`. This is the **only** thing pages
are allowed to treat as the entitlement source of truth.

### AI Coach gating — explicitly temporary, documented as such

Per your clarification: the 3-free-chat cap is a **client-side UX gate for
this phase only**, not real enforcement. Concretely:

- A `useState` counter in `AICoach.jsx` counts user-sent messages this
  page-session (resets on reload). When a free user (`!isPremium` from the
  real `usePremium()` hook) hits 3, further sends are blocked in the UI with
  an upgrade prompt instead of calling `getCoachResponse`.
- **What stays server-verified regardless:** `isPremium` itself always comes
  from `usePremium()` → the real `subscriptions` table — never from
  `localStorage`, a frontend variable, or anything client-only. The part
  that's temporary is only the *usage count*, not the *entitlement check*.
- A prominent code comment at the counter (`// TEMPORARY: client-side
  session counter, not persisted or abuse-resistant...`) plus a line item in
  this spec's "next stage" list (below) documents the gap explicitly.
- **Documented path to real enforcement** (not built now): a `usage_events`
  table (`user_id`, `event_type`, `created_at`) or a `usage_counters` row
  per user/day, incremented by the existing `server/index.js` Express
  endpoint (which already sits between the browser and OpenRouter) on every
  AI Coach request — that endpoint would check `subscriptions.status` +
  the day's count server-side *before* calling OpenRouter, and reject once a
  free user hits 3. Because `server/index.js` is already the only path to
  the model provider (confirmed while reading `coachService.js` — the
  browser never calls OpenRouter directly), this slots in without a new
  service being introduced later.

### Guides gating

`src/data/guides.js` entries get a `premium: boolean` field. Rule:
**Advanced-difficulty guides default to `premium: true`**, everything else
free — a defensible split from data that already exists (difficulty), not
an arbitrary per-guide pick. `GuideCard.jsx` shows a lock affordance on
gated guides for non-Premium viewers; `GuideDetail.jsx` shows a paywall
panel instead of the guide body ("🔒 Premium Guide — Upgrade to unlock")
when a non-Premium user opens one directly by URL.

## 5. Theme system

Extends the existing token system in `src/index.css` rather than
introducing a parallel one:

- Existing accent tokens (`--red`, `--red-bright`, `--red-dim`,
  `--red-glow`, `--red-glow-soft`) are refactored to derive from one new
  `--accent-rgb: 255 59 78` triplet, e.g.
  `--red-glow: rgb(var(--accent-rgb) / .28)`. Token *names* stay the same
  (no mass rename across ~30 files that already reference them) — only
  their definitions change to be derived.
- `src/context/ThemeContext.jsx` sets `data-theme="red|blue|green|gold"` on
  `<html>` and each theme is a small block in `index.css`:
  `:root[data-theme="blue"] { --accent-rgb: <blue rgb>; }` etc. Default
  (no attribute / `"red"`) matches the current live palette exactly — no
  visual change for anyone who never opens the selector.
- Wherever code already uses these tokens (buttons, borders, active nav
  states, focus rings, cards, progress bars, badges — confirmed widespread
  via grep across `Auth.css`, `Profile.css`, `layout.css`, `ui.css`, etc.),
  retheming is automatic.
- **Known gap** (see Non-goals): a handful of spots — notably the Landing
  page hero visualization — use literal hex/rgba instead of the tokens and
  won't retheme this pass. Named explicitly in the implementation plan.

## 6. Theme transition

CSS-only, no JS color interpolation: a `.theme-transitioning` class toggled
on `<html>` for ~500ms around the `data-theme` change, scoping `transition:
background-color .4s ease, border-color .4s ease, box-shadow .4s ease,
color .4s ease` to the token-driven elements. Wrapped in `@media
(prefers-reduced-motion: no-preference)` — reduced-motion users get an
instant switch.

## 7. Theme selector + paywall

Inside the Hub's Theme Customization section: 4 swatch buttons, each a
small live preview chip rendered with that theme's *actual* token values
(no separately-maintained fake preview colors). Hover = scale + glow.
Selected = checkmark + glow, consistent with existing "active state"
patterns already in the codebase (e.g. `nav-link-active`).

- Free users can click any swatch. Selecting a non-default theme opens a
  small inline panel: "🔒 Premium Theme — Unlock exclusive STRATIX themes
  with Premium" + an Upgrade button, instead of applying it. Discoverable,
  not hidden, per your requirement.
- Premium users apply instantly, persisted to `profiles.theme` (new
  nullable text column, default `'red'` — reuses the table `AuthContext`
  already loads on every session, no new persistence system) and read back
  on load so the choice survives refresh/logout-login/new browser.

## 8. Premium Quizzes

Quizzes today is entirely "in development" / "Coming soon" for every
category — no quiz-taking engine exists. Building real quizzes here is out
of scope (would mean building that engine from nothing). The Hub's Premium
Quizzes section is styled identically to `Quizzes.jsx`'s existing
"Coming soon" card pattern, with 3 named placeholders (Aim Mechanics,
Crosshair Knowledge, Agent Knowledge) — not fake functional quizzes, just
honestly-labeled placeholders using an established, already-approved visual
pattern.

## 9. Profile integration

`ProfileHeader.jsx` gets a plan-status block: `FREE PLAN` + "Upgrade to
Premium" button, or `PREMIUM · ACTIVE` + "Manage Subscription" (disabled/
"Coming soon" — no billing portal exists), plus the currently-selected
theme name for Premium users. No redesign of the rest of Profile.

## Database changes summary

- New table `subscriptions` (§4), RLS: read-own-row only.
- New column `profiles.theme` (text, nullable, default `'red'`).
- Migration backfills a `status: 'none'` `subscriptions` row per existing
  `auth.users` row.

## File touch list (high level; exact list finalized in implementation plan)

Deletions: 6 files (§1). Edits: ~12 files for Courses removal (§1) + new
`Premium.jsx`, `PremiumFeatureCard.jsx`, `ThemeContext.jsx`,
`premiumFeatures.js`, Premium/theme CSS, edits to `Navbar.jsx`, `index.css`,
`AuthContext.jsx` (or a new sibling context) for `usePremium()`,
`AICoach.jsx`, `guides.js`/`GuideCard.jsx`/`GuideDetail.jsx`,
`ProfileHeader.jsx`, `App.jsx` (new route), one Supabase migration.

## Testing plan

Exercised live through the running dev server, same approach as the earlier
auth-verification work: create/use a real test Supabase user, flip its
`subscriptions.status` via SQL to move between free/premium states (no real
payment exists to test through), verify Hub gating, theme paywall→unlock,
AI Coach 3-chat block, Guides lock/unlock, and confirm no Courses route
returns anything but 404. Browser console checked for errors. Test rows
cleaned up after.

## Next stage (explicitly deferred, listed for the user's own tracking)

1. Real payment/subscription provider + webhook writing to `subscriptions`.
2. Server-persisted AI Coach usage tracking (see §4 "AI Coach gating" for
   the exact mechanism already scoped).
3. Enforcement on Crosshair/Match-VOD/Saved-Configs/Quizzes.
4. A real Crosshair Generator tool.
5. Full-app theme coverage of decorative/illustrative graphics.
6. Real quiz-taking engine.
