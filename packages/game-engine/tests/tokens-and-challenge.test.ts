import { describe, expect, it } from "vitest";
import { applyChallenge, applyPlaceCard, applyReveal, applySkip } from "../src/engine";
import { EngineError } from "../src/errors";
import { makeContext, makeSnapshot } from "./fixtures";

describe("token accounting and challenge behavior", () => {
  it("consumes token on skip", () => {
    const snapshot = makeSnapshot();
    const updated = applySkip(snapshot, {
      type: "skip",
      gameId: snapshot.id,
      playerId: "p1",
      expectedTurn: 1,
      expectedStateVersion: 1,
      idempotencyKey: "k1"
    });
    expect(updated.players[0].tokens).toBe(1);
    expect(updated.currentTurn.cardId).toBe("c2");
  });

  it("locks challenge position by rejecting duplicate claim", () => {
    const snapshot = makeSnapshot();
    const placed = applyPlaceCard(snapshot, {
      type: "place-card",
      gameId: snapshot.id,
      playerId: "p1",
      position: 0,
      expectedTurn: 1,
      expectedStateVersion: 1,
      idempotencyKey: "k2"
    });
    const firstChallenge = applyChallenge(placed, {
      type: "challenge",
      gameId: snapshot.id,
      playerId: "p2",
      claimedPosition: 0,
      expectedTurn: 1,
      expectedStateVersion: 2,
      idempotencyKey: "k3"
    });

    expect(() =>
      applyChallenge(firstChallenge, {
        type: "challenge",
        gameId: snapshot.id,
        playerId: "p2",
        claimedPosition: 0,
        expectedTurn: 1,
        expectedStateVersion: 3,
        idempotencyKey: "k4"
      })
    ).toThrowError(EngineError);
  });

  it("awards recognition token even when active placement is wrong", () => {
    const snapshot = makeSnapshot({
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
        placedPosition: 0,
        recognitionAnswer: "tomorrowland",
        revealed: false,
        challenges: []
      },
      phase: "await_challenges",
      stateVersion: 3
    });

    const ctx = makeContext([
      { id: "c1", title: "Tomorrowland", acceptedAnswers: ["TML"], eventDate: "2022-01-01", eventYear: 2022 },
      { id: "c2", title: "x", acceptedAnswers: [], eventDate: "2020-02-01", eventYear: 2020 },
      { id: "c3", title: "x", acceptedAnswers: [], eventDate: "2020-03-01", eventYear: 2020 },
      { id: "c4", title: "x", acceptedAnswers: [], eventDate: "2020-04-01", eventYear: 2020 }
    ]);

    const revealed = applyReveal(
      snapshot,
      {
        type: "reveal",
        gameId: snapshot.id,
        playerId: "p1",
        expectedTurn: 1,
        expectedStateVersion: 3,
        idempotencyKey: "k5"
      },
      ctx
    );

    expect(revealed.players[0].tokens).toBe(3);
    expect(revealed.currentTurn.turnNumber).toBe(2);
  });
});

