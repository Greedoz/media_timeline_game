import type {
  BuyCardAction,
  ChallengeAction,
  GameSnapshot,
  PlaceCardAction,
  RecognitionAnswerAction,
  RevealAction,
  RulesPreset,
  SkipAction,
  TimelineEntry
} from "@media-timeline-game/shared-types";
import { EngineError } from "./errors";
import { recognitionMatches } from "./normalize";
import { firstValidPosition, isPlacementValid } from "./timeline";

type PlayerMap = Map<string, number>;

function cloneSnapshot(snapshot: GameSnapshot): GameSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as GameSnapshot;
}

function indexPlayers(snapshot: GameSnapshot): PlayerMap {
  const map = new Map<string, number>();
  snapshot.players.forEach((player, index) => {
    map.set(player.playerId, index);
  });
  return map;
}

function currentTurnGuard(snapshot: GameSnapshot, expectedTurn: number, expectedVersion: number): void {
  if (snapshot.currentTurn.turnNumber !== expectedTurn) {
    throw new EngineError("TURN_MISMATCH", "Turn mismatch.");
  }
  if (snapshot.stateVersion !== expectedVersion) {
    throw new EngineError("STATE_VERSION_MISMATCH", "State version mismatch.");
  }
}

function requirePhase(snapshot: GameSnapshot, phase: GameSnapshot["phase"]): void {
  if (snapshot.phase !== phase) {
    throw new EngineError("INVALID_PHASE", `Action not allowed during phase ${snapshot.phase}.`);
  }
}

function requirePlayer(snapshot: GameSnapshot, playerId: string): number {
  const playersById = indexPlayers(snapshot);
  const index = playersById.get(playerId);
  if (index === undefined) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Player is not in this game.");
  }
  return index;
}

function nextCardFromDeck(snapshot: GameSnapshot): string {
  const next = snapshot.deckQueue.shift();
  if (!next) {
    throw new EngineError("DECK_EXHAUSTED", "Deck has no remaining cards.");
  }
  return next;
}

function activePlayerIndex(snapshot: GameSnapshot): number {
  const index = snapshot.players.findIndex((player) => player.playerId === snapshot.currentTurn.activePlayerId);
  if (index < 0) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Active player not found.");
  }
  return index;
}

function addEntryToTimeline(playerTimeline: TimelineEntry[], entry: TimelineEntry, position: number): void {
  playerTimeline.splice(position, 0, entry);
}

function capTokens(current: number, maxTokens: number): number {
  return Math.min(maxTokens, current);
}

function incrementAndCheckWin(snapshot: GameSnapshot, playerIndex: number): void {
  snapshot.players[playerIndex].scoreCardsCount += 1;
  if (snapshot.players[playerIndex].scoreCardsCount >= snapshot.targetCards) {
    snapshot.phase = "completed";
    snapshot.status = "completed";
    snapshot.winnerPlayerId = snapshot.players[playerIndex].playerId;
  }
}

function advanceTurn(snapshot: GameSnapshot): void {
  if (snapshot.phase === "completed") return;
  const oldIndex = activePlayerIndex(snapshot);
  const nextIndex = (oldIndex + 1) % snapshot.players.length;
  snapshot.currentTurn = {
    turnNumber: snapshot.currentTurn.turnNumber + 1,
    activePlayerId: snapshot.players[nextIndex].playerId,
    cardId: nextCardFromDeck(snapshot),
    revealed: false,
    challenges: []
  };
  snapshot.phase = "await_turn_action";
}

function cardToTimelineEntry(card: { id: string; eventDate?: string; eventYear?: number }): TimelineEntry {
  return {
    cardId: card.id,
    eventDate: card.eventDate,
    eventYear: card.eventYear
  };
}

export interface EngineCardLookup {
  id: string;
  title?: string;
  acceptedAnswers: string[];
  eventDate?: string;
  eventYear?: number;
}

