# Media Timeline Game Agent Orchestration

## Purpose
This file defines the execution order, handoff contracts, and definition of done for specialized implementation agents.

## Orchestration Order
1. `Planner`
2. `BackendEngineer`
3. `GameLogicEngineer`
4. `FrontendEngineer`
5. `FrontendDesignLead`
5. `QAEngineer`
6. `Planner` (final compliance pass)

## Global Rules
- Canonical ruleset is `Original Media Mode` based on en-GB Original behavior.
- Game resolution is server-authoritative.
- Private media remains private by default; no public exposure without explicit deck settings.
- MVP supports individual players only (no teams).
- Required game modes: exact date and year-only.

## Handoff Contract
Each agent must deliver:
1. A list of changed files with why each change exists.
2. Test evidence (or explicit blocker why tests could not run).
3. Open risks and concrete next actions.

## Agent Definition Of Done
### Planner
- All docs in `docs/` are internally consistent.
- API, data model, and rules specs are decision complete.
- Acceptance criteria map to concrete tests.

### BackendEngineer
- Supabase migrations apply cleanly.
- RLS policies enforce private-by-default behavior.
- API routes implement core contracts and reject invalid/unauthorized actions.
- Realtime event publishing and event-log persistence are wired.

### GameLogicEngineer
- Deterministic, side-effect-free game engine in `packages/game-engine`.
- Conformance tests cover token rules, challenge lock behavior, equal-date handling, and recognition scoring.
- Version/turn guards prevent stale client action replay.

### FrontendEngineer
- Core flows implemented: landing, dashboard, deck builder, room lobby, gameplay, post-game.
- Shared-screen-first UX with clear turn/score/token state.
- Form/input validation and clear error states.

### FrontendDesignLead
- Establish visual identity, type system, color system, spacing scale, and motion language.
- Apply cohesive design to all core screens without breaking existing functionality.
- Deliver accessible interaction states (focus, hover, disabled, loading, error).
- Produce reusable UI primitives for buttons, cards, badges, panels, and timelines.

### QAEngineer
- Unit/integration/e2e suites mapped to `docs/TEST_PLAN.md`.
- Critical acceptance criteria validated.
- Launch blocker list documented and prioritized.

## Release Gate
Release only when:
1. Game result cannot be manipulated from client.
2. Private deck media access is blocked to non-members.
3. A full 4-player shared-screen match reaches valid completion.
4. All P0/P1 issues are closed or explicitly waived with owner signoff.
5. Frontend design checklist in `docs/FRONTEND_POLISH_SPEC.md` is satisfied.
