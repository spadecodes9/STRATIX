# Premium Hub, Theme System & Courses Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the unlaunched Courses section, then add a Premium subsystem (navbar tab, modular Hub page, real entitlement data model, site-wide accent theme system, and light gating on AI Coach + Guides) to the existing STRATIX React/Vite/Supabase app.

**Architecture:** Courses removal is pure deletion + reference cleanup (Tasks 1). Premium entitlement is a new `subscriptions` Supabase table read through a `usePremium()` context — never a frontend boolean (Tasks 2-3). Theming extends the app's existing CSS-custom-property accent tokens rather than replacing them, driven by a `data-theme` attribute and persisted to a new `profiles.theme` column (Tasks 4-6). The Premium Hub is a config-array-driven page so future features are data entries, not new markup (Tasks 7-11). AI Coach and Guides get light, explicitly-temporary-where-noted gating wired to the real entitlement hook (Tasks 12-13).

**Tech Stack:** React 19, react-router-dom v7, Vite, Supabase JS v2 (`@supabase/supabase-js`), plain CSS with custom properties (no CSS-in-JS, no Tailwind), lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-09-20-premium-hub-and-theme-system-design.md`

## Global Constraints

- No new npm dependencies — every task uses what's already installed.
- `usePremium()`'s `isPremium` value must always derive from the `subscriptions` Supabase table — never from `localStorage`, a frontend variable, or any client-only flag (user's explicit correction during design review).
- The AI Coach 3-chat counter (Task 12) is a client-side UX gate only; it must carry an explicit `// TEMPORARY` comment and must not be described anywhere as secure enforcement.
- Preserve existing STRATIX visual identity: dark/near-black foundation, existing spacing/typography — theme changes only swap accent tokens, never the dark base.
- Respect `prefers-reduced-motion` for the theme transition (spec §6).
- Do not touch files/behavior outside what's listed in this plan.
- Courses removal is a hard delete (not a feature flag) — recoverable via git history only.

---

## Task 1: Remove Courses completely

**Files:**
- Delete: `src/pages/Courses.jsx`, `src/pages/CourseDetail.jsx`, `src/pages/LessonView.jsx`, `src/pages/Courses.css`, `src/components/courses/CourseCard.jsx`, `src/data/courses.js`, `src/components/dashboard/ContinueLearning.jsx`
- Modify: `src/App.jsx`, `src/components/layout/Navbar.jsx`, `src/components/layout/Footer.jsx`, `src/components/landing/PlatformShowcase.jsx`, `src/pages/Landing.jsx`, `src/pages/Dashboard.jsx`, `src/pages/Dashboard.css`, `src/pages/Quizzes.jsx`, `src/pages/Profile.jsx`, `src/pages/Profile.css`, `src/data/user.js`, `src/pages/Disclaimer.jsx`, `src/components/profile/ProfileActions.jsx`, `src/components/profile/TrainingProgress.jsx`, `src/components/profile/WeaknessPanel.jsx`

**Interfaces:**
- Produces: `data/user.js`'s `currentUser` object with `courseProgress` and `stats.coursesCompleted` removed, and `recommendedNext` shrunk to `{ title, reason }` (no `courseId`/`lessonId`) — every later task that reads `currentUser`/`user` assumes this shape.

- [ ] **Step 1: Delete the Courses-only files**

```bash
git rm src/pages/Courses.jsx src/pages/CourseDetail.jsx src/pages/LessonView.jsx src/pages/Courses.css src/components/courses/CourseCard.jsx src/data/courses.js src/components/dashboard/ContinueLearning.jsx
```

- [ ] **Step 2: Remove Courses routes and imports from `src/App.jsx`**

Remove these two import lines:
```js
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
```
(keep `LessonView` import removal too if present — check for `import LessonView from './pages/LessonView.jsx'`)

Remove these three `<Route>` blocks:
```jsx
<Route path="/courses" element={<Courses />} />
<Route path="/courses/:courseId" element={<CourseDetail />} />
```
and the `/courses/:courseId/lessons/:lessonId` `ProtectedRoute`-wrapped `LessonView` route.

- [ ] **Step 3: Remove the Courses nav link from `src/components/layout/Navbar.jsx`**

Delete this line from the `navLinks` array:
```js
{ to: '/courses', label: 'Courses' },
```

- [ ] **Step 4: Remove the Courses link from `src/components/layout/Footer.jsx`**

Search for and remove the Courses `<Link>`/nav entry (mirrors the Navbar entry removed in Step 3).

- [ ] **Step 5: Remove the Courses tile from `src/components/landing/PlatformShowcase.jsx`**

Delete this line (and re-check any hardcoded `num` sequence like `'01'`/`'02'`/`'03'` in sibling entries — renumber if the display shows these numbers):
```js
{ id: 'courses', num: '02', label: 'Courses', to: '/courses', icon: GraduationCap },
```

- [ ] **Step 6: Fix `src/pages/Landing.jsx`**

Two spots:
1. Around line 552, replace:
```jsx
<div className="ai-output-action"><span><Sparkles size={13} /> RECOMMENDED TRAINING</span><strong>{currentUser.recommendedNext.title}</strong><Link to={'/courses/' + currentUser.recommendedNext.courseId}>Deploy training <ArrowRight size={14} /></Link></div>
```
with:
```jsx
<div className="ai-output-action"><span><Sparkles size={13} /> RECOMMENDED TRAINING</span><strong>{currentUser.recommendedNext.title}</strong><Link to="/guides">Deploy training <ArrowRight size={14} /></Link></div>
```
2. Around line 545, replace `"Cross-referencing course momentum with the priority skill signal..."` with `"Cross-referencing recent signal with the priority skill gap..."`.

Also grep this file for any other `/courses` or "Courses" literal and remove/adjust.

- [ ] **Step 7: Remove Courses from `src/pages/Dashboard.jsx`**

Remove the `ContinueLearning` import and its usage:
```jsx
import ContinueLearning from '../components/dashboard/ContinueLearning.jsx'
...
<ContinueLearning courseProgress={user.courseProgress} recommendedNext={user.recommendedNext} recentActivity={user.recentActivity} weakestSkill={weakestSkill} />
```
Remove the whole line (this deletes the "Next best action" dashboard section entirely — `SkillMatrix` and `RecentActivity` below it remain).

Remove the "Courses completed" stat card:
```jsx
<StatCard icon={GraduationCap} value={user.stats.coursesCompleted} label="Courses completed" />
```
If `GraduationCap` becomes unused in this file after removal, remove that import too.

Check `src/pages/Dashboard.css` for any `.learning-command`/`.next-action`/`.course-status` rules that become dead after removing `ContinueLearning` — leaving unused CSS is harmless but note any obviously Courses-named selectors for cleanup if trivial to spot.

- [ ] **Step 8: Fix `src/pages/Quizzes.jsx`**

Replace:
```jsx
<p>Quizzes are still in active development and aren't live yet. In the meantime, Courses and Guides cover the same ground.</p>
<div className="quizzes-footer-actions">
  <Button variant="primary" to="/courses">Explore courses</Button>
  <Button variant="ghost" to="/guides">Browse guides</Button>
</div>
```
with:
```jsx
<p>Quizzes are still in active development and aren't live yet. In the meantime, Guides cover the same ground.</p>
<div className="quizzes-footer-actions">
  <Button variant="primary" to="/guides">Browse guides</Button>
</div>
```

