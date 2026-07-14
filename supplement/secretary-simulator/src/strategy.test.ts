import { describe, expect, it } from "vitest";
import { buildStrategy, finalRankDistribution, recommend } from "./strategy";

describe("finalRankDistribution", () => {
  it("is uniform before any comparison is available", () => {
    expect(finalRankDistribution(4, 1, 1)).toEqual([0.25, 0.25, 0.25, 0.25]);
  });

  it("conditions final rank on the observed relative rank", () => {
    const result = finalRankDistribution(3, 2, 1);
    expect(result[0]).toBeCloseTo(2 / 3);
    expect(result[1]).toBeCloseTo(1 / 3);
    expect(result[2]).toBe(0);
  });
});

describe("strategy", () => {
  it("forces a choice at the final applicant", () => {
    const model = buildStrategy([1, 0, 0]);
    expect(recommend(model, 3, 2).action).toBe("forced");
  });

  it("accepts every applicant when all ranks have equal utility", () => {
    const model = buildStrategy([1, 1, 1, 1]);
    expect(recommend(model, 1, 1).action).toBe("hire");
    expect(model.values[1]).toBeCloseTo(1);
  });
});
