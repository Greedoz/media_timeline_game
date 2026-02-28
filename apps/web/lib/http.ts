import { NextResponse } from "next/server";
import { EngineError } from "@media-timeline-game/game-engine";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function badRequest(code: string, message: string, status = 400): NextResponse {
  return NextResponse.json({ code, message }, { status });
}

export function fromUnknownError(error: unknown): NextResponse {
  if (error instanceof EngineError) {
    return badRequest(error.code, error.message, 409);
  }
  if (error instanceof Error) {
    return badRequest("INTERNAL_ERROR", error.message, 500);
  }
  return badRequest("INTERNAL_ERROR", "Unknown server error.", 500);
}

export function requireAuthUserId(request: Request): string | undefined {
  const userId = request.headers.get("x-user-id");
  return userId && userId.trim().length > 0 ? userId.trim() : undefined;
}

