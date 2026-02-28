# Deck Builder Specification

## Goals
- Fast deck setup for private memory games.
- Reliable date metadata required for gameplay correctness.
- Safe default privacy behavior.

## Core Flow
1. Create deck (`private` default).
2. Upload files (batch supported).
3. System validates file type/size/duration.
4. Card metadata draft created.
5. User edits date/title/aliases/tags.
6. Card marked playable when validation passes.

## Upload Validation
- Allowed image formats: `jpg`, `jpeg`, `png`, `webp`.
- Allowed gif format: `gif`.
- Allowed video formats: `mp4`, `webm`, `mov`.
- Enforced file size and max duration on server side.

## Metadata Rules
- Exact mode eligibility requires valid `event_date`.
- Year mode eligibility requires valid `event_year`.
- Cards with only year cannot join exact mode rounds.
- Accepted answers:
  - title normalized
  - alias normalized
  - case-insensitive and punctuation-insensitive

## Duplicate Handling
- Initial MVP: filename + byte size heuristic.
- Surface likely duplicates in UI; user decides keep/remove.

## Privacy Controls
- `private` default
- invite access via revocable invite code
- no public URL for private media

