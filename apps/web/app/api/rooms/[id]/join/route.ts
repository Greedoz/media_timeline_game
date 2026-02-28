import { fromUnknownError, ok } from "@/lib/http";
import { joinRoom } from "@/lib/store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") ?? undefined;
    const body = (await request.json().catch(() => ({}))) as { guestName?: string };
    const room = joinRoom(id, { userId, guestName: body.guestName });
    return ok({ room });
  } catch (error) {
    return fromUnknownError(error);
  }
}

