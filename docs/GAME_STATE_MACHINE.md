# Game State Machine

## States
- `lobby`: room created, players joining, settings editable by host.
- `dealing_starter_cards`: server assigns one starter card per player.
- `await_turn_action`: active player must place, skip, or buy-card.
- `await_challenges`: placement submitted, challengers may claim.
- `revealing`: card date revealed and outcomes resolved.
- `completed`: win condition reached or game aborted.

## Commands
- `join_room`
- `leave_room`
- `start_game`
- `place_card`
- `submit_recognition`
- `challenge`
- `skip_card`
- `buy_card`
- `reveal_turn`
- `reconnect_sync`

## Command Guards
- Every command includes `expected_turn` and `expected_state_version`.
- Reject if requester is unauthorized for room/game.
- Reject if state does not allow the command.
- Reject stale or duplicated idempotency key.

## Transition Summary
- `lobby` + `start_game` -> `dealing_starter_cards`
- `dealing_starter_cards` (complete) -> `await_turn_action`
- `await_turn_action` + `place_card` -> `await_challenges`
- `await_turn_action` + `skip_card` -> `await_turn_action` (same player with next card)
- `await_turn_action` + `buy_card` -> `await_turn_action` (next player)
- `await_challenges` + `challenge` -> `await_challenges`
- `await_challenges` + `reveal_turn` -> `revealing`
- `revealing` (resolved) -> `completed` if winner else `await_turn_action`

## Failure Handling
- Invalid command returns deterministic error code and no state mutation.
- Late challenge after reveal request returns `CHALLENGE_WINDOW_CLOSED`.
- Insufficient tokens returns `INSUFFICIENT_TOKENS`.
- Deck exhaustion returns `DECK_EXHAUSTED`.

## Host Migration
- If host disconnects in `lobby` or active game:
  - Promote lowest seat-index connected authenticated user.
  - If no authenticated users, promote lowest seat-index connected guest.
  - Emit `HOST_CHANGED` event.

