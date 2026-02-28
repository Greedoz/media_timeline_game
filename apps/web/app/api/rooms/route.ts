import { badRequest, fromUnknownError, ok, requireAuthUserId } from "@/lib/http";
import { createRoom, listRooms } from "@/lib/store";
import type { DateMode, RecognitionMode } from "@media-timeline-game/shared-types";

export async function GET() {
  return ok({ rooms: listRooms() });
}

export async function POST(request: Request) {
  try {
    const userId = requireAuthUserId(request);
    if (!userId) {
      return badRequest("UNAUTHORIZED", "Authenticated user required.", 401);
    }
    const body = (await request.json()) as {
      hostDisplayName?: string;
      deckId?: string;
      settings?: { mode?: DateMode; targetCards?: number; recognitionMode?: RecognitionMode };
    };
    if (!body.deckId) {
      return badRequest("INVALID_INPUT", "deckId is required.");
    }
    const room = createRoom({
      hostPlayerId: userId,
      hostDisplayName: body.hostDisplayName ?? "Host",
      deckId: body.deckId,
      settings: body.settings ?? {}
    });
    return ok({ room }, 201);
  } catch (error) {
    return fromUnknownError(error);
  }
}

