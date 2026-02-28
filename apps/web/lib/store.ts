import {
  applyBuyCard,
  applyChallenge,
  applyPlaceCard,
  applyRecognitionAnswer,
  applyReveal,
  applySkip,
  EngineError,
  type EngineCardLookup
} from "@media-timeline-game/game-engine";
import type {
  BuyCardAction,
  ChallengeAction,
  DateMode,
  GameSnapshot,
  MediaCard,
  PlaceCardAction,
  RecognitionAnswerAction,
  RevealAction,
  RulesPreset,
  SkipAction,
  Visibility
} from "@media-timeline-game/shared-types";

interface DeckRecord {
  id: string;
  ownerId: string;
  name: string;
  visibility: Visibility;
  inviteCode: string;
  isSeededPublic: boolean;
  cards: MediaCard[];
}

interface RoomPlayerRecord {
  playerId: string;
  displayName: string;
  isGuest: boolean;
  connected: boolean;
  ready: boolean;
}

interface RoomRecord {
  id: string;
  joinCode: string;
  hostPlayerId: string;
  status: "lobby" | "active" | "completed";
  deckId: string;
  settings: RulesPreset;
  players: RoomPlayerRecord[];
  gameId?: string;
}

interface GameRecord {
  id: string;
  roomId: string;
  rules: RulesPreset;
  cardsById: Map<string, EngineCardLookup>;
  snapshot: GameSnapshot;
  idempotencyKeys: Set<string>;
}

const store = {
  decks: new Map<string, DeckRecord>(),
  rooms: new Map<string, RoomRecord>(),
  games: new Map<string, GameRecord>(),
  cardsToDeck: new Map<string, string>()
};

function randomId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

function randomJoinCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function ensureTargetCards(value: number): number {
  if (value < 7 || value > 15) {
    throw new EngineError("INVALID_POSITION", "targetCards must be between 7 and 15.");
  }
  return value;
}

