import type { GameEvent } from "@media-timeline-game/shared-types";

export interface RealtimePublisher {
  publish(roomId: string, event: GameEvent): Promise<void>;
}

class NoopRealtimePublisher implements RealtimePublisher {
  async publish(_roomId: string, _event: GameEvent): Promise<void> {
    // Placeholder for Supabase Realtime publish implementation.
  }
}

export const realtimePublisher: RealtimePublisher = new NoopRealtimePublisher();

