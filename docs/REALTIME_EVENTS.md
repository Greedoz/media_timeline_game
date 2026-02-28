# Realtime Events

Channel: `room:{roomId}`

## Event Envelope
```json
{
  "sequenceNo": 93,
  "type": "TURN_REVEALED",
  "gameId": "uuid",
  "occurredAt": "2026-02-28T15:00:00.000Z",
  "payload": {}
}
```

## Events
- `ROOM_PLAYER_JOINED`
- `ROOM_PLAYER_LEFT`
- `ROOM_PLAYER_READY_CHANGED`
- `ROOM_SETTINGS_UPDATED`
- `GAME_STARTED`
- `TURN_CARD_DEALT`
- `TURN_CARD_PLACED`
- `TURN_CHALLENGE_ADDED`
- `TURN_REVEALED`
- `TOKENS_UPDATED`
- `SCORE_UPDATED`
- `HOST_CHANGED`
- `GAME_COMPLETED`

## Sequencing
- Sequence numbers are monotonically increasing per game.
- Clients ignore events with sequence less than or equal to last processed.
- On gap detection, client requests snapshot sync and resumes.

## Idempotency
- Mutating actions carry `idempotencyKey`.
- Duplicate key for same game returns prior result and no new event.

