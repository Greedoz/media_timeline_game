# Media Timeline Party Game

Monorepo implementation scaffold for the Media Timeline Party Game MVP.

## Workspace Layout
- `apps/web`: Next.js app with API routes and UI skeleton.
- `packages/shared-types`: shared domain and API/event contracts.
- `packages/game-engine`: deterministic timeline game logic.
- `supabase/migrations`: SQL schema and RLS.
- `docs`: PRD, rules, architecture, data, API, security, testing, ops, roadmap.
- `agents`: role-specific implementation instructions.

## Quick Start
Prerequisites:
- Node.js 20+
- pnpm 10+

1. Install dependencies:
   - `pnpm install`
2. Run web app:
   - `pnpm dev`
3. Run game-engine tests:
   - `pnpm --filter @media-timeline-game/game-engine test`

## Notes
- API routes currently use an in-memory data store for MVP scaffolding.
- Supabase migration defines persistent schema and policies for production wiring.
- Room/deck/game endpoints match the documented contracts in `docs/API_SPEC.md`.
