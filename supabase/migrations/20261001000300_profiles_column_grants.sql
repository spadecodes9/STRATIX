-- Premium themes are a gated feature, so the theme must not be client-
-- writable: before this, any signed-in user could UPDATE profiles.theme to a
-- Premium theme directly through the API. Theme writes now go only through
-- POST /api/profile/theme, which checks Premium server-side.
--
-- Also stops clients writing the legacy fake rank columns.
--
-- Grants only — no data changes. Reversible:
--   grant insert, update on public.profiles to authenticated;
revoke insert, update on public.profiles from anon, authenticated;

grant insert (id, display_name, avatar_url, onboarding_complete, preferences)
  on public.profiles to authenticated;
grant update (display_name, avatar_url, onboarding_complete, preferences)
  on public.profiles to authenticated;
