export type DateMode = "exact" | "year";
export type RecognitionMode = "off" | "standard";
export type RoomStatus = "lobby" | "active" | "completed";
export type GameStatus = "active" | "completed" | "aborted";
export type MediaType = "image" | "gif" | "video";
export type DatePrecision = "exact" | "year";
export type Visibility = "private" | "invite" | "public";
export type TurnPhase = "await_turn_action" | "await_challenges" | "revealing" | "completed";

export interface RulesPreset {
  mode: DateMode;
  targetCards: number;
  recognitionMode: RecognitionMode;
  maxTokens: number;
  challengeEnabled: boolean;
  skipEnabled: boolean;
  buyCardEnabled: boolean;
}

export interface MediaCard {
  id: string;
  deckId: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  eventDate?: string;
  eventYear?: number;
  datePrecision: DatePrecision;
  acceptedAnswers: string[];
  tags: string[];
  isPlayableExact: boolean;
}

export interface TimelineEntry {
  cardId: string;
  eventDate?: string;
  eventYear?: number;
}

export interface GamePlayerState {
  playerId: string;
  displayName: string;
  timeline: TimelineEntry[];
  tokens: number;
  scoreCardsCount: number;
}

export interface ChallengeClaim {
  challengerId: string;
  claimedPosition: number;
  consumedToken: boolean;
  isCorrect?: boolean;
}

export interface TurnState {
  turnNumber: number;
  activePlayerId: string;
  cardId: string;
  placedPosition?: number;
  recognitionAnswer?: string;
  revealed: boolean;
  revealedDate?: string;
  revealedYear?: number;
  activePlacementCorrect?: boolean;
  challenges: ChallengeClaim[];
}

export interface GameSnapshot {
  id: string;
  roomId: string;
  deckId: string;
  status: GameStatus;
  phase: TurnPhase;
  mode: DateMode;
  targetCards: number;
  stateVersion: number;
  players: GamePlayerState[];
  currentTurn: TurnState;
  deckQueue: string[];
  discardPile: string[];
  winnerPlayerId?: string;
}

interface ActionBase {
  gameId: string;
  playerId: string;
  expectedTurn: number;
  expectedStateVersion: number;
  idempotencyKey: string;
}

export interface PlaceCardAction extends ActionBase {
  type: "place-card";
  position: number;
}

export interface ChallengeAction extends ActionBase {
  type: "challenge";
  claimedPosition: number;
}

export interface SkipAction extends ActionBase {
  type: "skip";
}

export interface BuyCardAction extends ActionBase {
  type: "buy-card";
  position: number;
}

export interface RecognitionAnswerAction extends ActionBase {
  type: "recognition-answer";
  answer: string;
}

export interface RevealAction extends ActionBase {
  type: "reveal";
}

export type GameAction =
  | PlaceCardAction
  | ChallengeAction
  | SkipAction
  | BuyCardAction
  | RecognitionAnswerAction
  | RevealAction;

export interface EventEnvelope<TType extends string, TPayload> {
  sequenceNo: number;
  type: TType;
  gameId: string;
  occurredAt: string;
  payload: TPayload;
}

export type GameEvent =
  | EventEnvelope<"TURN_CARD_PLACED", { playerId: string; position: number; turn: number }>
  | EventEnvelope<"TURN_CHALLENGE_ADDED", { challengerId: string; claimedPosition: number; turn: number }>
  | EventEnvelope<"TURN_REVEALED", { turn: number; activePlacementCorrect: boolean; stolenBy?: string }>
  | EventEnvelope<"TOKENS_UPDATED", { playerId: string; tokens: number }>
  | EventEnvelope<"SCORE_UPDATED", { playerId: string; scoreCardsCount: number }>
  | EventEnvelope<"GAME_COMPLETED", { winnerPlayerId: string; turn: number }>
  | EventEnvelope<"HOST_CHANGED", { roomId: string; hostPlayerId: string }>;

export interface ApiError {
  code: string;
  message: string;
}

