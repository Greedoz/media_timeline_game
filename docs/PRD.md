# Product Requirements Document (MVP)

## Product
Media Timeline Party Game

## Problem
Players want a social party game that uses their own shared memories instead of generic trivia content.

## Target Users
- Friend groups
- Families and couples
- Team event/coworker groups
- Hosts who run local shared-screen party games

## Core Value
Turn personal media memories into a competitive timeline-placement game.

## Jobs To Be Done
- As a host, I can start a room quickly and invite players with low friction.
- As a deck owner, I can upload and organize private media with dates and labels.
- As a player, I can place media chronologically, challenge others, and win by timeline accuracy.

## MVP In Scope
- Authenticated host/deck-owner accounts
- Guest room joining
- Private deck creation and media card editing
- Exact date and year-only game modes
- Token mechanics: skip, challenge/steal, buy-card
- Recognition bonus with alias matching and token cap
- Room/lobby/game/post-game flow
- Seeded admin public decks

## Out Of Scope
- Team mode
- Public creator marketplace
- Native mobile apps
- Async gameplay
- AI moderation/captioning

## Success Metrics
- Time to first game: < 5 minutes for a new host
- Match completion rate: > 80%
- Deck completion rate (>= 20 playable cards): > 60%
- Privacy incident count: 0 critical exposures

## Non-Functional Requirements
- Responsive desktop/tablet/mobile web UX
- Deterministic server-authoritative game outcomes
- Realtime room state sync
- Secure media access with signed URLs
- Upload validation by type/size/duration

## Constraints
- Shared-screen first UX
- Private-by-default decks
- Immediate hard delete of removed media

