# API Specification

## Conventions
- Content type: `application/json`.
- Mutating endpoints require `idempotencyKey`.
- Game actions require `expectedTurn` and `expectedStateVersion`.
- Error body:
  - `code` machine-readable
  - `message` user-safe

## Rooms

### `POST /api/rooms`
Create room as authenticated host.

Request:
```json
{
  "deckId": "uuid",
  "settings": {
    "mode": "exact",
    "targetCards": 10,
    "recognitionMode": "standard"
  }
}
```

### `POST /api/rooms/{roomRef}/join`
Join as guest or authenticated user.

Notes:
- In MVP scaffold, `roomRef` is the room join code.

Request:
```json
{
  "guestName": "Tim"
}
```

### `POST /api/rooms/{id}/start`
Host starts game from lobby.

## Games

### `POST /api/games/{id}/actions/place-card`
```json
{
  "playerId": "uuid",
  "position": 2,
  "expectedTurn": 4,
  "expectedStateVersion": 27,
  "idempotencyKey": "uuid"
}
```

### `POST /api/games/{id}/actions/challenge`
```json
{
  "playerId": "uuid",
  "claimedPosition": 2,
  "expectedTurn": 4,
  "expectedStateVersion": 28,
  "idempotencyKey": "uuid"
}
```

### `POST /api/games/{id}/actions/skip`
Spend 1 token.

### `POST /api/games/{id}/actions/buy-card`
Spend 3 tokens.

### `POST /api/games/{id}/actions/recognition-answer`
```json
{
  "playerId": "uuid",
  "answer": "Tomorrowland",
  "expectedTurn": 4,
  "expectedStateVersion": 28,
  "idempotencyKey": "uuid"
}
```

### `POST /api/games/{id}/actions/reveal`
Resolve the current turn authoritatively.

## Decks and Cards

### `POST /api/decks`
Create deck.

### `POST /api/decks/{id}/cards/upload`
Returns signed upload URL and draft card record id.

### `PATCH /api/cards/{id}`
Update metadata and aliases.

### `DELETE /api/cards/{id}`
Hard delete file assets and card records.

## Reports

### `POST /api/reports`
Submit moderation report.