- [ ] **Step 9: Remove the active-courses block from `src/pages/Profile.jsx`**

Remove:
```jsx
import { getCourseById } from '../data/courses.js'
```
```jsx
const courseProgress = user.courseProgress || {}
```
```jsx
const activeCourses = Object.entries(courseProgress)
  .map(([id, pct]) => ({ course: getCourseById(id), pct }))
  .filter((c) => c.course)
```
```jsx
{activeCourses.length > 0 && (
  <div className="panel course-progress-panel">
    ...
  </div>
)}
```
In `src/pages/Profile.css`, remove the now-unused `.course-progress-panel` / `.profile-course-progress-list` / `.profile-progress-row*` rules if they exist only for this block (grep for other usages first — `ProgressBar`-related classnames may be shared, only remove classnames scoped to this block).

- [ ] **Step 10: Fix the three identical `lessonHref` fallbacks**

In `src/components/profile/ProfileActions.jsx`:
```jsx
const lessonHref = recommendedNext?.courseId && recommendedNext?.lessonId
  ? `/courses/${recommendedNext.courseId}/lessons/${recommendedNext.lessonId}`
  : '/courses'
```
becomes:
```jsx
const lessonHref = '/guides'
```
(Step 12 of this same task strips `courseId`/`lessonId` from `recommendedNext` in `data/user.js`, making the original conditional always false regardless of step order — replace it directly with the constant rather than leaving dead conditional code.)

In `src/components/profile/TrainingProgress.jsx`, same fix (check the surrounding lines for the exact variable name at that call site, apply the same simplification).

In `src/components/profile/WeaknessPanel.jsx`:
```jsx
const lessonHref = recommendedNext?.courseId && recommendedNext?.lessonId
  ? `/courses/${recommendedNext.courseId}/lessons/${recommendedNext.lessonId}`
  : recommendedNext?.courseId
    ? `/courses/${recommendedNext.courseId}`
    : '/courses'
```
becomes:
```jsx
const lessonHref = '/guides'
```

- [ ] **Step 11: Remove the Courses mention from `src/pages/Disclaimer.jsx`**

Grep for `Course` in this file and remove/reword the sentence referencing it without changing the surrounding legal copy's meaning.

- [ ] **Step 12: Update `src/data/user.js`**

Remove:
```js
coursesCompleted: 3,
```
Remove the whole block:
```js
courseProgress: {
  'aim-fundamentals': 100,
  'advanced-utility-usage': 60,
  'map-control-mastery': 25,
},
```
Change:
```js
recommendedNext: {
  courseId: 'advanced-utility-usage',
  lessonId: 'l_smoke_timings',
  title: 'Smoke Timings for Retakes',
  reason: 'Continues your current course · matches your weakest skill area',
},
```
to:
```js
recommendedNext: {
  title: 'Smoke Timings for Retakes',
  reason: 'Matches your weakest skill area',
},
```

- [ ] **Step 13: Verify no dangling references remain**

