-- Lets "Continue with Riot" find a Riot-created STRATIX account again after
-- its Riot link was disconnected.
--
-- Riot-only accounts are created by the server with a placeholder email that
-- is derived from the Riot puuid (riot-<sha256 prefix>@riot-users.stratix.invalid)
-- and app_metadata.stratix_auth_provider = 'riot'. After a disconnect there is
-- no riot_connections row, so the puuid lookup finds nothing; without this
-- function the next Riot sign-in tried to create a duplicate user, failed,
-- and the account was stranded.
--
-- Deliberately narrow: only matches the Riot-only placeholder domain AND
-- accounts the server created through Riot — never a normal email user.
-- Read-only, service_role only. No data or table changes. Reversible: drop it.

create or replace function public.find_riot_only_user(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
  from auth.users u
  where u.email = lower(p_email)
    and lower(p_email) like '%@riot-users.stratix.invalid'
    and coalesce(u.raw_app_meta_data ->> 'stratix_auth_provider', '') = 'riot'
  limit 1;
$$;

revoke all on function public.find_riot_only_user(text) from public, anon, authenticated;
grant execute on function public.find_riot_only_user(text) to service_role;
