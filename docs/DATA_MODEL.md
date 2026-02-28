# Data Model

## Key Tables

### `users`
- `id uuid pk`
- `auth_provider_id text unique not null`
- `display_name text not null`
- `created_at timestamptz not null default now()`

### `decks`
- `id uuid pk`
- `owner_id uuid fk users(id)`
- `name text not null`
- `visibility text not null check (visibility in ('private','invite','public'))`
- `invite_code text unique`
- `is_seeded_public boolean not null default false`
- `created_at timestamptz not null default now()`

### `deck_members`
- `deck_id uuid fk decks(id)`
- `user_id uuid fk users(id)`
- `role text not null check (role in ('owner','editor','viewer'))`
- pk `(deck_id,user_id)`

### `cards`
- `id uuid pk`
- `deck_id uuid fk decks(id)`
- `media_type text not null`
- `storage_path text not null`
- `thumb_path text`
- `title text`
- `description text`
- `event_date date`
- `event_year int`
- `date_precision text not null check (date_precision in ('exact','year'))`
- `is_playable_exact boolean not null default false`
- `created_by uuid fk users(id)`
- `created_at timestamptz not null default now()`

### `card_aliases`
- `id uuid pk`
- `card_id uuid fk cards(id)`
- `alias_normalized text not null`

### `rooms`
- `id uuid pk`
- `host_user_id uuid fk users(id)`
- `join_code text unique not null`
- `status text not null check (status in ('lobby','active','completed'))`
- `settings_json jsonb not null`
- `created_at timestamptz not null default now()`

### `room_players`
- `room_id uuid fk rooms(id)`
- `player_id uuid`
- `guest_name text`
- `seat_index int not null`
- `connected boolean not null default true`
- `token_count int not null default 2`
- pk `(room_id,seat_index)`

### `games`
- `id uuid pk`
- `room_id uuid fk rooms(id)`
- `deck_id uuid fk decks(id)`
- `mode text not null check (mode in ('exact','year'))`
- `target_cards int not null`
- `status text not null check (status in ('active','completed','aborted'))`
- `started_at timestamptz not null default now()`
- `ended_at timestamptz`

### `game_players`
- `game_id uuid fk games(id)`
- `player_id uuid not null`
- `timeline_order_json jsonb not null`
- `score_cards_count int not null default 1`
- `tokens int not null default 2`
- pk `(game_id,player_id)`

### `turns`
- `id uuid pk`
- `game_id uuid fk games(id)`
- `turn_number int not null`
- `active_player_id uuid not null`
- `card_id uuid not null`
- `placed_position int`
- `revealed_date date`
- `outcome text`
- unique `(game_id,turn_number)`

### `challenges`
- `id uuid pk`
- `turn_id uuid fk turns(id)`
- `challenger_id uuid not null`
- `claimed_position int not null`
- `claimed_at timestamptz not null default now()`
- `resolved_outcome text`
- unique `(turn_id,claimed_position)`

### `events`
- `id uuid pk`
- `game_id uuid fk games(id)`
- `sequence_no bigint not null`
- `event_type text not null`
- `payload jsonb not null`
- `idempotency_key text not null`
- `created_at timestamptz not null default now()`
- unique `(game_id,sequence_no)`
- unique `(game_id,idempotency_key)`

### `reports`
- `id uuid pk`
- `reporter_id uuid`
- `target_type text not null`
- `target_id uuid not null`
- `reason text not null`
- `created_at timestamptz not null default now()`

## Indexes
- `cards(deck_id, event_date)`
- `cards(deck_id, event_year)`
- `rooms(join_code)`
- `events(game_id, sequence_no desc)`
- `games(room_id, status)`

## RLS Model
- Private deck/card read access limited to owner and members.
- Room/game access limited to joined room players and host.
- Seeded public decks readable by all authenticated and guest sessions.