Run:
```bash
grep -riln "course" src --include=*.jsx --include=*.js --include=*.css | grep -v -i "of course\|Discourse"
```
Every remaining hit must be a deliberate non-Courses word (there shouldn't be any after Steps 1-12 — if `coachService.js`'s `courseProgress` passthrough (`if (user.courseProgress) context.courseProgress = user.courseProgress`) still shows up, that's fine to leave: it's a defensive `if` that's simply always false now since the field no longer exists on `user`, not a broken reference).

- [ ] **Step 14: Build and smoke-test**

```bash
npm run build
```
Expected: builds clean, no import-resolution errors for deleted files.

Then start the dev server and click through: navbar (no Courses link), footer (no Courses link), `/courses` and `/courses/anything` (both 404 via the catch-all route), Dashboard, Profile, Landing, Quizzes — confirm no console errors and no visibly broken layout gaps.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Remove unlaunched Courses section

Deletes Courses pages/routes/nav entries and cleans up every
cross-reference (Dashboard stat, Profile progress panel, recommendedNext
course links, Landing/Quizzes copy). Hard delete, not a feature flag —
fully recoverable via git history if Courses launches later.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Database migration — `subscriptions` table + `profiles.theme` column

**Files:**
- Migration applied via the Supabase MCP `apply_migration` tool against project `vhdsbtvyrvznwmlpwiir` (no local migration files in this repo — confirmed via `list_migrations` returning empty; schema changes are applied directly).

**Interfaces:**
- Produces: `public.subscriptions(id, user_id, plan, status, current_period_end, created_at, updated_at)` and `public.profiles.theme` (text, nullable, default `'red'`) — Task 3 (`usePremium`) and Task 5 (`ThemeContext`) read/write these.

- [ ] **Step 1: Apply the migration**

```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'none' check (status in ('active', 'canceled', 'none')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using ((select auth.uid()) = user_id);

insert into public.subscriptions (user_id, plan, status)
select id, 'free', 'none' from auth.users
on conflict (user_id) do nothing;

alter table public.profiles add column theme text default 'red';
```

Call `apply_migration` with `project_id: "vhdsbtvyrvznwmlpwiir"`, `name: "add_subscriptions_and_theme"`, and the query above.

- [ ] **Step 2: Verify**

Run via `execute_sql`:
```sql
select count(*) as total_users, count(*) filter (where status = 'none') as free_rows from public.subscriptions;
```
Expected: `total_users` matches the `auth.users` count from earlier exploration (5), all rows `status = 'none'`.

```sql
select column_name, data_type, column_default from information_schema.columns where table_name = 'profiles' and column_name = 'theme';
```
Expected: one row, `text`, default `'red'::text`.

No commit needed for this task (server-side schema change, not a file in the repo) — note the applied migration name in the final report (Task 15).

---

## Task 3: `usePremium()` entitlement hook

**Files:**
- Create: `src/context/PremiumContext.jsx`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: `useAuth()` from `src/context/AuthContext.jsx` (`{ user, isAuthenticated }` — `user.id` per the existing `mapUser()` shape in `AuthContext.jsx`), `supabase` from `src/lib/supabase.js`.
- Produces: `usePremium()` returning `{ isPremium: boolean, plan: string, status: 'active'|'canceled'|'none', isLoading: boolean }`. Tasks 5, 9, 10, 12, 13, 14 all consume this.

- [ ] **Step 1: Create `src/context/PremiumContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

const PremiumContext = createContext(null)

const DEFAULT_STATE = { plan: 'free', status: 'none' }

export function PremiumProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState(DEFAULT_STATE)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    if (!isAuthenticated || !user?.id) {
      setState(DEFAULT_STATE)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) {
          console.error('Failed to load STRATIX subscription state:', error)
          setState(DEFAULT_STATE)
        } else {
          setState(data ?? DEFAULT_STATE)
        }
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user?.id])

  return (
    <PremiumContext.Provider
      value={{
        isPremium: state.status === 'active',
        plan: state.plan,
        status: state.status,
        isLoading,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)

  if (!ctx) {
    throw new Error('usePremium must be used within PremiumProvider')
  }

  return ctx
}
```

- [ ] **Step 2: Mount `PremiumProvider` inside `AuthProvider` in `src/main.jsx`**

```jsx
import { AuthProvider } from './context/AuthContext.jsx'
import { PremiumProvider } from './context/PremiumContext.jsx'
```
```jsx
<AuthProvider>
  <PremiumProvider>
    <App />
    <Toaster ... />
  </PremiumProvider>
</AuthProvider>
```
(`PremiumProvider` must be nested inside `AuthProvider` since it calls `useAuth()`.)

- [ ] **Step 3: Manual verification**

Start the dev server, sign in as the existing test user whose `subscriptions.status = 'none'` (default). Add a temporary `console.log` in any page calling `usePremium()` — confirm `{ isPremium: false, plan: 'free', status: 'none' }`. Via `execute_sql`, run:
```sql
update public.subscriptions set status = 'active', plan = 'premium' where user_id = '<test-user-id>';
```
Refresh the page — confirm the hook now reports `isPremium: true`. Revert the row back to `status = 'none'` afterward so the test account doesn't linger premium. Remove the temporary `console.log`.

- [ ] **Step 4: Commit**

```bash
git add src/context/PremiumContext.jsx src/main.jsx
git commit -m "$(cat <<'EOF'
Add usePremium() entitlement hook backed by Supabase subscriptions

Reads the new subscriptions table the same way AuthContext already reads
profiles — isPremium is only ever true when status = 'active' in that
table, never a frontend-only flag.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Theme tokens — derive accent colors from one `--accent-rgb` variable

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: `--accent-rgb`, and `--red`/`--red-bright`/`--red-dim`/`--red-glow`/`--red-glow-soft` now derived from it, plus `:root[data-theme="..."]` blocks for `blue`/`green`/`gold`. Token *names* are unchanged, so every existing consumer (confirmed widespread via earlier grep across `Auth.css`, `Profile.css`, `layout.css`, `ui.css`, etc.) needs no edits.

- [ ] **Step 1: Replace the palette block in `src/index.css`**

Current:
```css
  --red: #ff3b4e;
  --red-bright: #ff5c6d;
  --red-dim: #8a1420;
  --red-glow: rgba(255, 59, 78, 0.28);
  --red-glow-soft: rgba(255, 59, 78, 0.12);
```
Replace with:
```css
  --accent-rgb: 255 59 78;
  --accent-bright-rgb: 255 92 109;
  --accent-dim-rgb: 138 20 32;

  --red: rgb(var(--accent-rgb));
  --red-bright: rgb(var(--accent-bright-rgb));
  --red-dim: rgb(var(--accent-dim-rgb));
  --red-glow: rgb(var(--accent-rgb) / 0.28);
  --red-glow-soft: rgb(var(--accent-rgb) / 0.12);
```
(This reproduces the exact same rendered colors at default — `rgb(255 59 78)` = `#ff3b4e` — so there is zero visual change until a theme is applied.)

- [ ] **Step 2: Add theme variant blocks immediately after `:root { ... }` in `src/index.css`**

```css
:root[data-theme='blue'] {
  --accent-rgb: 60 140 255;
  --accent-bright-rgb: 96 168 255;
  --accent-dim-rgb: 20 60 138;
}
:root[data-theme='green'] {
  --accent-rgb: 61 220 132;
  --accent-bright-rgb: 96 235 160;
  --accent-dim-rgb: 20 110 62;
}
:root[data-theme='gold'] {
  --accent-rgb: 255 182 72;
  --accent-bright-rgb: 255 205 122;
  --accent-dim-rgb: 138 92 20;
}
```
(`green`/`gold` reuse the app's existing `--success`/`--warning` hues respectively so the palette stays internally consistent with colors already on-brand in this codebase, rather than introducing unrelated new hues.)

- [ ] **Step 3: Visual check**

Temporarily add `data-theme="blue"` to the `<html>` tag by hand in `index.html`, run the dev server, confirm buttons/borders/nav-active-state/glows across Sign In, Dashboard, and Profile visibly shift to blue with the dark foundation unchanged. Remove the temporary attribute from `index.html` afterward (Task 5 sets it programmatically).

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "$(cat <<'EOF'
Derive accent color tokens from a single --accent-rgb variable

Refactors --red/--red-bright/--red-dim/--red-glow/--red-glow-soft to
derive from --accent-rgb so a future theme switch only needs to change
one variable. Token names are unchanged — default render is pixel-
identical to before. Adds blue/green/gold variant blocks (unused until
ThemeContext sets data-theme).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `ThemeContext` — apply + persist theme selection

**Files:**
- Create: `src/context/ThemeContext.jsx`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: `useAuth()` (`user.id`, `isAuthenticated`), `supabase`.
- Produces: `useTheme()` returning `{ theme: 'red'|'blue'|'green'|'gold', setTheme: (theme) => Promise<void>, isSaving: boolean }`. Task 10 (theme selector UI) and Task 14 (Profile display) consume this.

- [ ] **Step 1: Create `src/context/ThemeContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

const ThemeContext = createContext(null)

const VALID_THEMES = ['red', 'blue', 'green', 'gold']
const DEFAULT_THEME = 'red'

export function ThemeProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [theme, setThemeState] = useState(DEFAULT_THEME)
  const [isSaving, setIsSaving] = useState(false)

  // Load the signed-in user's saved theme once auth resolves. Signed-out
  // visitors always see the default theme.
  useEffect(() => {
    if (!isAuthenticated) {
      setThemeState(DEFAULT_THEME)
      return
    }

    const savedTheme = user?.preferences?.theme
    setThemeState(VALID_THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME)
  }, [isAuthenticated, user?.preferences?.theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = async (nextTheme) => {
    if (!VALID_THEMES.includes(nextTheme)) return

    document.documentElement.classList.add('theme-transitioning')
    setThemeState(nextTheme)
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 500)

    if (!isAuthenticated || !user?.id) return

    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ theme: nextTheme }).eq('id', user.id)
    setIsSaving(false)

    if (error) {
      console.error('Failed to save STRATIX theme preference:', error)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isSaving }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)

  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return ctx
}
```

Note: this reads the theme off `user?.preferences?.theme`, matching `AuthContext.jsx`'s existing `mapUser()` which already maps `profile?.preferences ?? {}` onto `user.preferences` — **not** a new top-level `user.theme`. This requires the `profiles.theme` DB column (Task 2) to actually be read into `preferences` — see Step 2 below for the required one-line `AuthContext.jsx` change to keep this consistent (the DB column is separate from the JSONB `preferences` blob today, so `mapUser` needs to fold it in).

- [ ] **Step 2: Fold `profiles.theme` into `mapUser()`'s `preferences` in `src/context/AuthContext.jsx`**

Change:
```js
preferences:
  profile?.preferences ?? {},
```
to:
```js
preferences: {
  ...(profile?.preferences ?? {}),
  theme: profile?.theme ?? 'red',
},
```
This keeps `ThemeContext`'s read path (`user.preferences.theme`) and `PremiumContext`'s independence intact — no new field shape introduced beyond what `AuthContext` already exposes.

- [ ] **Step 3: Mount `ThemeProvider` in `src/main.jsx`**

```jsx
import { ThemeProvider } from './context/ThemeContext.jsx'
```
```jsx
<AuthProvider>
  <PremiumProvider>
    <ThemeProvider>
      <App />
      <Toaster ... />
    </ThemeProvider>
  </PremiumProvider>
</AuthProvider>
```

- [ ] **Step 4: Manual verification**

Sign in as the test user. Via `execute_sql`: `update public.profiles set theme = 'blue' where id = '<test-user-id>';`. Refresh the page — confirm the site renders in blue immediately on load (no flash of red-then-blue — if there is a flash, note it as a known limitation for the report; fixing FOUC here would require a blocking inline script in `index.html`, which is out of scope for this pass). Revert the row to `'red'` afterward.

- [ ] **Step 5: Commit**

```bash
git add src/context/ThemeContext.jsx src/context/AuthContext.jsx src/main.jsx
git commit -m "$(cat <<'EOF'
Add ThemeContext: applies data-theme and persists to profiles.theme

Loads the signed-in user's saved theme through AuthContext's existing
preferences mapping (folds in the new profiles.theme column), applies it
via a data-theme attribute on <html>, and writes changes back to
Supabase — no localStorage-only state.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Theme transition CSS

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Consumes: the `.theme-transitioning` class toggled by `ThemeContext.setTheme()` (Task 5).

- [ ] **Step 1: Add transition rules to `src/index.css`**

```css
@media (prefers-reduced-motion: no-preference) {
  .theme-transitioning,
  .theme-transitioning * {
    transition:
      background-color 0.4s ease,
      border-color 0.4s ease,
      box-shadow 0.4s ease,
      color 0.4s ease !important;
  }
}
```
The blanket `*` selector is intentional and scoped tightly in time (removed after 500ms by `ThemeContext`, Task 5 Step 1) — it's the simplest way to catch every token-driven element (buttons, borders, nav states, cards, glows) without hand-listing each selector, and it's inert outside the ~500ms window the class is present.

- [ ] **Step 2: Manual verification**

With the dev server running and signed in as the test (premium, once Task 2's row is temporarily flipped active for testing) user, trigger a theme change from the selector built in Task 10 once it exists — confirm a smooth ~400ms color shift rather than an instant snap. Toggle OS-level "reduce motion" and confirm the switch becomes instant with no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "$(cat <<'EOF'
Add smooth CSS transition for theme accent changes

Scoped to a short-lived .theme-transitioning class so token-driven colors
animate on change instead of hard-switching. Respects
prefers-reduced-motion.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Premium navbar tab

**Files:**
- Modify: `src/components/layout/Navbar.jsx`, `src/components/layout/layout.css`, `src/index.css`

**Interfaces:**
- Produces: `/premium` link in the navbar (route itself created in Task 9).

- [ ] **Step 1: Add gold tokens to `src/index.css`**

Add alongside the existing palette (inside `:root { ... }`, near `--warning`):
```css
  --gold: #ffb648;
  --gold-bright: #ffd280;
  --gold-glow: rgba(255, 182, 72, 0.32);
```
(Deliberately **not** derived from `--accent-rgb` — the Premium tab must stay visually gold regardless of the user's selected site theme, including when the theme itself is "gold," so it reads as a distinct premium signifier rather than blending into an active accent color.)

- [ ] **Step 2: Add the nav entry in `src/components/layout/Navbar.jsx`**

The existing `navLinks` array drives a single `.map()` for all links — Premium needs its own class, so render it separately rather than folding it into that array. After the `navLinks.map(...)` block inside the `<nav id="mobile-navigation">`, and after the `.map()` in the desktop link rendering if separate (check current markup — the mobile nav renders `navLinks.map` once; desktop nav-auth is separate and doesn't render `navLinks` at all today, only the mobile/collapsed `<nav>` does). Add:

```jsx
<NavLink
  to="/premium"
  className={({ isActive }) => 'nav-link nav-link-premium' + (isActive ? ' nav-link-active' : '')}
  onClick={() => setMenuOpen(false)}
>
  <span className="nav-link-index">0{navLinks.length + 1}</span>
  <span>Premium <i className="premium-star">✦</i></span>
</NavLink>
```
placed directly after the `navLinks.map(...)` block (before `<div className="nav-auth-mobile">`).

Also add a compact desktop version inside `<div className="nav-auth-desktop">`, before the `isAuthenticated ? (...)` block, so it's visible in the always-on-screen desktop bar (not just the mobile/collapsed menu):
```jsx
<NavLink to="/premium" className="nav-link-premium nav-link-premium-desktop">
  Premium <i className="premium-star">✦</i>
</NavLink>
```

- [ ] **Step 3: Style it in `src/components/layout/layout.css`**

```css
.nav-link-premium {
  color: var(--gold);
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(255, 182, 72, 0.18), 0 0 14px var(--gold-glow);
  border-radius: var(--radius);
  transition: box-shadow 0.2s ease, transform 0.2s ease, color 0.2s ease;
}
.nav-link-premium .premium-star {
  font-style: normal;
  color: var(--gold-bright);
}
.nav-link-premium:hover,
.nav-link-premium:focus-visible {
  color: var(--gold-bright);
  box-shadow: 0 0 0 1px rgba(255, 182, 72, 0.32), 0 0 22px rgba(255, 182, 72, 0.45);
  transform: translateY(-1px);
}
.nav-link-premium-desktop {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.02em;
  margin-right: 10px;
}
```
(Reuses the existing `translateY(-1px)` hover-lift language already established by `.oauth-btn:hover` in `Auth.css`, per the spec's instruction to reuse existing motion patterns rather than invent a new one.)

- [ ] **Step 4: Visual check**

Run the dev server, confirm the Premium tab appears in both desktop and mobile nav, glows gold at rest, brightens + lifts on hover, and looks intentional next to the existing dark nav rather than "cheap" (spec's explicit ask). Adjust glow opacity/size only if it looks disproportionate against the existing nav items — don't restyle the other nav items.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navbar.jsx src/components/layout/layout.css src/index.css
git commit -m "$(cat <<'EOF'
Add Premium navbar tab with gold accent treatment

Visually distinct from standard nav links (gold glow, brighter on hover)
using new --gold/--gold-bright/--gold-glow tokens that stay fixed
regardless of the active site theme. Links to /premium.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Premium feature config + card component

**Files:**
- Create: `src/data/premiumFeatures.js`, `src/components/premium/PremiumFeatureCard.jsx`, `src/components/premium/premium.css`

**Interfaces:**
- Produces: `premiumFeatures` array of `{ id, icon, title, freeDescription, premiumDescription, status }` (`status`: `'gated'` | `'coming-soon'`), and `<PremiumFeatureCard feature={...} />`. Task 9 renders these in a grid.

- [ ] **Step 1: Create `src/data/premiumFeatures.js`**

```js
import {
  Bot, BookOpen, Crosshair, Target, Sparkles, Video, Save, UserCog, Palette, ListChecks,
} from 'lucide-react'

// Each entry is one Premium Hub feature card. `status: 'gated'` means the
// free/premium split is actually enforced in the app today (see AI Coach
// and Guides); everything else is `'coming-soon'` — visible and honest
// about not being wired up yet, per the free/premium table in the spec.
export const premiumFeatures = [
  {
    id: 'ai-coach',
    icon: Bot,
    title: 'AI Coach',
    freeDescription: 'Limited to 3 chats',
    premiumDescription: 'Unlimited AI conversations',
    status: 'gated',
  },
  {
    id: 'guides',
    icon: BookOpen,
    title: 'Guides',
    freeDescription: 'Limited selection of guides',
    premiumDescription: 'Full Guides Library',
    status: 'gated',
  },
  {
    id: 'crosshair',
    icon: Crosshair,
    title: 'Crosshair Generator',
    freeDescription: 'Basic functionality',
    premiumDescription: 'Advanced Crosshair Generator',
    status: 'coming-soon',
  },
  {
    id: 'aim-settings',
    icon: Target,
    title: 'Aim & Settings',
    freeDescription: 'Not available',
    premiumDescription: 'Advanced aim/settings analysis',
    status: 'coming-soon',
  },
  {
    id: 'ai-analysis',
    icon: Sparkles,
    title: 'AI Analysis',
    freeDescription: 'Not available',
    premiumDescription: 'Advanced AI-powered analysis',
    status: 'coming-soon',
  },
  {
    id: 'match-vod',
    icon: Video,
    title: 'Match / VOD',
    freeDescription: 'Limited functionality',
    premiumDescription: 'Full Match and VOD analysis',
    status: 'coming-soon',
  },
  {
    id: 'saved-configs',
    icon: Save,
    title: 'Saved Configurations',
    freeDescription: 'Limited',
    premiumDescription: 'Unlimited saved configurations',
    status: 'coming-soon',
  },
  {
    id: 'profile-customization',
    icon: UserCog,
    title: 'Profile Customization',
    freeDescription: 'Not available',
    premiumDescription: 'Premium profile customization',
    status: 'coming-soon',
  },
  {
    id: 'theme-customization',
    icon: Palette,
    title: 'Theme Customization',
    freeDescription: 'Default STRATIX theme only',
    premiumDescription: 'Unlock exclusive STRATIX themes',
    status: 'gated',
  },
  {
    id: 'quizzes',
    icon: ListChecks,
    title: 'Quizzes',
    freeDescription: 'Not available',
    premiumDescription: 'Premium-exclusive quizzes',
    status: 'coming-soon',
  },
]
```

- [ ] **Step 2: Create `src/components/premium/PremiumFeatureCard.jsx`**

```jsx
import Badge from '../ui/Badge.jsx'

export default function PremiumFeatureCard({ feature }) {
  const Icon = feature.icon

  return (
    <div className="premium-feature-card">
      <div className="premium-feature-card-top">
        <span className="premium-feature-icon"><Icon size={20} /></span>
        {feature.status === 'coming-soon' && <Badge variant="default">Coming soon</Badge>}
      </div>
      <h3>{feature.title}</h3>
      <div className="premium-feature-tier">
        <span className="premium-feature-tier-label">Free</span>
        <span>{feature.freeDescription}</span>
      </div>
      <div className="premium-feature-tier premium-feature-tier-gold">
        <span className="premium-feature-tier-label">Premium</span>
        <span>{feature.premiumDescription}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/premium/premium.css`**

```css
.premium-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 32px 0;
}
.premium-feature-card {
  position: relative;
  background: var(--charcoal);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.premium-feature-card:hover {
  border-color: rgba(255, 182, 72, 0.4);
  box-shadow: 0 0 24px rgba(255, 182, 72, 0.1);
  transform: translateY(-2px);
}
.premium-feature-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.premium-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  background: rgba(255, 182, 72, 0.1);
  color: var(--gold);
}
.premium-feature-card h3 { font-size: 16px; margin-bottom: 12px; }
.premium-feature-tier {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12.5px;
  padding: 7px 0;
  border-top: 1px solid var(--border-soft);
  color: var(--gray);
}
.premium-feature-tier-label {
  font-family: var(--font-ui);
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--gray-dim);
  flex-shrink: 0;
}
.premium-feature-tier-gold {
  color: var(--gold-bright);
  font-weight: 600;
}
.premium-feature-tier-gold .premium-feature-tier-label { color: var(--gold); }
```

- [ ] **Step 4: Commit**

```bash
git add src/data/premiumFeatures.js src/components/premium/PremiumFeatureCard.jsx src/components/premium/premium.css
git commit -m "$(cat <<'EOF'
Add data-driven Premium feature card config and component

Feature list is a plain array — adding a future Premium feature later
is a new array entry, not new markup, per the spec's modularity
requirement.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Premium Hub page + route

**Files:**
- Create: `src/pages/Premium.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `premiumFeatures` (Task 8), `usePremium()` (Task 3), `PremiumFeatureCard` (Task 8).
- Produces: `/premium` route. Tasks 10 and 11 render additional sections inside this page.

- [ ] **Step 1: Create `src/pages/Premium.jsx`**

```jsx
import { Sparkles } from 'lucide-react'
import { usePremium } from '../context/PremiumContext.jsx'
import { premiumFeatures } from '../data/premiumFeatures.js'
import PremiumFeatureCard from '../components/premium/PremiumFeatureCard.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import '../components/premium/premium.css'
import './Premium.css'

export default function Premium() {
  const { isPremium, isLoading } = usePremium()

  return (
    <div className="page-shell premium-page">
      <div className="premium-hero">
        <span className="eyebrow premium-hero-eyebrow"><Sparkles size={14} /> STRATIX PREMIUM</span>
        <h1>Unlock STRATIX Premium</h1>
        <p>
          Premium unlocks advanced tools, deeper analysis, full customization, and exclusive
          content across the entire training platform.
        </p>
        {!isLoading && (
          isPremium
            ? <Badge variant="red">Premium active</Badge>
            : <Button variant="primary">Upgrade to Premium</Button>
        )}
      </div>

      <div className="premium-feature-grid">
        {premiumFeatures.map((feature) => (
          <PremiumFeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/pages/Premium.css`**

```css
.premium-page { padding-top: 48px; padding-bottom: 80px; }
.premium-hero {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 24px;
  padding: 40px 24px;
  background: radial-gradient(circle at 50% 0%, rgba(255, 182, 72, 0.12), transparent 65%);
  border: 1px solid rgba(255, 182, 72, 0.18);
  border-radius: var(--radius);
}
.premium-hero-eyebrow { color: var(--gold); justify-content: center; margin-bottom: 12px; }
.premium-hero h1 { font-size: 40px; margin-bottom: 12px; }
.premium-hero p { color: var(--gray); font-size: 15px; line-height: 1.7; margin-bottom: 20px; }
```

- [ ] **Step 3: Wire the route in `src/App.jsx`**

```jsx
import Premium from './pages/Premium.jsx'
```
```jsx
<Route path="/premium" element={<Premium />} />
```
(Not wrapped in `ProtectedRoute` — signed-out visitors can view the Hub, per the spec.)

- [ ] **Step 4: Manual verification**

Visit `/premium` signed out — confirm hero + 10 feature cards render, "Upgrade to Premium" button shows (inert for now, no click handler yet — that's fine, real checkout is explicitly out of scope). Sign in as the temporarily-flipped-premium test user — confirm the "Premium active" badge shows instead.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Premium.jsx src/pages/Premium.css src/App.jsx
git commit -m "$(cat <<'EOF'
Add Premium Hub page and /premium route

Hero + the data-driven feature grid from Task 8. Theme selector (Task 10)
and Premium Quizzes (Task 11) sections still to come.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Theme selector + paywall panel

**Files:**
- Create: `src/components/premium/ThemeSelector.jsx`
- Modify: `src/pages/Premium.jsx`, `src/pages/Premium.css`

**Interfaces:**
- Consumes: `useTheme()` (Task 5), `usePremium()` (Task 3).

- [ ] **Step 1: Create `src/components/premium/ThemeSelector.jsx`**

```jsx
import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { usePremium } from '../../context/PremiumContext.jsx'
import Button from '../ui/Button.jsx'

const THEMES = [
  { id: 'red', label: 'Red', rgb: '255 59 78' },
  { id: 'blue', label: 'Blue', rgb: '60 140 255' },
  { id: 'green', label: 'Green', rgb: '61 220 132' },
  { id: 'gold', label: 'Gold', rgb: '255 182 72' },
]

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { isPremium } = usePremium()
  const [lockedAttempt, setLockedAttempt] = useState(null)

  const handleSelect = (themeId) => {
    if (themeId !== 'red' && !isPremium) {
      setLockedAttempt(themeId)
      return
    }
    setLockedAttempt(null)
    setTheme(themeId)
  }

  return (
    <section className="theme-selector-section">
      <div className="panel-title-row">
        <h3>Theme Customization</h3>
      </div>
      <div className="theme-swatch-grid">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={'theme-swatch' + (theme === t.id ? ' theme-swatch-selected' : '')}
            style={{ '--swatch-rgb': t.rgb }}
            onClick={() => handleSelect(t.id)}
          >
            <span className="theme-swatch-preview" />
            <span className="theme-swatch-label">
              {t.label}
              {t.id !== 'red' && !isPremium && <Lock size={12} />}
            </span>
            {theme === t.id && <Check size={14} className="theme-swatch-check" />}
          </button>
        ))}
      </div>

      {lockedAttempt && (
        <div className="theme-locked-panel">
          <span className="theme-locked-icon"><Lock size={16} /></span>
          <div>
            <strong>Premium Theme</strong>
            <p>Unlock exclusive STRATIX themes with Premium.</p>
          </div>
          <Button variant="primary">Upgrade to Premium</Button>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Add swatch/paywall CSS to `src/pages/Premium.css`**

```css
.theme-selector-section { margin: 40px 0; }
.theme-swatch-grid { display: flex; flex-wrap: wrap; gap: 14px; }
.theme-swatch {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 120px;
  padding: 14px 10px;
  background: var(--charcoal);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.theme-swatch:hover {
  transform: scale(1.04);
  border-color: rgb(var(--swatch-rgb) / 0.5);
  box-shadow: 0 0 20px rgb(var(--swatch-rgb) / 0.25);
}
.theme-swatch-selected {
  border-color: rgb(var(--swatch-rgb) / 0.8);
  box-shadow: 0 0 0 1px rgb(var(--swatch-rgb) / 0.4), 0 0 24px rgb(var(--swatch-rgb) / 0.3);
}
.theme-swatch-preview {
  width: 100%;
  height: 40px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, #000, rgb(var(--swatch-rgb) / 0.9));
}
.theme-swatch-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  color: var(--gray);
}
.theme-swatch-check { position: absolute; top: 8px; right: 8px; color: rgb(var(--swatch-rgb)); }
.theme-locked-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  padding: 16px 18px;
  background: rgba(255, 182, 72, 0.06);
  border: 1px solid rgba(255, 182, 72, 0.25);
  border-radius: var(--radius);
}
.theme-locked-icon { color: var(--gold); flex-shrink: 0; }
.theme-locked-panel strong { display: block; margin-bottom: 3px; }
.theme-locked-panel p { color: var(--gray); font-size: 13px; margin: 0; }
.theme-locked-panel .btn { margin-left: auto; flex-shrink: 0; }
```

- [ ] **Step 3: Render it in `src/pages/Premium.jsx`**

```jsx
import ThemeSelector from '../components/premium/ThemeSelector.jsx'
```
Add `<ThemeSelector />` after the `.premium-feature-grid` block.

- [ ] **Step 4: Manual verification**

As the free test user: click a non-red swatch — confirm the locked panel appears, the theme does NOT change, and clicking red still works. Flip the test user to premium via SQL (Task 3's method) and refresh: confirm clicking blue/green/gold applies immediately with the Task 6 transition, persists on refresh, and the checkmark moves to the selected swatch. Revert the test row to free afterward.

- [ ] **Step 5: Commit**

```bash
git add src/components/premium/ThemeSelector.jsx src/pages/Premium.jsx src/pages/Premium.css
git commit -m "$(cat <<'EOF'
Add theme selector with Premium-only paywall

Free users see all four swatches and a clear upgrade prompt when picking
a non-default one, rather than the feature being hidden. Premium users
apply instantly with the Task 6 transition.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Premium Quizzes placeholder section

**Files:**
- Create: `src/components/premium/PremiumQuizzes.jsx`
- Modify: `src/pages/Premium.jsx`, `src/pages/Premium.css`

**Interfaces:**
- None beyond static content — no quiz-taking engine exists in this codebase (confirmed: `Quizzes.jsx` itself is entirely "Coming soon" today), so this mirrors that exact existing pattern rather than building new functionality.

- [ ] **Step 1: Create `src/components/premium/PremiumQuizzes.jsx`**

```jsx
import { Target, Crosshair, Users } from 'lucide-react'
import Badge from '../ui/Badge.jsx'

const PREMIUM_QUIZZES = [
  { icon: Target, title: 'Aim Mechanics Quiz', text: 'Test your understanding of sensitivity, tracking, and flicking fundamentals.' },
  { icon: Crosshair, title: 'Crosshair Knowledge Quiz', text: 'Placement, color theory, and sizing for consistent first shots.' },
  { icon: Users, title: 'Agent Knowledge Quiz', text: 'Kit details and matchup awareness, agent by agent.' },
]

export default function PremiumQuizzes() {
  return (
    <section className="premium-quizzes-section">
      <div className="panel-title-row">
        <h3>Premium Quizzes</h3>
        <Badge variant="default">Coming soon</Badge>
      </div>
      <div className="premium-quizzes-grid">
        {PREMIUM_QUIZZES.map((quiz) => {
          const Icon = quiz.icon
          return (
            <div key={quiz.title} className="premium-quiz-card">
              <Icon size={18} />
              <strong>{quiz.title}</strong>
              <p>{quiz.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add grid CSS to `src/pages/Premium.css`**

```css
.premium-quizzes-section { margin: 40px 0; }
.premium-quizzes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
.premium-quiz-card {
  padding: 16px;
  background: var(--charcoal);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--gray);
}
.premium-quiz-card svg { color: var(--gold); margin-bottom: 8px; }
.premium-quiz-card strong { display: block; color: var(--white); margin-bottom: 6px; font-size: 14px; }
.premium-quiz-card p { font-size: 12.5px; line-height: 1.5; margin: 0; }
```

- [ ] **Step 3: Render it in `src/pages/Premium.jsx`**

```jsx
import PremiumQuizzes from '../components/premium/PremiumQuizzes.jsx'
```
Add `<PremiumQuizzes />` after `<ThemeSelector />`.

- [ ] **Step 4: Commit**

```bash
git add src/components/premium/PremiumQuizzes.jsx src/pages/Premium.jsx src/pages/Premium.css
git commit -m "$(cat <<'EOF'
Add Premium Quizzes placeholder section to the Hub

Styled identically to Quizzes.jsx's existing "Coming soon" pattern —
no quiz-taking engine exists yet in this codebase, so these are honestly
labeled placeholders, not fake functional quizzes.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: AI Coach gating (explicitly temporary client-side counter)

**Files:**
- Modify: `src/pages/AICoach.jsx`, `src/pages/AICoach.css`

**Interfaces:**
- Consumes: `usePremium()` (Task 3).

- [ ] **Step 1: Add the counter and gate in `src/pages/AICoach.jsx`**

Add near the top of the component, alongside the existing `useState` calls:
```jsx
import { Lock } from 'lucide-react'
import { usePremium } from '../context/PremiumContext.jsx'
```
```jsx
const { isPremium } = usePremium()
const FREE_CHAT_LIMIT = 3
// TEMPORARY: this counter is client-side React state only — it resets on
// reload and is not abuse-resistant. It exists to demonstrate the paywall
// UX. isPremium above is the real, server-verified entitlement check and
// is never affected by this counter. Real enforcement needs a
// server-persisted usage count checked by server/index.js before it calls
// OpenRouter — see docs/superpowers/specs/2026-09-20-premium-hub-and-theme-system-design.md §4.
const [freeChatCount, setFreeChatCount] = useState(0)
const chatLimitReached = !isPremium && freeChatCount >= FREE_CHAT_LIMIT
```

Find the existing send handler (the function that calls `getCoachResponse` on submit) and add a guard at its start:
```jsx
if (chatLimitReached) return
```
and after a successful send (wherever the user's message is appended to `messages`/state), increment:
```jsx
if (!isPremium) setFreeChatCount((count) => count + 1)
```

In the composer's render, replace the input/send button with an upgrade prompt when `chatLimitReached`:
```jsx
{chatLimitReached ? (
  <div className="ai-coach-limit-reached">
    <Lock size={16} />
    <div>
      <strong>Free chat limit reached</strong>
      <p>You've used your 3 free AI Coach chats. Upgrade to Premium for unlimited conversations.</p>
    </div>
    <Button variant="primary" to="/premium">Upgrade to Premium</Button>
  </div>
) : (
  /* existing composer JSX */
)}
```
(Import `Button` from `'../components/ui/Button.jsx'` if not already imported in this file.)

- [ ] **Step 2: Add styling to `src/pages/AICoach.css`**

```css
.ai-coach-limit-reached {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: rgba(255, 182, 72, 0.06);
  border: 1px solid rgba(255, 182, 72, 0.25);
  border-radius: var(--radius);
}
.ai-coach-limit-reached svg { color: var(--gold); flex-shrink: 0; }
.ai-coach-limit-reached strong { display: block; margin-bottom: 3px; }
.ai-coach-limit-reached p { color: var(--gray); font-size: 13px; margin: 0; }
.ai-coach-limit-reached .btn { margin-left: auto; flex-shrink: 0; }
```

- [ ] **Step 3: Manual verification**

As the free test user, send 3 messages in AI Coach — confirm the 4th attempt shows the upgrade panel instead of sending. Reload the page — confirm the counter resets to 0 (expected/documented behavior, not a bug). Flip the test user to premium via SQL, reload, and confirm no limit applies regardless of message count.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AICoach.jsx src/pages/AICoach.css
git commit -m "$(cat <<'EOF'
Gate AI Coach to 3 free chats via usePremium(), client-side counter

isPremium is always read from the real subscriptions table via
usePremium() — only the message COUNT is client-side/temporary, clearly
commented as such with the path to real server-side enforcement.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Guides gating

**Files:**
- Modify: `src/data/guides.js`, `src/components/guides/GuideCard.jsx`, `src/pages/GuideDetail.jsx`, `src/components/guides/guides.css` (or wherever `GuideCard` styles live — confirm exact filename during implementation via `Glob src/components/guides/*.css` / `src/pages/Guides.css`)

**Interfaces:**
- Consumes: `usePremium()` (Task 3).
- Produces: each guide object in `data/guides.js` gains `premium: boolean`.

- [ ] **Step 1: Add `premium` flags in `src/data/guides.js`**

For every guide entry, add `premium: true` if `difficulty === 'Advanced'`, else `premium: false`. Since this file is a plain array of object literals (confirmed via earlier read — entries like `{ ..., category: 'Maps', difficulty: 'Advanced', ... }`), add the field to each object individually rather than post-processing at runtime, so it stays inspectable as static data (consistent with how the rest of the file is authored). Grep the file for `difficulty: 'Advanced'` to find every entry needing `premium: true`; every other entry gets `premium: false`.

- [ ] **Step 2: Add a lock affordance to `src/components/guides/GuideCard.jsx`**

Read the current file first, then:
```jsx
import { Lock } from 'lucide-react'
import { usePremium } from '../../context/PremiumContext.jsx'
```
Inside the component, before the return:
```jsx
const { isPremium } = usePremium()
const isLocked = guide.premium && !isPremium
```
Add a lock badge/overlay in the card's markup when `isLocked` (exact placement depends on the card's existing structure — add a small `{isLocked && <span className="guide-card-lock"><Lock size={12} /> Premium</span>}` near wherever the existing difficulty/category badge renders, following that badge's existing markup pattern rather than introducing a new one).

Add matching CSS:
```css
.guide-card-lock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--gold);
  font-size: 11px;
  font-weight: 600;
}
```

- [ ] **Step 3: Add the paywall to `src/pages/GuideDetail.jsx`**

Read the current file first. Near the top of the component:
```jsx
import { usePremium } from '../context/PremiumContext.jsx'
```
```jsx
const { isPremium } = usePremium()
```
After the guide is loaded (wherever the current "not found" early-return lives), add:
```jsx
if (guide.premium && !isPremium) {
  return (
    <div className="page-shell guide-paywall">
      <div className="guide-paywall-panel">
        <Lock size={20} />
        <h1>Premium Guide</h1>
        <p>"{guide.title}" is part of the full STRATIX Guides Library. Upgrade to Premium to unlock it.</p>
        <Button variant="primary" to="/premium">Upgrade to Premium</Button>
      </div>
    </div>
  )
}
```
(Import `Lock` from `lucide-react` and `Button` from `'../components/ui/Button.jsx'` if not already present in this file.)

Add matching CSS in `Guides.css` (or the file identified in Step 1's Glob):
```css
.guide-paywall { display: flex; justify-content: center; padding: 80px 20px; }
.guide-paywall-panel {
  max-width: 420px;
  text-align: center;
  padding: 36px 28px;
  background: var(--charcoal);
  border: 1px solid rgba(255, 182, 72, 0.25);
  border-radius: var(--radius);
}
.guide-paywall-panel svg { color: var(--gold); margin-bottom: 14px; }
.guide-paywall-panel h1 { font-size: 24px; margin-bottom: 10px; }
.guide-paywall-panel p { color: var(--gray); font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
```

- [ ] **Step 4: Manual verification**

As the free test user, visit `/guides` — confirm Advanced-difficulty guides show a lock badge, others don't. Click an Advanced guide directly — confirm the paywall panel replaces the guide content. Flip to premium via SQL, reload — confirm the same guide now opens normally.

- [ ] **Step 5: Commit**

```bash
git add src/data/guides.js src/components/guides/GuideCard.jsx src/pages/GuideDetail.jsx
git commit -m "$(cat <<'EOF'
Gate Advanced-difficulty guides behind Premium

Free/premium split derived from each guide's existing difficulty field
rather than an arbitrary per-guide pick. Locked guides show a lock badge
in the library and a paywall panel when opened directly.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Profile plan-status block

**Files:**
- Modify: `src/components/profile/ProfileHeader.jsx`, `src/pages/Profile.css`

**Interfaces:**
- Consumes: `usePremium()` (Task 3), `useTheme()` (Task 5).

- [ ] **Step 1: Add the block to `src/components/profile/ProfileHeader.jsx`**

```jsx
import { usePremium } from '../../context/PremiumContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
```
Inside the component:
```jsx
const { isPremium } = usePremium()
const { theme } = useTheme()
```
Add a new block inside `.profile-hero-grid`, alongside the existing `.profile-rank-card` (as a sibling panel, not replacing it):
```jsx
<div className="profile-plan-card">
  <div className="profile-plan-card-top">
    <span className="eyebrow">Plan</span>
  </div>
  {isPremium ? (
    <>
      <div className="profile-plan-status profile-plan-status-premium">PREMIUM · ACTIVE</div>
      <span className="profile-plan-theme">Theme: {theme[0].toUpperCase() + theme.slice(1)}</span>
      <Button variant="secondary" disabled>Manage Subscription</Button>
    </>
  ) : (
    <>
      <div className="profile-plan-status">FREE PLAN</div>
      <Button variant="primary" to="/premium">Upgrade to Premium</Button>
    </>
  )}
</div>
```
(`Button` is already imported in this file for the existing "Edit Profile" button.)

- [ ] **Step 2: Add CSS to `src/pages/Profile.css`**

```css
.profile-plan-card {
  padding: 14px 16px;
  background: var(--black);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.profile-plan-status {
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--gray);
}
.profile-plan-status-premium { color: var(--gold); }
.profile-plan-theme { font-size: 11px; color: var(--gray-dim); }
```

- [ ] **Step 3: Manual verification**

As the free test user, visit `/profile` — confirm "FREE PLAN" + "Upgrade to Premium" shows. Flip to premium via SQL, set `theme = 'green'`, reload — confirm "PREMIUM · ACTIVE", "Theme: Green", and a disabled "Manage Subscription" button. Revert both rows to free/red afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/profile/ProfileHeader.jsx src/pages/Profile.css
git commit -m "$(cat <<'EOF'
Add plan status block to Profile

Shows FREE PLAN + upgrade CTA or PREMIUM · ACTIVE + selected theme,
reading from the same usePremium()/useTheme() hooks used everywhere else
— no separate profile-specific entitlement logic.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Final verification pass and report

**Files:** none (verification only)

- [ ] **Step 1: Static checks**

```bash
npm run build
npm run lint
```
Fix any errors surfaced (expected to be clean given each prior task already built/verified incrementally — if something fails here, it's from an interaction between tasks, e.g. an unused import left behind).

- [ ] **Step 2: Live pass through the 16-item checklist from the spec**

Using the Chrome browser tools against the running dev server, and SQL toggles against the test user's `subscriptions.status`/`profiles.theme` rows (via `execute_sql`) in place of a real payment flow:

1. Courses removed from navbar — visually confirm.
2. No broken `/courses*` routes — confirm 404.
3. Premium tab present, gold-styled, links to `/premium`.
4. Premium page loads, all 10 feature cards render.
5. Theme selector renders 4 swatches.
6. RED theme (default) — confirm renders correctly.
7. BLUE, GREEN, GOLD themes each apply correctly when premium (SQL-toggle test user active, click each in turn).
8. Theme transitions smoothly (visually confirm the ~400ms shift, not an instant snap).
9. Theme persists after refresh (confirm via reload after each SQL-set value).
10. Free users cannot activate non-red themes (confirm paywall panel appears, color doesn't change).
11. Premium users can activate every theme.
12. AI Coach 3-chat limit triggers correctly for free, doesn't for premium.
13. Guides lock/paywall triggers correctly for free, doesn't for premium.
14. Profile plan-status block correct in both states.
15. Existing untouched functionality still works: sign in/out, Dashboard, Landing, AI Coach chat itself (under the limit), Guides browsing, Quizzes page.
16. Browser console clean of errors across all of the above.

Clean up: revert the test user's `subscriptions` row to `status = 'none'` and `profiles.theme` to `'red'` when done.

- [ ] **Step 3: Write the final report**

Reply to the user with (per their original request's item 15):
- Files changed (list, grouped by task).
- Courses files/routes removed/disconnected (Task 1's file list).
- Premium files/components created (Tasks 3, 7-14).
- Theme architecture summary (Tasks 4-6).
- Free/Premium entitlement architecture summary (Tasks 2-3), explicitly restating that `isPremium` is Supabase-table-backed and the AI Coach counter is the one documented client-side/temporary exception.
- Database changes (`subscriptions` table + `profiles.theme` column, migration name from Task 2).
- What's currently functional vs. what remains for real payment integration (mirrors the spec's "Next stage" list).
- Any issues found during the live pass that need the user's decision (e.g. the FOUC-on-load caveat noted in Task 5, if still present).

No commit for this task (verification + reporting only).

---

## Self-Review

**Spec coverage:** §1 Courses removal → Task 1. §2 Premium nav tab → Task 7. §3 Premium Hub architecture → Tasks 8-9. §4 entitlement architecture (incl. the AI Coach client-side clarification) → Tasks 2-3, 12. §5/§6 theme system + transition → Tasks 4-6. §7 theme preview UI → Task 10. §8 Premium-only access/paywall → Task 10. §9 future-proof modularity → Task 8 (config array). §10 Premium Quizzes → Task 11. §11 visual design → woven through Tasks 7-11's CSS (dark foundation, gold accents, existing motion language, no rainbow/neon). §14 Profile integration → Task 14. §15 final cleanup/testing → Task 15. Guides/AI Coach light gating (from the user's scope answer) → Tasks 12-13.

**Placeholder scan:** no TBD/TODO markers; every step has concrete code or an exact SQL/bash command.

**Type/name consistency checked:** `usePremium()` return shape (`isPremium`, `plan`, `status`, `isLoading`) is identical across Tasks 3, 9, 10, 12, 13, 14. `useTheme()` return shape (`theme`, `setTheme`, `isSaving`) identical across Tasks 5, 10, 14. `premiumFeatures` entry shape matches between Task 8's data file and its consumer in the same task. Route path `/premium` consistent between Tasks 7 and 9.
