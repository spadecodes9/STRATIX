import { CURRENT_VALORANT_PATCH } from '../data/patch.js'

// Centralized STRATIX entitlement rules, shared by the browser (display:
// locks, badges, CTAs) and the server (enforcement: server/aiCoachUsage.js,
// server/premium.js). Components never hardcode access — they ask
// canAccess(feature, isPremium) via usePremium().

// A lifetime entitlement is valid regardless of patch. A normal ("patch")
// entitlement is only valid while its patch_version matches the patch
// STRATIX is currently selling Premium for. Both require status 'active'.
// Input is a `subscriptions` row, which users can read but never write.
export function computeIsPremium(subscription) {
  if (subscription?.status !== 'active') return false
  return subscription.entitlement_type === 'lifetime'
    ? true
    : subscription.patch_version === CURRENT_VALORANT_PATCH
}

// Features gated today, and where each is enforced server-side.
export const PREMIUM_FEATURES = {
  'ai-coach-unlimited': 'POST /api/ai-coach — Free plan capped at FREE_AI_COACH_LIMIT per 24h',
  'premium-guides': 'GET /api/guides/:id/content — 403 unless Premium',
  'premium-themes': 'POST /api/profile/theme — 403 for non-free themes unless Premium',
}

export const FREE_AI_COACH_LIMIT = 3
export const FREE_THEMES = ['red']

export function canAccess(feature, isPremium) {
  if (!(feature in PREMIUM_FEATURES)) throw new Error(`Unknown entitlement feature: ${feature}`)
  return Boolean(isPremium)
}

export const canUseTheme = (theme, isPremium) => FREE_THEMES.includes(theme) || canAccess('premium-themes', isPremium)

// Every theme STRATIX ships. Non-free ones need 'premium-themes'.
export const THEMES = ['red', 'blue', 'green', 'gold']
