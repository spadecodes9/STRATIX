-- Narrow, server-only write paths.
--
-- In this project service_role has NO table privileges on public tables
-- (verified 2026-10-01: SELECT/INSERT/UPDATE/DELETE all false), so the
-- backend's direct table writes failed with 42501. Instead of granting
-- service_role broad table access, each server operation gets one
-- purpose-built SECURITY DEFINER function that touches only the rows and
-- columns it needs and validates its input.
--
-- Conventions (same as consume_/refund_ai_coach_message_for_user):
--   * security definer + empty search_path, fully-qualified names
--   * EXECUTE revoked from public/anon/authenticated, granted to service_role only
--   * the caller (server) passes a user id it has already verified from the
--     Supabase session; RLS on the tables is unchanged.
--
-- No table data is modified by this migration. No table grants change.
-- Reversible: drop the six functions.

-- 1. Theme ------------------------------------------------------------------
-- Premium is checked by the server (POST /api/profile/theme) before calling.
-- The function only guarantees a known theme value and the caller's own row.
create or replace function public.set_profile_theme_for_user(p_user_id uuid, p_theme text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user_id is null then
    raise exception 'user id required' using errcode = '22004';
  end if;
  if p_theme is null or p_theme not in ('red', 'blue', 'green', 'gold') then
    raise exception 'invalid theme' using errcode = '22023';
  end if;

  update public.profiles set theme = p_theme where id = p_user_id;
  return found;
end;
$$;

-- 2. Riot: who owns this Riot account? (sign-in with Riot) -----------------
create or replace function public.find_user_by_riot_puuid(p_puuid text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.user_id from public.riot_connections c where c.puuid = p_puuid;
$$;

-- 3. Riot: link a verified Riot account to a STRATIX user -----------------
-- Returns 'linked' or 'already_linked' (puuid belongs to another user).
-- Re-linking a different Riot account drops the old account's synced data.
create or replace function public.link_riot_account_for_user(
  p_user_id uuid,
  p_puuid text,
  p_game_name text,
  p_tag_line text,
  p_shard text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
begin
  if p_user_id is null or coalesce(btrim(p_puuid), '') = '' then
    raise exception 'user id and puuid required' using errcode = '22004';
  end if;
  if length(p_puuid) > 128 or length(coalesce(p_game_name, '')) > 64 or length(coalesce(p_tag_line, '')) > 16 then
    raise exception 'riot identity field too long' using errcode = '22001';
  end if;
  if p_shard is not null and p_shard not in ('na', 'eu', 'ap', 'kr', 'latam', 'br') then
    raise exception 'invalid shard' using errcode = '22023';
  end if;

  select c.user_id into v_owner from public.riot_connections c where c.puuid = p_puuid for update;
  if v_owner is not null and v_owner <> p_user_id then
    return 'already_linked';
  end if;

  insert into public.riot_connections as c (user_id, puuid, game_name, tag_line, shard, updated_at)
  values (p_user_id, p_puuid, p_game_name, p_tag_line, p_shard, now())
  on conflict (user_id) do update
    set puuid = excluded.puuid,
        game_name = excluded.game_name,
        tag_line = excluded.tag_line,
        shard = coalesce(excluded.shard, c.shard),
        updated_at = now();

  delete from public.riot_player_data d where d.user_id = p_user_id and d.puuid <> p_puuid;
  return 'linked';
exception
  -- Concurrent link of the same puuid by another user (unique puuid).
  when unique_violation then
    return 'already_linked';
end;
$$;

-- 4. Riot: what to sync for this user -------------------------------------
create or replace function public.get_riot_connection_for_user(p_user_id uuid)
returns table (puuid text, shard text)
language sql
stable
security definer
set search_path = ''
as $$
  select c.puuid, c.shard from public.riot_connections c where c.user_id = p_user_id;
$$;

-- 5. Riot: store a sync result --------------------------------------------
-- Only writes if p_puuid is still the user's linked account (a disconnect or
-- re-link during a slow sync can't resurrect stale data). Returns false if not.
create or replace function public.save_riot_player_data_for_user(
  p_user_id uuid,
  p_puuid text,
  p_shard text,
  p_data jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user_id is null or p_puuid is null then
    raise exception 'user id and puuid required' using errcode = '22004';
  end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'player data must be a JSON object' using errcode = '22023';
  end if;
  if p_shard is not null and p_shard not in ('na', 'eu', 'ap', 'kr', 'latam', 'br') then
    raise exception 'invalid shard' using errcode = '22023';
  end if;

  update public.riot_connections c
  set shard = coalesce(p_shard, c.shard), updated_at = now()
  where c.user_id = p_user_id and c.puuid = p_puuid;
  if not found then
    return false;
  end if;

  insert into public.riot_player_data as d (user_id, puuid, data, synced_at)
  values (p_user_id, p_puuid, p_data, now())
  on conflict (user_id) do update
    set puuid = excluded.puuid, data = excluded.data, synced_at = now();
  return true;
end;
$$;

-- 6. Riot: disconnect (riot_player_data cascades) -------------------------
create or replace function public.disconnect_riot_account_for_user(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user_id is null then
    raise exception 'user id required' using errcode = '22004';
  end if;
  delete from public.riot_connections c where c.user_id = p_user_id;
  return found;
end;
$$;

-- EXECUTE: service_role only. Supabase's default privileges grant EXECUTE on
-- new public functions to anon/authenticated, so revoke explicitly.
revoke all on function public.set_profile_theme_for_user(uuid, text) from public, anon, authenticated;
revoke all on function public.find_user_by_riot_puuid(text) from public, anon, authenticated;
revoke all on function public.link_riot_account_for_user(uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function public.get_riot_connection_for_user(uuid) from public, anon, authenticated;
revoke all on function public.save_riot_player_data_for_user(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.disconnect_riot_account_for_user(uuid) from public, anon, authenticated;

grant execute on function public.set_profile_theme_for_user(uuid, text) to service_role;
grant execute on function public.find_user_by_riot_puuid(text) to service_role;
grant execute on function public.link_riot_account_for_user(uuid, text, text, text, text) to service_role;
grant execute on function public.get_riot_connection_for_user(uuid) to service_role;
grant execute on function public.save_riot_player_data_for_user(uuid, text, text, jsonb) to service_role;
grant execute on function public.disconnect_riot_account_for_user(uuid) to service_role;
