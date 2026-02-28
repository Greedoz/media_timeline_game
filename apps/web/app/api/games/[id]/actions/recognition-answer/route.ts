import { validateActionBodyBase } from "@/lib/action-route";
import { badRequest, fromUnknownError, ok } from "@/lib/http";
import { submitRecognitionAnswer } from "@/lib/store";
import type { RecognitionAnswerAction } from "@media-timeline-game/shared-types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<RecognitionAnswerAction>;
    const invalid = validateActionBodyBase(body);
    if (invalid) return invalid;
    if (!body.answer) {
      return badRequest("INVALID_INPUT", "answer is required.");
    }
    const snapshot = submitRecognitionAnswer(id, {
      type: "recognition-answer",
      gameId: id,
      playerId: body.playerId!,
      answer: body.answer,
      expectedTurn: body.expectedTurn!,
      expectedStateVersion: body.expectedStateVersion!,
      idempotencyKey: body.idempotencyKey!
    });
    return ok({ game: snapshot });
  } catch (error) {
    return fromUnknownError(error);
  }
}

