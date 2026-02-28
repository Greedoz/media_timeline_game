create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_provider_id uuid unique not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  visibility text not null check (visibility in ('private', 'invite', 'public')),
  invite_code text unique,
  is_seeded_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.deck_members (
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (deck_id, user_id)
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'gif', 'video')),
  storage_path text not null,
  thumb_path text,
  title text,
  description text,
  event_date date,
  event_year int,
  date_precision text not null check (date_precision in ('exact', 'year')),
  is_playable_exact boolean not null default false,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.card_aliases (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  alias_normalized text not null
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  host_user_id uuid not null references public.users(id) on delete restrict,
  join_code text not null unique,
  status text not null check (status in ('lobby', 'active', 'completed')),
  settings_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.room_players (
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid references public.users(id) on delete set null,
  guest_name text,
  guest_session_id text,
  seat_index int not null,
  connected boolean not null default true,
  token_count int not null default 2,
  created_at timestamptz not null default now(),
  primary key (room_id, seat_index)
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete restrict,
  mode text not null check (mode in ('exact', 'year')),
  target_cards int not null check (target_cards between 7 and 15),
  status text not null check (status in ('active', 'completed', 'aborted')),
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.game_players (
  game_id uuid not null references public.games(id) on delete cascade,
  player_id uuid not null references public.users(id) on delete restrict,
  timeline_order_json jsonb not null default '[]'::jsonb,
  score_cards_count int not null default 1,
  tokens int not null default 2,
  created_at timestamptz not null default now(),
  primary key (game_id, player_id)
);

create table if not exists public.turns (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  turn_number int not null,
  active_player_id uuid not null references public.users(id) on delete restrict,
  card_id uuid not null references public.cards(id) on delete restrict,
  placed_position int,
  revealed_date date,
  outcome text,
  created_at timestamptz not null default now(),
  unique (game_id, turn_number)
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  turn_id uuid not null references public.turns(id) on delete cascade,
  challenger_id uuid not null references public.users(id) on delete restrict,
  claimed_position int not null,
  claimed_at timestamptz not null default now(),
  resolved_outcome text,
  unique (turn_id, claimed_position)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  sequence_no bigint not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (game_id, sequence_no),
  unique (game_id, idempotency_key)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id) on delete set null,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_cards_deck_date on public.cards (deck_id, event_date);
create index if not exists idx_cards_deck_year on public.cards (deck_id, event_year);
create index if not exists idx_rooms_join_code on public.rooms (join_code);
create index if not exists idx_events_game_seq on public.events (game_id, sequence_no desc);
create index if not exists idx_games_room_status on public.games (room_id, status);

alter table public.users enable row level security;
alter table public.decks enable row level security;
alter table public.deck_members enable row level security;
alter table public.cards enable row level security;
alter table public.card_aliases enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.games enable row level security;
alter table public.game_players enable row level security;
alter table public.turns enable row level security;
alter table public.challenges enable row level security;
alter table public.events enable row level security;
alter table public.reports enable row level security;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
as $$
  select u.id from public.users u where u.auth_provider_id = auth.uid() limit 1;
$$;

create or replace function public.can_read_deck(deck_uuid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.decks d
    where d.id = deck_uuid
      and (
        d.visibility = 'public'
        or d.owner_id = public.current_app_user_id()
        or exists (
          select 1
          from public.deck_members dm
          where dm.deck_id = d.id
            and dm.user_id = public.current_app_user_id()
        )
      )
  );
$$;

create policy users_self_read on public.users
for select using (id = public.current_app_user_id());

create policy users_self_write on public.users
for all
using (id = public.current_app_user_id())
with check (id = public.current_app_user_id());

create policy decks_read on public.decks
for select using (public.can_read_deck(id));

create policy decks_insert_owner on public.decks
for insert with check (owner_id = public.current_app_user_id());

create policy decks_update_owner on public.decks
for update using (owner_id = public.current_app_user_id());

create policy decks_delete_owner on public.decks
for delete using (owner_id = public.current_app_user_id());

create policy deck_members_read on public.deck_members
for select using (public.can_read_deck(deck_id));

create policy deck_members_manage_owner on public.deck_members
for all
using (
  exists (
    select 1 from public.decks d
    where d.id = deck_id and d.owner_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.decks d
    where d.id = deck_id and d.owner_id = public.current_app_user_id()
  )
);

create policy cards_read on public.cards
for select using (public.can_read_deck(deck_id));

create policy cards_write_owner_editor on public.cards
for all
using (
  exists (
    select 1 from public.decks d
    where d.id = deck_id
      and (
        d.owner_id = public.current_app_user_id()
        or exists (
          select 1 from public.deck_members dm
          where dm.deck_id = d.id
            and dm.user_id = public.current_app_user_id()
            and dm.role in ('owner', 'editor')
        )
      )
  )
)
with check (
  exists (
    select 1 from public.decks d
    where d.id = deck_id
      and (
        d.owner_id = public.current_app_user_id()
        or exists (
          select 1 from public.deck_members dm
          where dm.deck_id = d.id
            and dm.user_id = public.current_app_user_id()
            and dm.role in ('owner', 'editor')
        )
      )
  )
);

create policy card_aliases_read on public.card_aliases
for select using (
  exists (
    select 1
    from public.cards c
    where c.id = card_id and public.can_read_deck(c.deck_id)
  )
);

create policy card_aliases_write on public.card_aliases
for all
using (
  exists (
    select 1
    from public.cards c
    join public.decks d on d.id = c.deck_id
    where c.id = card_id
      and (
        d.owner_id = public.current_app_user_id()
        or exists (
          select 1 from public.deck_members dm
          where dm.deck_id = d.id
            and dm.user_id = public.current_app_user_id()
            and dm.role in ('owner', 'editor')
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.cards c
    join public.decks d on d.id = c.deck_id
    where c.id = card_id
      and (
        d.owner_id = public.current_app_user_id()
        or exists (
          select 1 from public.deck_members dm
          where dm.deck_id = d.id
            and dm.user_id = public.current_app_user_id()
            and dm.role in ('owner', 'editor')
        )
      )
  )
);

create policy rooms_read_participant on public.rooms
for select using (
  host_user_id = public.current_app_user_id()
  or exists (
    select 1 from public.room_players rp
    where rp.room_id = id and rp.player_id = public.current_app_user_id()
  )
);

create policy rooms_insert_host on public.rooms
for insert with check (host_user_id = public.current_app_user_id());

create policy rooms_update_host on public.rooms
for update using (host_user_id = public.current_app_user_id());

create policy room_players_read on public.room_players
for select using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id
      and (
        r.host_user_id = public.current_app_user_id()
        or exists (
          select 1 from public.room_players rp
          where rp.room_id = room_id and rp.player_id = public.current_app_user_id()
        )
      )
  )
);

create policy room_players_write_host on public.room_players
for all
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.host_user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.host_user_id = public.current_app_user_id()
  )
);