function shuffle<T>(values: T[]): T[] {
  const cloned = [...values];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function getRoomByJoinCode(joinCode: string): RoomRecord | undefined {
  return [...store.rooms.values()].find((room) => room.joinCode === joinCode.toUpperCase());
}

function ensureSeedData(): void {
  if (store.decks.size > 0) return;
  const deckId = "deck_seed_public";
  const cards: MediaCard[] = Array.from({ length: 50 }).map((_, idx) => {
    const year = 1990 + idx;
    const date = `${year}-01-01`;
    return {
      id: `seed_card_${idx + 1}`,
      deckId,
      mediaType: "image",
      mediaUrl: `/seed/${idx + 1}.jpg`,
      thumbnailUrl: `/seed/thumb-${idx + 1}.jpg`,
      title: `Seed Event ${idx + 1}`,
      description: "Seeded public card",
      eventDate: date,
      eventYear: year,
      datePrecision: "exact",
      acceptedAnswers: [`Seed Event ${idx + 1}`],
      tags: ["seed"],
      isPlayableExact: true
    };
  });

  store.decks.set(deckId, {
    id: deckId,
    ownerId: "system",
    name: "Historical Seed Deck",
    visibility: "public",
    inviteCode: "PUBLIC",
    isSeededPublic: true,
    cards
  });
  for (const card of cards) {
    store.cardsToDeck.set(card.id, deckId);
  }
}

ensureSeedData();

export function createDeck(ownerId: string, name: string, visibility: Visibility = "private"): DeckRecord {
  const deck: DeckRecord = {
    id: randomId("deck"),
    ownerId,
    name,
    visibility,
    inviteCode: randomJoinCode(8),
    isSeededPublic: false,
    cards: []
  };
  store.decks.set(deck.id, deck);
  return deck;
}

export function createCardDraft(deckId: string, payload: { mediaType: MediaCard["mediaType"]; fileName: string }): MediaCard {
  const deck = store.decks.get(deckId);
  if (!deck) {
    throw new EngineError("DECK_EXHAUSTED", "Deck not found.");
  }
  const card: MediaCard = {
    id: randomId("card"),
    deckId,
    mediaType: payload.mediaType,
    mediaUrl: `private/${deckId}/${payload.fileName}`,
    datePrecision: "year",
    acceptedAnswers: [],
    tags: [],
    isPlayableExact: false
  };
  deck.cards.push(card);
  store.cardsToDeck.set(card.id, deckId);
  return card;
}

export function updateCardMetadata(
  cardId: string,
  patch: Partial<
    Pick<MediaCard, "title" | "description" | "eventDate" | "eventYear" | "acceptedAnswers" | "tags" | "datePrecision">
  >
): MediaCard {
  const deckId = store.cardsToDeck.get(cardId);
  if (!deckId) {
    throw new EngineError("DECK_EXHAUSTED", "Card not found.");
  }
  const deck = store.decks.get(deckId);
  if (!deck) {
    throw new EngineError("DECK_EXHAUSTED", "Deck not found.");
  }
  const card = deck.cards.find((item) => item.id === cardId);
  if (!card) {
    throw new EngineError("DECK_EXHAUSTED", "Card not found.");
  }
  Object.assign(card, patch);
  if (card.eventDate) {
    card.eventYear = new Date(card.eventDate).getUTCFullYear();
    card.isPlayableExact = true;
    card.datePrecision = "exact";
  } else if (typeof card.eventYear === "number") {
    card.datePrecision = "year";
    card.isPlayableExact = false;
  }
  return card;
}

export function deleteCard(cardId: string): void {
  const deckId = store.cardsToDeck.get(cardId);
  if (!deckId) {
    throw new EngineError("DECK_EXHAUSTED", "Card not found.");
  }
  const deck = store.decks.get(deckId);
  if (!deck) {
    throw new EngineError("DECK_EXHAUSTED", "Deck not found.");
  }
  deck.cards = deck.cards.filter((card) => card.id !== cardId);
  store.cardsToDeck.delete(cardId);
}

export function createRoom(input: { hostPlayerId: string; hostDisplayName: string; deckId: string; settings: Partial<RulesPreset> }): RoomRecord {
  const deck = store.decks.get(input.deckId);
  if (!deck) {
    throw new EngineError("DECK_EXHAUSTED", "Deck not found.");
  }
  const rules: RulesPreset = {
    mode: input.settings.mode ?? "exact",
    targetCards: ensureTargetCards(input.settings.targetCards ?? 10),
    recognitionMode: input.settings.recognitionMode ?? "standard",
    maxTokens: 5,
    challengeEnabled: true,
    skipEnabled: true,
    buyCardEnabled: true
  };
  const room: RoomRecord = {
    id: randomId("room"),
    joinCode: randomJoinCode(),
    hostPlayerId: input.hostPlayerId,
    status: "lobby",
    deckId: input.deckId,
    settings: rules,
    players: [
      {
        playerId: input.hostPlayerId,
        displayName: input.hostDisplayName,
        isGuest: false,
        connected: true,
        ready: true
      }
    ]
  };
  store.rooms.set(room.id, room);
  return room;
}

export function joinRoom(joinCode: string, payload: { userId?: string; guestName?: string }): RoomRecord {
  const room = getRoomByJoinCode(joinCode);
  if (!room) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Room not found.");
  }
  const playerId = payload.userId ?? randomId("guest");
  const displayName = payload.guestName?.trim() || payload.userId || `Guest-${playerId.slice(-4)}`;
  const existing = room.players.find((player) => player.playerId === playerId);
  if (!existing) {
    room.players.push({
      playerId,
      displayName,
      isGuest: !payload.userId,
      connected: true,
      ready: true
    });
  }
  return room;
}

function filterCardsForMode(cards: MediaCard[], mode: DateMode): MediaCard[] {
  if (mode === "exact") {
    return cards.filter((card) => Boolean(card.eventDate) && card.isPlayableExact);
  }
  return cards.filter((card) => typeof card.eventYear === "number" || Boolean(card.eventDate));
}

