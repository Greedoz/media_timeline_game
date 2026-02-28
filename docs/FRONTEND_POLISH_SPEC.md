# Frontend Polish Spec (MVP Upgrade)

## Goal
Upgrade UI quality to a launch-worthy party-game feel while preserving current feature scope.

## Visual Direction
- Tone: energetic, social, playful, modern.
- Contrast: high readability for shared TV/laptop viewing.
- Brand traits: bold hierarchy, clear game-state emphasis, intentional motion.

## Design Tokens
- Define global CSS variables for:
  - semantic colors (`--bg`, `--surface`, `--accent`, `--danger`, `--success`, `--warning`)
  - text scales (`--text-xs` through `--text-4xl`)
  - spacing scale (`--space-1` through `--space-10`)
  - radius and shadows
- Remove hardcoded one-off colors from page-level styles.

## Page-Level UX Targets
1. Landing (`/`)
- Strong hero with clear CTA hierarchy:
  - Create deck
  - Start room
  - Join room
- Short rules preview and MVP highlights.

2. Dashboard (`/dashboard`)
- Deck and room quick actions as prominent cards.
- Recent activity placeholders for future data integration.

3. Deck Builder (`/deck-builder`)
- Multi-step visual structure:
  - upload
  - metadata
  - validation
  - publish/share
- Inline validation and status chips per card.

4. Room Lobby (`/room`)
- Prominent room code panel.
- Player list with ready indicators.
- Host settings grouped and clearly scannable.

5. Gameplay (`/game/[id]`)
- High-priority elements always visible:
  - active player
  - current card
  - token counts
  - challenge window state
  - score race to target
- Clear reveal feedback for correct/incorrect/steal outcomes.

## Motion System
- Page entry fade/slide under 250ms.
- Card reveal animation with outcome color cue.
- Turn indicator pulse with reduced-motion fallback.

## Accessibility
- Minimum contrast target WCAG AA.
- Full keyboard navigation on interactive controls.
- Visible focus rings on all actionable elements.
- Respect `prefers-reduced-motion`.

## Performance
- Avoid large animation libraries for MVP.
- Keep first-load JS near existing baseline unless justified.
- Use CSS transitions/animations where possible.

## Acceptance Criteria
- Consistent visual language across all core routes.
- Gameplay HUD readable at 2-3 meters distance on shared screen.
- No inaccessible focus traps or hidden controls.
- Mobile layout remains usable down to 360px width.

