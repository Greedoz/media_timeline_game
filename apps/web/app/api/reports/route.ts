import { badRequest, ok } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    targetType?: string;
    targetId?: string;
    reason?: string;
  };
  if (!body.targetType || !body.targetId || !body.reason) {
    return badRequest("INVALID_INPUT", "targetType, targetId, and reason are required.");
  }
  return ok({ reported: true }, 201);
}

