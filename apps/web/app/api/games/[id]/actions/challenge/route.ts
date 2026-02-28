import { validateActionBodyBase } from "@/lib/action-route";
import { badRequest, fromUnknownError, ok } from "@/lib/http";
import { challenge } from "@/lib/store";
import type { ChallengeAction } from "@media-timeline-game/shared-types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<ChallengeAction>;
    const invalid = validateActionBodyBase(body);
    if (invalid) return invalid;
    if (typeof body.claimedPosition !== "number") {
      return badRequest("INVALID_INPUT", "claimedPosition is required.");
    }
    const snapshot = challenge(id, {
      type: "challenge",
      gameId: id,
      playerId: body.playerId!,
      claimedPosition: body.claimedPosition,
      expectedTurn: body.expectedTurn!,
      expectedStateVersion: body.expectedStateVersion!,
      idempotencyKey: body.idempotencyKey!
    });
    return ok({ game: snapshot });
  } catch (error) {
    return fromUnknownError(error);
  }
}

