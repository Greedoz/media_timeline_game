# Architecture

## Stack
- Frontend/Backend: Next.js App Router
- Data/Auth/Storage/Realtime: Supabase (Postgres, Auth, Storage, Realtime)
- Shared contracts: `packages/shared-types`
- Deterministic rules: `packages/game-engine`

## High-Level Components
- `apps/web`: UI, API routes, server actions.
- `packages/shared-types`: request/response DTOs, game events/actions, domain enums.
- `packages/game-engine`: pure gameplay logic and validators.
- `supabase/migrations`: schema, constraints, indexes, RLS.

## Trust Boundaries
- Client is untrusted.
- API routes are trusted orchestration layer.
- Game engine is deterministic and side-effect free.
- DB is the source of truth; realtime is a projection channel.

## Runtime Flow
1. Client sends game action to API with turn/version guard and idempotency key.
2. API loads latest authoritative snapshot from DB.
3. API executes action through game engine.
4. API persists state/event atomically.
5. API publishes realtime event for room subscribers.

## Data Consistency
- Append-only event log for auditing and replay.
- Materialized snapshot for fast reads/reconnect.
- Idempotency token per command to prevent duplicate mutation.

## Media Handling
- Private bucket storage for deck media.
- Signed upload/download URLs.
- Async video pipeline for thumbnail/transcode generation.

## Deployment
- Web app: Vercel.
- Database and storage: managed Supabase project.
- Background jobs: queued worker (can be Supabase Edge Functions or queue worker service).