export interface EngineContext {
  rules: RulesPreset;
  getCardById: (cardId: string) => EngineCardLookup | undefined;
}

export function applyPlaceCard(snapshot: GameSnapshot, action: PlaceCardAction): GameSnapshot {
  const next = cloneSnapshot(snapshot);
  currentTurnGuard(next, action.expectedTurn, action.expectedStateVersion);
  requirePhase(next, "await_turn_action");
  if (next.currentTurn.activePlayerId !== action.playerId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Only active player can place.");
  }
  const playerIndex = requirePlayer(next, action.playerId);
  const timeline = next.players[playerIndex].timeline;
  if (action.position < 0 || action.position > timeline.length) {
    throw new EngineError("INVALID_POSITION", "Placement index out of range.");
  }
  next.currentTurn.placedPosition = action.position;
  next.phase = "await_challenges";
  next.stateVersion += 1;
  return next;
}

export function applyRecognitionAnswer(snapshot: GameSnapshot, action: RecognitionAnswerAction): GameSnapshot {
  const next = cloneSnapshot(snapshot);
  currentTurnGuard(next, action.expectedTurn, action.expectedStateVersion);
  requirePhase(next, "await_challenges");
  if (next.currentTurn.activePlayerId !== action.playerId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Only active player can answer recognition.");
  }
  next.currentTurn.recognitionAnswer = action.answer;
  next.stateVersion += 1;
  return next;
}

export function applyChallenge(snapshot: GameSnapshot, action: ChallengeAction): GameSnapshot {
  const next = cloneSnapshot(snapshot);
  currentTurnGuard(next, action.expectedTurn, action.expectedStateVersion);
  requirePhase(next, "await_challenges");
  if (next.currentTurn.activePlayerId === action.playerId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Active player cannot challenge own card.");
  }
  const challengerIndex = requirePlayer(next, action.playerId);
  const challenger = next.players[challengerIndex];
  if (challenger.tokens < 1) {
    throw new EngineError("INSUFFICIENT_TOKENS", "Need at least 1 token to challenge.");
  }
  const claimedTaken = next.currentTurn.challenges.some((claim) => claim.claimedPosition === action.claimedPosition);
  if (claimedTaken) {
    throw new EngineError("DUPLICATE_CHALLENGE_POSITION", "Position already claimed by another challenger.");
  }
  challenger.tokens -= 1;
  next.currentTurn.challenges.push({
    challengerId: action.playerId,
    claimedPosition: action.claimedPosition,
    consumedToken: true
  });
  next.stateVersion += 1;
  return next;
}

export function applySkip(snapshot: GameSnapshot, action: SkipAction): GameSnapshot {
  const next = cloneSnapshot(snapshot);
  currentTurnGuard(next, action.expectedTurn, action.expectedStateVersion);
  requirePhase(next, "await_turn_action");
  if (next.currentTurn.activePlayerId !== action.playerId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Only active player can skip.");
  }
  const playerIndex = requirePlayer(next, action.playerId);
  const player = next.players[playerIndex];
  if (player.tokens < 1) {
    throw new EngineError("INSUFFICIENT_TOKENS", "Need at least 1 token to skip.");
  }
  player.tokens -= 1;
  next.discardPile.push(next.currentTurn.cardId);
  next.currentTurn.cardId = nextCardFromDeck(next);
  next.stateVersion += 1;
  return next;
}

