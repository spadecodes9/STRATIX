-- Server-enforced Free AI Coach limit (3 messages / rolling 24h window).
--
-- Before: the BROWSER called check_and_consume_ai_coach_message() and
-- refund_ai_coach_message() itself, and the server never checked. Any
-- signed-in user could skip the check, or call refund repeatedly to reset
-- their own count.
--
-- After: only the backend (service_role) can consume or refund. The browser
-- keeps read-only SELECT on its own ai_coach_usage row, for display.
--
-- No data is modified. Reversible: re-grant EXECUTE on the old functions
-- and drop the two new ones.

create or replace function public.consume_ai_coach_message_for_user(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit constant integer := 3;
  v_window constant interval := interval '24 hours';
  v_row public.ai_coach_usage%rowtype;
begin
  if p_user_id is null then
    raise exception 'user id required' using errcode = '22004';
  end if;

  insert into public.ai_coach_usage (user_id, message_count, window_started_at, updated_at)
  values (p_user_id, 0, now(), now())
  on conflict (user_id) do nothing;

  -- Row lock serializes concurrent requests from the same user.
  select * into v_row from public.ai_coach_usage where user_id = p_user_id for update;

  -- Window expired: server-side reset, this message is #1 of the new window.
  if now() >= v_row.window_started_at + v_window then
    update public.ai_coach_usage
    set message_count = 1, window_started_at = now(), updated_at = now()
    where user_id = p_user_id
    returning * into v_row;
    return jsonb_build_object('allowed', true, 'message_count', v_row.message_count,
      'limit', v_limit, 'reset_at', v_row.window_started_at + v_window);
  end if;

  if v_row.message_count >= v_limit then
    return jsonb_build_object('allowed', false, 'message_count', v_row.message_count,
      'limit', v_limit, 'reset_at', v_row.window_started_at + v_window);
  end if;

  update public.ai_coach_usage
  set message_count = message_count + 1, updated_at = now()
  where user_id = p_user_id
  returning * into v_row;
  return jsonb_build_object('allowed', true, 'message_count', v_row.message_count,
    'limit', v_limit, 'reset_at', v_row.window_started_at + v_window);
end;
$$;

-- Called by the backend only when the AI request it just counted failed
-- before producing a reply.
create or replace function public.refund_ai_coach_message_for_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_coach_usage
  set message_count = greatest(message_count - 1, 0), updated_at = now()
  where user_id = p_user_id;
end;
$$;

revoke all on function public.consume_ai_coach_message_for_user(uuid) from public, anon, authenticated;
revoke all on function public.refund_ai_coach_message_for_user(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_coach_message_for_user(uuid) to service_role;
grant execute on function public.refund_ai_coach_message_for_user(uuid) to service_role;

-- Close the browser path to the old self-service functions.
revoke execute on function public.check_and_consume_ai_coach_message() from public, anon, authenticated;
revoke execute on function public.refund_ai_coach_message() from public, anon, authenticated;

-- Hardening: TRUNCATE bypasses RLS. Not reachable via PostgREST today, but
-- no client role needs it on these trust-anchor tables.
revoke truncate, references, trigger on public.ai_coach_usage, public.subscriptions from anon, authenticated;
