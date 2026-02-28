import { describe, expect, it } from "vitest";
import { recognitionMatches } from "../src/normalize";

describe("recognitionMatches", () => {
  it("matches case-insensitively", () => {
    expect(recognitionMatches("tomorrowland", "Tomorrowland", [])).toBe(true);
  });

  it("matches punctuation-insensitively", () => {
    expect(recognitionMatches("TML 2019", "Tomorrowland 2019", ["TML-2019"])).toBe(true);
  });

  it("returns false for non matching answer", () => {
    expect(recognitionMatches("wrong answer", "Tomorrowland 2019", ["TML"])).toBe(false);
  });
});

