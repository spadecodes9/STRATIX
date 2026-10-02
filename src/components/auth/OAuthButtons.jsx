import { RiotIcon, RiotLinkDisclosure } from '../riot/Riot.jsx'

// Shared "Continue with Google / Discord / Riot" buttons for the STRATIX auth
// pages. Deliberately minimal: no analytics, no fake behavior — each button
// calls its OAuth trigger directly and reflects real pending/disabled state
// passed down from the page.

export default function OAuthButtons({ onGoogle, onDiscord, onRiot, pendingProvider, disabled }) {
  // Each button disables for its OWN pending state (so a double-click on
  // the same button can't fire twice) plus the shared `disabled` (e.g. the
  // email/password form is submitting) — but NOT for the other provider's
  // pending state, so clicking Google doesn't lock out Discord.
  const googleDisabled = disabled || pendingProvider === 'google'
  const discordDisabled = disabled || pendingProvider === 'discord'
  const riotDisabled = disabled || pendingProvider === 'riot'

  return (
    <div className="auth-oauth-group">
      <button
        type="button"
        className="oauth-btn oauth-btn-google"
        onClick={onGoogle}
        disabled={googleDisabled}
      >
        <GoogleIcon />
        <span>{pendingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}</span>
      </button>
      <button
        type="button"
        className="oauth-btn oauth-btn-discord"
        onClick={onDiscord}
        disabled={discordDisabled}
      >
        <DiscordIcon />
        <span>{pendingProvider === 'discord' ? 'Redirecting…' : 'Continue with Discord'}</span>
      </button>
      {onRiot && (
        <button
          type="button"
          className="oauth-btn oauth-btn-riot"
          onClick={onRiot}
          disabled={riotDisabled}
        >
          <RiotIcon />
          <span>{pendingProvider === 'riot' ? 'Redirecting…' : 'Continue with Riot'}</span>
        </button>
      )}
      {onRiot && (
        <>
          <RiotLinkDisclosure className="oauth-riot-note" />
          <p className="oauth-riot-note">
            Already have a STRATIX account? Sign in with it, then connect Riot from your Profile to keep one account.
          </p>
        </>
      )}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="17" height="13" viewBox="0 0 127 96" aria-hidden="true">
      <path
        fill="#5865F2"
        d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69c-6.27 0-11.4-5.62-11.4-12.5 0-6.87 5-12.51 11.4-12.51s11.51 5.63 11.4 12.51c.01 6.88-5.02 12.5-11.4 12.5Zm42.24 0c-6.27 0-11.4-5.62-11.4-12.5 0-6.87 5-12.51 11.4-12.51s11.5 5.63 11.4 12.51c0 6.88-5.02 12.5-11.4 12.5Z"
      />
    </svg>
  )
}
