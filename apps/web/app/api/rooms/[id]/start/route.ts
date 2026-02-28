import { badRequest, fromUnknownError, ok, requireAuthUserId } from "@/lib/http";
import { startRoomGame } from "@/lib/store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const userId = requireAuthUserId(request);
    if (!userId) {
      return badRequest("UNAUTHORIZED", "Authenticated user required.", 401);
    }
    const { id } = await params;
    const result = startRoomGame(id, userId);
    return ok({ room: result.room, game: result.game.snapshot });
  } catch (error) {
    return fromUnknownError(error);
  }
}

