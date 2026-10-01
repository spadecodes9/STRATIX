// Server-side Premium enforcement for gated features. The browser hides or
// locks these too, but that is presentation only — these routes are the
// actual gate. Premium is decided from the user's `subscriptions` row (users
// can read it, never write it) using the shared rule in src/lib/entitlement.js.
import { canAccess, canUseTheme, computeIsPremium, THEMES } from '../src/lib/entitlement.js'
import { adminClient, getUserFromRequest, hasServiceRole, userClient } from './supabase.js'
import { PREMIUM_GUIDE_CONTENT } from './premiumGuides.js'

// Any failure -> false (fails closed: treated as Free).
export async function isPremiumUser(auth) {
  const { data, error } = await userClient(auth.token)
    .from('subscriptions')
    .select('status, entitlement_type, patch_version')
    .eq('user_id', auth.user.id)
    .maybeSingle()
  if (error) {
    console.error('[premium] Entitlement check failed, treating as Free:', error.message)
    return false
  }
  return computeIsPremium(data)
}

const SIGN_IN_REQUIRED = { error: 'Sign in to continue.', code: 'sign_in_required' }
const PREMIUM_REQUIRED = { error: 'This requires STRATIX Premium.', code: 'premium_required' }

export function registerPremiumRoutes(app) {
  // Premium guide bodies. They exist only on the server, so the client
  // bundle can't leak them; this is the only way to read one.
  app.get('/api/guides/:id/content', async (req, res) => {
    res.set('Cache-Control', 'private, no-store')
    const content = Object.hasOwn(PREMIUM_GUIDE_CONTENT, req.params.id) ? PREMIUM_GUIDE_CONTENT[req.params.id] : null
    if (!content) return res.status(404).json({ error: 'Guide not found.' })

    const auth = await getUserFromRequest(req).catch(() => null)
    if (!auth) return res.status(401).json(SIGN_IN_REQUIRED)
    if (!canAccess('premium-guides', await isPremiumUser(auth))) return res.status(403).json(PREMIUM_REQUIRED)
    res.json({ content })
  })

  // Theme preference. profiles.theme is not client-writable (column grants),
  // so this is the only write path, and it re-checks Premium every time.
  app.post('/api/profile/theme', async (req, res) => {
    const theme = req.body?.theme
    if (!THEMES.includes(theme)) return res.status(400).json({ error: 'Unknown theme.' })

    const auth = await getUserFromRequest(req).catch(() => null)
    if (!auth) return res.status(401).json(SIGN_IN_REQUIRED)
    if (!canUseTheme(theme, await isPremiumUser(auth))) return res.status(403).json(PREMIUM_REQUIRED)
    if (!hasServiceRole()) {
      console.error('[premium] SUPABASE_SERVICE_ROLE_KEY is not set — cannot save theme.')
      return res.status(503).json({ error: "Theme saving isn't configured yet." })
    }

    // service_role has no table access; this service_role-only function updates
    // just profiles.theme on this user's row (migration 20261001000400).
    const { data: saved, error } = await adminClient().rpc('set_profile_theme_for_user', {
      p_user_id: auth.user.id,
      p_theme: theme,
    })
    if (error) {
      console.error('[premium] Theme save failed:', error.code ?? error.message)
      return res.status(500).json({ error: "Couldn't save your theme. Try again." })
    }
    if (!saved) return res.status(404).json({ error: 'Profile not found.' })
    res.json({ theme })
  })
}
