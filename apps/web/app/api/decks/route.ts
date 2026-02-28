import { createDeck, listDecks } from "@/lib/store";
import { badRequest, fromUnknownError, ok, requireAuthUserId } from "@/lib/http";
import type { Visibility } from "@media-timeline-game/shared-types";

export async function GET() {
  return ok({ decks: listDecks() });
}

export async function POST(request: Request) {
  try {
    const userId = requireAuthUserId(request);
    if (!userId) {
      return badRequest("UNAUTHORIZED", "Authenticated user required.", 401);
    }
    const body = (await request.json()) as { name?: string; visibility?: Visibility };
    if (!body.name || body.name.trim().length < 2) {
      return badRequest("INVALID_INPUT", "Deck name must be at least 2 characters.");
    }
    const visibility = body.visibility ?? "private";
    const deck = createDeck(userId, body.name.trim(), visibility);
    return ok({ deck }, 201);
  } catch (error) {
    return fromUnknownError(error);
  }
}

