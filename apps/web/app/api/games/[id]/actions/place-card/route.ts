import { validateActionBodyBase } from "@/lib/action-route";
import { fromUnknownError, ok } from "@/lib/http";
import { placeCard } from "@/lib/store";
import type { PlaceCardAction } from "@media-timeline-game/shared-types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<PlaceCardAction>;
    const invalid = validateActionBodyBase(body);
    if (invalid) return invalid;
    if (typeof body.position !== "number") {
      return Response.json({ code: "INVALID_INPUT", message: "position is required." }, { status: 400 });
    }
    const snapshot = placeCard(id, {
      type: "place-card",
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

