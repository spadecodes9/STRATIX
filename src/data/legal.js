// Riot Games compliance text. Single source — import it, never retype it.
// Exact wording is checked by src/lib/riotCompliance.test.js.

// Riot's required legal notice ("Legal Jibber Jabber"), verbatim from the
// Riot Developer Policies (https://developer.riotgames.com/policies/general)
// with "[Your product]" replaced by "STRATIX". Must stay readily visible to
// players — it is rendered in the site-wide footer. Do not paraphrase.
export const RIOT_LEGAL_NOTICE =
  "STRATIX isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc."

// Riot's VALORANT docs (https://developer.riotgames.com/docs/valorant)
// require "a disclaimer within your app that account linking makes player
// data public". The sentence "Account linking makes player data public." is
// that required disclosure; the rest states only what STRATIX actually does
// (what is synced, and that disconnecting deletes it). Shown next to every
// control that starts a Riot link, before the player opts in.
export const RIOT_LINKING_DISCLOSURE =
  'Linking your Riot account is optional. Account linking makes player data public. By connecting, you opt in to sharing your VALORANT player data — your Riot ID, competitive rank, and match statistics — with STRATIX. You can disconnect at any time, which deletes your synced Riot data from STRATIX.'
