import type { DateMode, TimelineEntry } from "@media-timeline-game/shared-types";

function toEpochDay(value: string | undefined): number {
  if (!value) return Number.NaN;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.NaN : Math.floor(timestamp / 86400000);
}

function valueForMode(entry: TimelineEntry, mode: DateMode): number {
  if (mode === "exact") {
    return toEpochDay(entry.eventDate);
  }
  if (typeof entry.eventYear === "number") {
    return entry.eventYear;
  }
  if (entry.eventDate) {
    const year = new Date(entry.eventDate).getUTCFullYear();
    return Number.isNaN(year) ? Number.NaN : year;
  }
  return Number.NaN;
}

export function compareEntries(left: TimelineEntry, right: TimelineEntry, mode: DateMode): number {
  const leftValue = valueForMode(left, mode);
  const rightValue = valueForMode(right, mode);
  if (Number.isNaN(leftValue) || Number.isNaN(rightValue)) {
    return Number.NaN;
  }
  if (leftValue < rightValue) return -1;
  if (leftValue > rightValue) return 1;
  return 0;
}

export function isPlacementValid(
  timeline: TimelineEntry[],
  newEntry: TimelineEntry,
  position: number,
  mode: DateMode
): boolean {
  if (position < 0 || position > timeline.length) {
    return false;
  }
  const leftNeighbor = position > 0 ? timeline[position - 1] : undefined;
  const rightNeighbor = position < timeline.length ? timeline[position] : undefined;
  if (!leftNeighbor && !rightNeighbor) return true;

  if (leftNeighbor) {
    const leftComparison = compareEntries(leftNeighbor, newEntry, mode);
    if (Number.isNaN(leftComparison) || leftComparison > 0) return false;
  }
  if (rightNeighbor) {
    const rightComparison = compareEntries(newEntry, rightNeighbor, mode);
    if (Number.isNaN(rightComparison) || rightComparison > 0) return false;
  }
  return true;
}

export function firstValidPosition(
  timeline: TimelineEntry[],
  newEntry: TimelineEntry,
  mode: DateMode
): number | undefined {
  for (let index = 0; index <= timeline.length; index += 1) {
    if (isPlacementValid(timeline, newEntry, index, mode)) {
      return index;
    }
  }
  return undefined;
}