export function applyBuyCard(snapshot: GameSnapshot, action: BuyCardAction, ctx: EngineContext): GameSnapshot {
  const next = cloneSnapshot(snapshot);
  currentTurnGuard(next, action.expectedTurn, action.expectedStateVersion);
  requirePhase(next, "await_turn_action");
  if (next.currentTurn.activePlayerId !== action.playerId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Only active player can buy card.");
  }
  const playerIndex = requirePlayer(next, action.playerId);
  const player = next.players[playerIndex];
  if (player.tokens < 3) {
    throw new EngineError("INSUFFICIENT_TOKENS", "Need at least 3 tokens to buy.");
  }
  const boughtCardId = nextCardFromDeck(next);
  const boughtCard = ctx.getCardById(boughtCardId);
  if (!boughtCard) {
    throw new EngineError("DECK_EXHAUSTED", "Card not found in lookup.");
  }
  const entry = cardToTimelineEntry(boughtCard);
  if (!isPlacementValid(player.timeline, entry, action.position, next.mode)) {
    throw new EngineError("INVALID_POSITION", "Bought card placement is not valid.");
  }
  player.tokens -= 3;
  addEntryToTimeline(player.timeline, entry, action.position);
  incrementAndCheckWin(next, playerIndex);
  next.stateVersion += 1;
  advanceTurn(next);
  return next;
}

function resolveRecognitionBonus(snapshot: GameSnapshot, activePlayerIndexValue: number, ctx: EngineContext): void {
  if (ctx.rules.recognitionMode === "off") return;
  const answer = snapshot.currentTurn.recognitionAnswer;
  if (!answer) return;
  const card = ctx.getCardById(snapshot.currentTurn.cardId);
  if (!card) return;
  const matched = recognitionMatches(answer, card.title, card.acceptedAnswers);
  if (!matched) return;
  const player = snapshot.players[activePlayerIndexValue];
  player.tokens = capTokens(player.tokens + 1, ctx.rules.maxTokens);
}

export function applyReveal(snapshot: GameSnapshot, action: RevealAction, ctx: EngineContext): GameSnapshot {
  const next = cloneSnapshot(snapshot);
  currentTurnGuard(next, action.expectedTurn, action.expectedStateVersion);
  requirePhase(next, "await_challenges");
  if (next.currentTurn.activePlayerId !== action.playerId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Only active player can reveal.");
  }

  const activeIndex = requirePlayer(next, action.playerId);
  const active = next.players[activeIndex];
  const card = ctx.getCardById(next.currentTurn.cardId);
  if (!card) {
    throw new EngineError("DECK_EXHAUSTED", "Current card is missing.");
  }
  const cardEntry = cardToTimelineEntry(card);
  const placedPosition = next.currentTurn.placedPosition;
  if (placedPosition === undefined) {
    throw new EngineError("INVALID_POSITION", "Card has not been placed.");
  }

  resolveRecognitionBonus(next, activeIndex, ctx);

  next.phase = "revealing";
  next.currentTurn.revealed = true;
  next.currentTurn.revealedDate = card.eventDate;
  next.currentTurn.revealedYear = card.eventYear;

  const activePlacementCorrect = isPlacementValid(active.timeline, cardEntry, placedPosition, next.mode);
  next.currentTurn.activePlacementCorrect = activePlacementCorrect;

  if (activePlacementCorrect) {
    addEntryToTimeline(active.timeline, cardEntry, placedPosition);
    incrementAndCheckWin(next, activeIndex);
  } else {
    let stolenBy: string | undefined;
    for (const challenge of next.currentTurn.challenges) {
      const isCorrectClaim = isPlacementValid(active.timeline, cardEntry, challenge.claimedPosition, next.mode);
      challenge.isCorrect = isCorrectClaim;
      if (isCorrectClaim && !stolenBy) {
        stolenBy = challenge.challengerId;
      }
    }

    if (stolenBy) {
      const stealerIndex = requirePlayer(next, stolenBy);
      const stealer = next.players[stealerIndex];
      const insertAt = firstValidPosition(stealer.timeline, cardEntry, next.mode);
      if (insertAt !== undefined) {
        addEntryToTimeline(stealer.timeline, cardEntry, insertAt);
        incrementAndCheckWin(next, stealerIndex);
      } else {
        next.discardPile.push(card.id);
      }
    } else {
      next.discardPile.push(card.id);
    }
  }

  next.stateVersion += 1;
  advanceTurn(next);
  return next;
}

