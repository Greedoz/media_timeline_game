import { describe, expect, it } from "vitest";
import { isPlacementValid } from "../src/timeline";

describe("isPlacementValid", () => {
  it("accepts between placement in exact mode", () => {
    const timeline = [
      { cardId: "a", eventDate: "2020-01-01" },
      { cardId: "b", eventDate: "2020-06-01" }
    ];
    const candidate = { cardId: "c", eventDate: "2020-03-01" };
    expect(isPlacementValid(timeline, candidate, 1, "exact")).toBe(true);
  });

  it("accepts equal exact date in either order", () => {
    const timeline = [{ cardId: "a", eventDate: "2020-01-01" }];
    const candidate = { cardId: "b", eventDate: "2020-01-01" };
    expect(isPlacementValid(timeline, candidate, 0, "exact")).toBe(true);
    expect(isPlacementValid(timeline, candidate, 1, "exact")).toBe(true);
  });

  it("accepts equal year in year mode", () => {
    const timeline = [{ cardId: "a", eventYear: 2020 }];
    const candidate = { cardId: "b", eventYear: 2020 };
    expect(isPlacementValid(timeline, candidate, 0, "year")).toBe(true);
    expect(isPlacementValid(timeline, candidate, 1, "year")).toBe(true);
  });
});