export function startRoomGame(roomId: string, requesterId: string): { room: RoomRecord; game: GameRecord } {
  const room = store.rooms.get(roomId);
  if (!room) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Room not found.");
  }
  if (room.hostPlayerId !== requesterId) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Only host can start.");
  }
  if (room.status !== "lobby") {
    throw new EngineError("INVALID_PHASE", "Room is not in lobby state.");
  }
  if (room.players.length < 2) {
    throw new EngineError("INVALID_PHASE", "Need at least two players to start.");
  }

  const deck = store.decks.get(room.deckId);
  if (!deck) {
    throw new EngineError("DECK_EXHAUSTED", "Deck not found.");
  }
  const eligible = filterCardsForMode(deck.cards, room.settings.mode);
  if (eligible.length < 20) {
    throw new EngineError("DECK_EXHAUSTED", "Need at least 20 eligible cards.");
  }

  const shuffled = shuffle(eligible);
  const cardsById = new Map<string, EngineCardLookup>();
  for (const card of eligible) {
    cardsById.set(card.id, {
      id: card.id,
      title: card.title,
      acceptedAnswers: card.acceptedAnswers,
      eventDate: card.eventDate,
      eventYear: card.eventYear
    });
  }

  const players = room.players.map((player) => {
    const starter = shuffled.pop();
    if (!starter) {
      throw new EngineError("DECK_EXHAUSTED", "Not enough cards for starter setup.");
    }
    return {
      playerId: player.playerId,
      displayName: player.displayName,
      tokens: 2,
      scoreCardsCount: 1,
      timeline: [{ cardId: starter.id, eventDate: starter.eventDate, eventYear: starter.eventYear }]
    };
  });

  const activeCard = shuffled.pop();
  if (!activeCard) {
    throw new EngineError("DECK_EXHAUSTED", "Not enough cards for first turn.");
  }

  const gameId = randomId("game");
  const snapshot: GameSnapshot = {
    id: gameId,
    roomId: room.id,
    deckId: room.deckId,
    status: "active",
    phase: "await_turn_action",
    mode: room.settings.mode,
    targetCards: room.settings.targetCards,
    stateVersion: 1,
    players,
    currentTurn: {
      turnNumber: 1,
      activePlayerId: players[0].playerId,
      cardId: activeCard.id,
      revealed: false,
      challenges: []
    },
    deckQueue: shuffled.map((card) => card.id),
    discardPile: []
  };

  const game: GameRecord = {
    id: gameId,
    roomId: room.id,
    rules: room.settings,
    cardsById,
    snapshot,
    idempotencyKeys: new Set<string>()
  };
  store.games.set(game.id, game);
  room.gameId = game.id;
  room.status = "active";

  return { room, game };
}

function withGame(gameId: string): GameRecord {
  const game = store.games.get(gameId);
  if (!game) {
    throw new EngineError("UNAUTHORIZED_PLAYER", "Game not found.");
  }
  return game;
}

function applyMutatingAction<TAction extends { idempotencyKey: string }>(
  gameId: string,
  action: TAction,
  reducer: (game: GameRecord) => GameSnapshot
): GameSnapshot {
  const game = withGame(gameId);
  if (game.idempotencyKeys.has(action.idempotencyKey)) {
    return game.snapshot;
  }
  const next = reducer(game);
  game.snapshot = next;
  game.idempotencyKeys.add(action.idempotencyKey);
  return next;
}

export function placeCard(gameId: string, action: PlaceCardAction): GameSnapshot {
  return applyMutatingAction(gameId, action, (game) => applyPlaceCard(game.snapshot, action));
}

export function challenge(gameId: string, action: ChallengeAction): GameSnapshot {
  return applyMutatingAction(gameId, action, (game) => applyChallenge(game.snapshot, action));
}

export function skipCard(gameId: string, action: SkipAction): GameSnapshot {
  return applyMutatingAction(gameId, action, (game) => applySkip(game.snapshot, action));
}

export function buyCard(gameId: string, action: BuyCardAction): GameSnapshot {
  return applyMutatingAction(gameId, action, (game) =>
    applyBuyCard(game.snapshot, action, {
      rules: game.rules,
      getCardById: (cardId) => game.cardsById.get(cardId)
    })
  );
}

export function submitRecognitionAnswer(gameId: string, action: RecognitionAnswerAction): GameSnapshot {
  return applyMutatingAction(gameId, action, (game) => applyRecognitionAnswer(game.snapshot, action));
}

export function revealTurn(gameId: string, action: RevealAction): GameSnapshot {
  return applyMutatingAction(gameId, action, (game) =>
    applyReveal(game.snapshot, action, {
      rules: game.rules,
      getCardById: (cardId) => game.cardsById.get(cardId)
    })
  );
}

export function listDecks(): DeckRecord[] {
  return [...store.decks.values()];
}

export function listRooms(): RoomRecord[] {
  return [...store.rooms.values()];
}

export function getGameSnapshot(gameId: string): GameSnapshot {
  const game = withGame(gameId);
  return game.snapshot;
}
