import { validateActionBodyBase } from "@/lib/action-route";
import { badRequest, fromUnknownError, ok } from "@/lib/http";
import { buyCard } from "@/lib/store";
import type { BuyCardAction } from "@media-timeline-game/shared-types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<BuyCardAction>;
    const invalid = validateActionBodyBase(body);
    if (invalid) return invalid;
    if (typeof body.position !== "number") {
      return badRequest("INVALID_INPUT", "position is required.");
    }
    const snapshot = buyCard(id, {
      type: "buy-card",
      gameId: id,
      playerId: body.playerId!,
      position: body.position,
      expectedTurn: body.expectedTurn!,
      expectedStateVersion: body.expectedStateVersion!,
      idempotencyKey: body.idempotencyKey!
    });
    return ok({ game: snapshot });
  } catch (error) {
    return fromUnknownError(error);
  }
}

