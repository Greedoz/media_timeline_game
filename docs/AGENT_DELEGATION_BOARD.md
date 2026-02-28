# Agent Delegation Board

## Purpose
Execution-ready backlog distributed across specialist agents.

## Priority Legend
- `P0`: critical for MVP quality/reliability
- `P1`: high-value enhancement for MVP completeness
- `P2`: important but can follow MVP launch

## Planner
- `P0` Freeze v1 API + rules spec deltas from implementation.
- `P0` Create acceptance checklist mapping each requirement to tests and screens.

## BackendEngineer
- `P0` Replace in-memory store with Supabase persistence for decks/rooms/games.
- `P0` Add realtime event publishing for room channels.
- `P1` Implement signed upload URL generation and metadata completion endpoints.
- `P1` Add API integration tests for authz, idempotency, and turn guards.

## GameLogicEngineer
- `P0` Add deterministic event emission helpers from engine transitions.
- `P0` Add tests for stale `expectedTurn`/`expectedStateVersion` rejections.
- `P1` Add conformance tests for buy-card win checks and deck exhaustion boundaries.

## FrontendEngineer
- `P0` Implement real deck builder forms and upload flow integration.
- `P0` Implement lobby with player list, host settings, and ready/start controls.
- `P0` Implement gameplay UI driven by action endpoints and game snapshots.
- `P1` Add robust client-side error banners and retry controls.

## FrontendDesignLead
- `P0` Apply visual system from `docs/FRONTEND_POLISH_SPEC.md`.
- `P0` Style gameplay HUD for strong shared-screen readability.
- `P1` Add meaningful motion for reveal/result transitions.

## QAEngineer
- `P0` Build integration suite for room lifecycle and gameplay lifecycle.
- `P0` Validate privacy controls and unauthorized access rejection paths.
- `P1` Create manual exploratory checklist for shared-screen sessions.

