-- Persistent AI Coach conversation history, one account's history per user.
--
-- ADDITIVE ONLY: two new tables, RLS, grants, and one server-only write
-- function. No existing table, grant, or function changes — the Free-plan
-- quota (ai_coach_usage + consume_/refund_ai_coach_message_for_user) is a
-- separate concern and is untouched.
--
-- Access model (same as riot_connections / riot_player_data):
--   * authenticated — SELECT its own rows only (RLS). No INSERT/UPDATE/DELETE,
--     so a browser can never plant a fake "assistant" message in its history.
--   * service_role  — no table privileges (project convention); writes only
--     through save_ai_coach_exchange_for_user, called by /api/ai-coach after
--     it has verified the session. The user id comes from that verified
--     session, never from the request body.
--
-- Reversible: drop the function and both tables.

create table public.ai_coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Target for the messages' composite FK below.
  unique (id, user_id)
);

create index ai_coach_conversations_user_updated_idx
  on public.ai_coach_conversations (user_id, updated_at desc);

create table public.ai_coach_messages (
  -- Identity gives insertion order; a user message and its reply are written
  -- in one statement, user first.
  id bigint generated always as identity primary key,
  conversation_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (length(content) > 0),
  -- Client-generated per send; makes a retried request a no-op.
  request_id uuid not null,
  created_at timestamptz not null default now(),
  -- A message always belongs to a conversation owned by the same user.
  foreign key (conversation_id, user_id)
    references public.ai_coach_conversations (id, user_id) on delete cascade,
  unique (user_id, request_id, role)
);

create index ai_coach_messages_user_id_idx on public.ai_coach_messages (user_id, id desc);
create index ai_coach_messages_conversation_idx on public.ai_coach_messages (conversation_id, id);

alter table public.ai_coach_conversations enable row level security;
alter table public.ai_coach_messages enable row level security;

create policy "Users can view their own AI Coach conversations" on public.ai_coach_conversations
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can view their own AI Coach messages" on public.ai_coach_messages
  for select to authenticated using ((select auth.uid()) = user_id);

revoke all on public.ai_coach_conversations, public.ai_coach_messages from public, anon, authenticated, service_role;
grant select on public.ai_coach_conversations, public.ai_coach_messages to authenticated;

-- Stores one exchange (the user's message + the coach's reply) at most once
-- per p_request_id, in the user's latest conversation (created on first use).
-- Returns { inserted, reply }: inserted = false means this request was already
-- saved (retry / double submit) and `reply` is the stored reply.
create or replace function public.save_ai_coach_exchange_for_user(
  p_user_id uuid,
  p_request_id uuid,
  p_user_content text,
  p_assistant_content text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conversation_id uuid;
  v_reply text;
begin
  if p_user_id is null or p_request_id is null then
    raise exception 'user id and request id required' using errcode = '22004';
  end if;
  if coalesce(length(trim(p_user_content)), 0) = 0 or coalesce(length(trim(p_assistant_content)), 0) = 0 then
    raise exception 'message content required' using errcode = '22023';
  end if;

  -- Serializes saves per user: no duplicate first conversation, and a
  -- concurrent duplicate request sees the first one's rows below.
  perform pg_advisory_xact_lock(hashtextextended('ai_coach_history:' || p_user_id::text, 0));

  select m.content into v_reply
  from public.ai_coach_messages m
  where m.user_id = p_user_id and m.request_id = p_request_id and m.role = 'assistant';
  if found then
    return jsonb_build_object('inserted', false, 'reply', v_reply);
  end if;

  select c.id into v_conversation_id
  from public.ai_coach_conversations c
  where c.user_id = p_user_id
  order by c.updated_at desc
  limit 1;

  if v_conversation_id is null then
    insert into public.ai_coach_conversations (user_id)
    values (p_user_id)
    returning id into v_conversation_id;
  else
    update public.ai_coach_conversations
    set updated_at = now()
    where id = v_conversation_id;
  end if;

  insert into public.ai_coach_messages (conversation_id, user_id, role, content, request_id)
  values
    (v_conversation_id, p_user_id, 'user', p_user_content, p_request_id),
    (v_conversation_id, p_user_id, 'assistant', p_assistant_content, p_request_id);

  return jsonb_build_object('inserted', true, 'reply', p_assistant_content);
end;
$$;

revoke all on function public.save_ai_coach_exchange_for_user(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.save_ai_coach_exchange_for_user(uuid, uuid, text, text) to service_role;
