export class EngineError extends Error {
  constructor(
    public readonly code:
      | "TURN_MISMATCH"
      | "STATE_VERSION_MISMATCH"
      | "UNAUTHORIZED_PLAYER"
      | "INVALID_PHASE"
      | "INVALID_POSITION"
      | "INSUFFICIENT_TOKENS"
      | "CHALLENGE_WINDOW_CLOSED"
      | "DUPLICATE_CHALLENGE_POSITION"
      | "DECK_EXHAUSTED",
    message: string
  ) {
    super(message);
    this.name = "EngineError";
  }
}