create policy games_read_participants on public.games
for select using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id
      and (
        r.host_user_id = public.current_app_user_id()
        or exists (
          select 1 from public.room_players rp
          where rp.room_id = room_id and rp.player_id = public.current_app_user_id()
        )
      )
  )
);

create policy games_write_host on public.games
for all
using (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.host_user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.rooms r
    where r.id = room_id and r.host_user_id = public.current_app_user_id()
  )
);

create policy game_players_read on public.game_players
for select using (
  exists (
    select 1 from public.games g
    where g.id = game_id
      and exists (
        select 1 from public.rooms r
        where r.id = g.room_id
          and (
            r.host_user_id = public.current_app_user_id()
            or exists (
              select 1 from public.room_players rp
              where rp.room_id = r.id and rp.player_id = public.current_app_user_id()
            )
          )
      )
  )
);

create policy game_players_write_host on public.game_players
for all
using (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id and r.host_user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id and r.host_user_id = public.current_app_user_id()
  )
);

create policy turns_read_participants on public.turns
for select using (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id
      and (
        r.host_user_id = public.current_app_user_id()
        or exists (
          select 1 from public.room_players rp
          where rp.room_id = r.id and rp.player_id = public.current_app_user_id()
        )
      )
  )
);

create policy turns_write_host on public.turns
for all
using (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id and r.host_user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id and r.host_user_id = public.current_app_user_id()
  )
);

create policy challenges_read_participants on public.challenges
for select using (
  exists (
    select 1 from public.turns t
    join public.games g on g.id = t.game_id
    join public.rooms r on r.id = g.room_id
    where t.id = turn_id
      and (
        r.host_user_id = public.current_app_user_id()
        or exists (
          select 1 from public.room_players rp
          where rp.room_id = r.id and rp.player_id = public.current_app_user_id()
        )
      )
  )
);

create policy challenges_write_host on public.challenges
for all
using (
  exists (
    select 1 from public.turns t
    join public.games g on g.id = t.game_id
    join public.rooms r on r.id = g.room_id
    where t.id = turn_id and r.host_user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.turns t
    join public.games g on g.id = t.game_id
    join public.rooms r on r.id = g.room_id
    where t.id = turn_id and r.host_user_id = public.current_app_user_id()
  )
);

create policy events_read_participants on public.events
for select using (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id
      and (
        r.host_user_id = public.current_app_user_id()
        or exists (
          select 1 from public.room_players rp
          where rp.room_id = r.id and rp.player_id = public.current_app_user_id()
        )
      )
  )
);

create policy events_write_host on public.events
for all
using (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id and r.host_user_id = public.current_app_user_id()
  )
)
with check (
  exists (
    select 1 from public.games g
    join public.rooms r on r.id = g.room_id
    where g.id = game_id and r.host_user_id = public.current_app_user_id()
  )
);

create policy reports_insert_authenticated on public.reports
for insert with check (public.current_app_user_id() is not null);

create policy reports_read_owner on public.reports
for select using (reporter_id = public.current_app_user_id());

