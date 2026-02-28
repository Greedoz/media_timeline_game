import { validateActionBodyBase } from "@/lib/action-route";
import { fromUnknownError, ok } from "@/lib/http";
import { revealTurn } from "@/lib/store";
import type { RevealAction } from "@media-timeline-game/shared-types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<RevealAction>;
    const invalid = validateActionBodyBase(body);
    if (invalid) return invalid;
    const snapshot = revealTurn(id, {
      type: "reveal",
      gameId: id,
      playerId: body.playerId!,
      expectedTurn: body.expectedTurn!,
      expectedStateVersion: body.expectedStateVersion!,
      idempotencyKey: body.idempotencyKey!
    });
    return ok({ game: snapshot });
  } catch (error) {
    return fromUnknownError(error);
  }
}

