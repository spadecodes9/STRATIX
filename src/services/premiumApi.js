import { supabase } from '../lib/supabase.js'

// Calls to server routes that enforce Premium (server/premium.js). Errors
// carry the server's `code` ('premium_required' | 'sign_in_required' | …)
// so the UI can show the right locked state.
async function authedRequest(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  let res
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
    })
  } catch {
    throw Object.assign(new Error("Couldn't reach STRATIX. Check your connection and try again."), { code: 'network' })
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || 'Something went wrong. Try again.'), { code: data?.code ?? null, status: res.status })
  }
  return data
}

export async function fetchPremiumGuideContent(guideId) {
  const data = await authedRequest(`/api/guides/${encodeURIComponent(guideId)}/content`)
  return data.content
}

export async function saveTheme(theme) {
  await authedRequest('/api/profile/theme', { method: 'POST', body: JSON.stringify({ theme }) })
}
