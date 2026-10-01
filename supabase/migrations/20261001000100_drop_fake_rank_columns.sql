-- DESTRUCTIVE — apply manually after review. Not auto-applied.
--
-- Drops 5 columns from public.profiles. Verified on 2026-10-01 (read-only):
--   * every row holds the hardcoded sample values Diamond / 2 / 47 / Immortal 1,
--     riot_tag is null in every row — no real user data lives here;
--   * no views, functions, or triggers reference these columns;
--   * the frontend and server no longer read or write them.
-- Users can UPDATE their own profile row under RLS, so these columns can
-- never be trusted as Riot data; rank comes from riot_player_data only.
--
-- Optional backup first:
--   create table public.profiles_rank_backup_20261001 as
--     select id, riot_tag, rank_tier, rank_division, rank_rr, peak_rank from public.profiles;

-- These columns were user-writable (profiles has an own-row UPDATE policy)
-- and only ever held hardcoded sample data: as of 2026-10-01 every row is
-- Diamond / 2 / 47 RR / Immortal 1 with riot_tag null. Rank now comes
-- exclusively from riot_player_data. The frontend no longer reads them.
alter table public.profiles
  drop column riot_tag,
  drop column rank_tier,
  drop column rank_division,
  drop column rank_rr,
  drop column peak_rank;
