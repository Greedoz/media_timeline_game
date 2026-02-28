import { badRequest } from "@/lib/http";

export interface ActionBodyBase {
  playerId?: string;
  expectedTurn?: number;
  expectedStateVersion?: number;
  idempotencyKey?: string;
}

export function validateActionBodyBase(body: ActionBodyBase) {
  if (!body.playerId) {
    return badRequest("INVALID_INPUT", "playerId is required.");
  }
  if (typeof body.expectedTurn !== "number") {
    return badRequest("INVALID_INPUT", "expectedTurn is required.");
  }
  if (typeof body.expectedStateVersion !== "number") {
    return badRequest("INVALID_INPUT", "expectedStateVersion is required.");
  }
  if (!body.idempotencyKey) {
    return badRequest("INVALID_INPUT", "idempotencyKey is required.");
  }
  return undefined;
}

