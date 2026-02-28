import { badRequest, fromUnknownError, ok, requireAuthUserId } from "@/lib/http";
import { createCardDraft } from "@/lib/store";
import type { MediaType } from "@media-timeline-game/shared-types";

const allowedTypes: MediaType[] = ["image", "gif", "video"];

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
    const body = (await request.json()) as { mediaType?: MediaType; fileName?: string };
    if (!body.mediaType || !allowedTypes.includes(body.mediaType)) {
      return badRequest("INVALID_INPUT", "mediaType must be image, gif, or video.");
    }
    if (!body.fileName) {
      return badRequest("INVALID_INPUT", "fileName is required.");
    }

    const card = createCardDraft(id, { mediaType: body.mediaType, fileName: body.fileName });
    const uploadUrl = `/api/uploads/sign-placeholder/${card.id}`;
    return ok({ card, uploadUrl }, 201);
  } catch (error) {
    return fromUnknownError(error);
  }
}

