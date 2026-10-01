-- Backup taken immediately before 20261001000100_drop_fake_rank_columns.sql.
--
-- Holds the five legacy rank columns of public.profiles (sample data only:
-- Diamond / 2 / 47 / Immortal 1, riot_tag null) so they can be restored.
-- Lives in a separate `backup` schema that no API role can reach:
--   * anon / authenticated / public have no USAGE on the schema, so PostgREST
--     cannot read it even if the schema were ever added to the exposed list;
--   * RLS is enabled with no policies as a second layer.
--
-- Restore (if ever needed):
--   alter table public.profiles add column riot_tag text, add column rank_tier text,
--     add column rank_division text, add column rank_rr integer, add column peak_rank text;
--   update public.profiles p set riot_tag = b.riot_tag, rank_tier = b.rank_tier,
--     rank_division = b.rank_division, rank_rr = b.rank_rr, peak_rank = b.peak_rank
--   from backup.profiles_rank_columns_20261001 b where b.id = p.id;
--
-- Remove when no longer needed: drop schema backup cascade;

create schema if not exists backup;
revoke all on schema backup from public, anon, authenticated;

create table backup.profiles_rank_columns_20261001 as
  select id, riot_tag, rank_tier, rank_division, rank_rr, peak_rank, now() as backed_up_at
  from public.profiles;

alter table backup.profiles_rank_columns_20261001 add primary key (id);
alter table backup.profiles_rank_columns_20261001 enable row level security;
revoke all on table backup.profiles_rank_columns_20261001 from public, anon, authenticated;
