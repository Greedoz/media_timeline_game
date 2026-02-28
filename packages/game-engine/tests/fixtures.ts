import type { GameSnapshot, RulesPreset } from "@media-timeline-game/shared-types";
import type { EngineCardLookup, EngineContext } from "../src/engine";

export const defaultRules: RulesPreset = {
  mode: "exact",
  targetCards: 3,
  recognitionMode: "standard",
  maxTokens: 5,
  challengeEnabled: true,
  skipEnabled: true,
  buyCardEnabled: true
};

export function makeSnapshot(overrides?: Partial<GameSnapshot>): GameSnapshot {
  return {
    id: "game-1",
    roomId: "room-1",
    deckId: "deck-1",
    status: "active",
    phase: "await_turn_action",
    mode: "exact",
    targetCards: 3,
    stateVersion: 1,
    players: [
      {
        playerId: "p1",
        displayName: "P1",
        tokens: 2,
        scoreCardsCount: 1,
        timeline: [{ cardId: "seed-1", eventDate: "2020-01-01", eventYear: 2020 }]
      },
      {
        playerId: "p2",
        displayName: "P2",
        tokens: 2,
        scoreCardsCount: 1,
        timeline: [{ cardId: "seed-2", eventDate: "2021-01-01", eventYear: 2021 }]
      }
    ],
    currentTurn: {
      turnNumber: 1,
      activePlayerId: "p1",
      cardId: "c1",
      revealed: false,
      challenges: []
    },
    deckQueue: ["c2", "c3", "c4"],
    discardPile: [],
    ...overrides
  };
}

export function makeContext(cards: EngineCardLookup[], rules = defaultRules): EngineContext {
  const map = new Map(cards.map((card) => [card.id, card]));
  return {
    rules,
    getCardById: (cardId: string) => map.get(cardId)
  };
}

