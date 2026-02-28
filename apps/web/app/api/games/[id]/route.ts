import { fromUnknownError, ok } from "@/lib/http";
import { getGameSnapshot } from "@/lib/store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    return ok({ game: getGameSnapshot(id) });
  } catch (error) {
    return fromUnknownError(error);
  }
}

