import { badRequest, fromUnknownError, ok, requireAuthUserId } from "@/lib/http";
import { deleteCard, updateCardMetadata } from "@/lib/store";
import type { MediaCard } from "@media-timeline-game/shared-types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = requireAuthUserId(request);
    if (!userId) {
      return badRequest("UNAUTHORIZED", "Authenticated user required.", 401);
    }
    const { id } = await params;
    const body = (await request.json()) as Partial<
      Pick<MediaCard, "title" | "description" | "eventDate" | "eventYear" | "acceptedAnswers" | "tags" | "datePrecision">
    >;
    const card = updateCardMetadata(id, body);
    return ok({ card });
  } catch (error) {
    return fromUnknownError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const userId = requireAuthUserId(request);
    if (!userId) {
      return badRequest("UNAUTHORIZED", "Authenticated user required.", 401);
    }
    const { id } = await params;
    deleteCard(id);
    return ok({ deleted: true });
  } catch (error) {
    return fromUnknownError(error);
  }
}

