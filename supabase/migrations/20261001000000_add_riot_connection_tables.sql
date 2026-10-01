-- ADDITIVE ONLY: creates two new tables + RLS + grants. Touches no existing
-- table, column, or row.

-- Riot account linked to a STRATIX user via RSO. Row exists = connected.
-- One Riot account per STRATIX user and vice versa (puuid unique).
-- Written only by the backend (service role) after a verified RSO callback;
-- clients can read their own row but never write it.
create table public.riot_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  puuid text not null unique,
  game_name text,
  tag_line text,
  shard text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Player data synced from Riot for the connected account. Never hand-written.
create table public.riot_player_data (
  user_id uuid primary key references public.riot_connections(user_id) on delete cascade,
  puuid text not null,
  data jsonb not null,
  synced_at timestamptz not null default now()
);

alter table public.riot_connections enable row level security;
alter table public.riot_player_data enable row level security;

create policy "Users can view their own Riot connection" on public.riot_connections
  for select using ((select auth.uid()) = user_id);
create policy "Users can view their own Riot player data" on public.riot_player_data
  for select using ((select auth.uid()) = user_id);

revoke all on public.riot_connections, public.riot_player_data from anon, authenticated;
grant select on public.riot_connections, public.riot_player_data to authenticated;
