import { describe, expect, it } from "vitest";
import { compileUtilityExpression } from "@/utilityExpression";

describe("compileUtilityExpression", () => {
  it("evaluates arithmetic expressions using the final rank x", () => {
    expect(compileUtilityExpression("x * x")(3)).toBe(9);
    expect(compileUtilityExpression("x + 3")(2)).toBe(5);
    expect(compileUtilityExpression("-(x - 1) / 2")(5)).toBe(-2);
  });

  it("supports exp and log", () => {
    expect(compileUtilityExpression("log(exp(x))")(2)).toBeCloseTo(2);
  });

  it("rejects unknown names and JavaScript syntax", () => {
    expect(() => compileUtilityExpression("sqrt(x)")).toThrow("使用できない名前");
    expect(() => compileUtilityExpression("globalThis.alert(1)")).toThrow();
  });

  it("rejects non-finite results", () => {
    expect(() => compileUtilityExpression("1 / (x - 1)")(1)).toThrow("有限の数");
    expect(() => compileUtilityExpression("log(x - 1)")(1)).toThrow("有限の数");
  });
});
