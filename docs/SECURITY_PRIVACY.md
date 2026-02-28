# Security and Privacy

## Security Posture
- Client is untrusted.
- API routes enforce authorization and input validation.
- Game actions are resolved server-side only.

## AuthZ Matrix
- Deck owner: full control on deck/cards/share.
- Deck editor: create/edit cards.
- Deck viewer: read-only.
- Guest player: room/game participation only; no deck management.
- Host: room controls and game start.

## Privacy Defaults
- New deck visibility = `private`.
- Invite-only sharing requires explicit owner action.
- Signed URLs for media access; short expiry.

## Data Deletion
- User card delete triggers immediate hard delete:
  - original asset
  - derived assets
  - metadata rows

## Moderation Baseline
- MIME and extension validation.
- File size and duration limits.
- Report abuse endpoint and admin review queue.

## Threats Addressed
- Unauthorized deck access.
- Client tampering with game outcomes.
- Replay of action requests.
- Exposure of private media URLs.

