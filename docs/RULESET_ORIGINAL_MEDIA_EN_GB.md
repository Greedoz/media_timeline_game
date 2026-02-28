# Original Media Mode (en-GB Inspired) Ruleset

## Baseline
This ruleset adapts the current "Original" Hitster-style flow to media cards.

## Setup
- Players: 2-8 individuals (MVP no teams).
- Each player starts with:
  - 1 revealed starter card on their timeline.
  - 2 tokens.
- Host selects:
  - Date mode: `exact` or `year`.
  - Target cards to win: 7-15, default 10.
  - Recognition mode: `off` or `standard`.

## Turn Flow
1. Active player is dealt one hidden-date media card.
2. Active player places it before/between/after cards in their own timeline.
3. Optional recognition answer can be submitted before reveal.
4. Other players may challenge before reveal by spending 1 token.
5. Host/app triggers reveal.
6. App validates placement and resolves outcomes.
7. Next player begins.

## Resolution
- Correct placement:
  - Active player keeps the card.
- Incorrect placement:
  - Card discarded, unless a challenger successfully steals it.
- Recognition bonus:
  - If recognition answer matches title or alias, +1 token even if placement is wrong.
  - Token cap is 5.

## Token Uses
- Skip: spend 1 token to discard current card and draw a new one.
- Challenge/Steal: spend 1 token on opponent turn to claim a position.
- Buy-card: spend 3 tokens to draw top card and place directly on own timeline without guessing.

## Challenge Rules
- Challenge window closes on first reveal request.
- First valid challenge claim to a timeline position locks that position.
- Additional challengers must claim different positions.
- If challenger claim is correct:
  - Challenger steals the card and adds it to their timeline.
- If challenger claim is wrong:
  - Token is consumed, no card gained.

## Equal-Date Rules
- Exact mode: cards with identical exact date can appear in either order.
- Year mode: cards with identical year can appear in either order.

## Win Condition
- First player to reach target number of correctly placed cards wins immediately.

## Deck Eligibility
- Exact mode only includes cards with valid exact date.
- Year mode can include cards that have only known year.

