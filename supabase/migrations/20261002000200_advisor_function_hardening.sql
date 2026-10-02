-- Clears two Supabase security-advisor warnings. Behavior is unchanged.
--
-- 1. public.set_updated_at (trigger on profiles, lesson_progress,
--    skill_scores) had a role-mutable search_path. Its body only calls
--    now(), which resolves from pg_catalog regardless, so pinning an empty
--    search_path changes nothing except closing the warning.
--
-- 2. public.rls_auto_enable is the SECURITY DEFINER function behind the
--    ensure_rls event trigger (auto-enables RLS on new public tables). With
--    no ACL it was EXECUTE-able by PUBLIC, so the advisor flagged it as
--    callable by anon/authenticated via /rest/v1/rpc. Calling it directly
--    already fails (event-trigger functions can't be called), but no client
--    role needs it. Event triggers don't check EXECUTE when firing — verified
--    on production in a rolled-back transaction: a role without EXECUTE
--    created a public table and RLS was still auto-enabled.
--
-- Reversible: alter function public.set_updated_at() reset search_path;
--             grant execute on function public.rls_auto_enable() to public;

alter function public.set_updated_at() set search_path = '';

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
