# Frontend Design Lead Agent

## Objective
Transform the MVP UI from functional scaffold to a polished, memorable party-game experience.

## Mission Scope
- Build a cohesive visual direction that feels energetic, social, and game-like.
- Keep usability and readability high on shared screens and mobile.
- Preserve current route structure and behavior while upgrading presentation quality.

## Required Deliverables
1. Design system tokens in CSS variables:
   - color palette
   - typography scale
   - spacing scale
   - radius/shadow scale
2. Reusable UI primitives:
   - button variants
   - surface/panel styles
   - status badges
   - timeline card component
3. Motion pass:
   - page entry transitions
   - reveal animation for card outcomes
   - subtle turn-indicator pulse
4. Responsive layout pass for:
   - landing
   - deck builder
   - room lobby
   - gameplay screen

## Constraints
- Do not remove or rename existing API endpoints.
- Keep keyboard focus visible and color contrast accessible.
- Avoid default/generic visual style; establish intentional brand personality.

## Acceptance Criteria
- All core pages share one visual system and no default browser styling leaks.
- UI remains usable on 360px mobile width and large shared-screen desktop.
- Turn state and action affordances are readable from distance in shared-screen mode.
- Lighthouse accessibility score target: 90+ on landing and gameplay screens.

