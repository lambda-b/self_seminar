export interface StrategyModel {
  n: number;
  utilities: number[];
  stopValues: number[][];
  values: number[];
}

export interface Recommendation {
  action: "hire" | "continue" | "forced";
  stopValue: number;
  continueValue: number | null;
  advantage: number | null;
  acceptedRelativeRanks: number[];
  finalRankProbabilities: number[];
}

const EPSILON = 1e-12;

function makeLogFactorials(n: number): number[] {
  const result = new Array<number>(n + 1).fill(0);
  for (let i = 2; i <= n; i += 1) result[i] = result[i - 1] + Math.log(i);
  return result;
}

function logChoose(n: number, k: number, logFactorials: number[]): number {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;
  return logFactorials[n] - logFactorials[k] - logFactorials[n - k];
}

/**
 * P(R_k = r | S_k = s): the final rank of applicant k, conditioned on
 * their relative rank s among the first k applicants.
 */
export function finalRankDistribution(n: number, k: number, s: number): number[] {
  if (!Number.isInteger(n) || n < 1) throw new Error("n must be a positive integer");
  if (!Number.isInteger(k) || k < 1 || k > n) throw new Error("k must be between 1 and n");
  if (!Number.isInteger(s) || s < 1 || s > k) throw new Error("s must be between 1 and k");

  const logFactorials = makeLogFactorials(n);
  const denominator = logChoose(n - 1, k - 1, logFactorials);
  const probabilities = new Array<number>(n).fill(0);

  for (let r = s; r <= n - k + s; r += 1) {
    const logProbability =
      Math.log(k / n) +
      logChoose(r - 1, s - 1, logFactorials) +
      logChoose(n - r, k - s, logFactorials) -
      denominator;
    probabilities[r - 1] = Math.exp(logProbability);
  }

  const total = probabilities.reduce((sum, probability) => sum + probability, 0);
  return probabilities.map((probability) => probability / total);
}

export function buildStrategy(utilities: number[]): StrategyModel {
  const n = utilities.length;
  if (n < 1) throw new Error("At least one utility is required");
  if (utilities.some((utility) => !Number.isFinite(utility))) {
    throw new Error("Utilities must be finite numbers");
  }

  const stopValues = Array.from({ length: n + 1 }, () => [] as number[]);
  for (let k = 1; k <= n; k += 1) {
    stopValues[k] = new Array<number>(k + 1).fill(0);
    for (let s = 1; s <= k; s += 1) {
      const probabilities = finalRankDistribution(n, k, s);
      stopValues[k][s] = probabilities.reduce(
        (sum, probability, index) => sum + probability * utilities[index],
        0,
      );
    }
  }

  const values = new Array<number>(n + 2).fill(0);
  values[n] = stopValues[n].slice(1).reduce((sum, value) => sum + value, 0) / n;

  for (let k = n - 1; k >= 1; k -= 1) {
    values[k] =
      stopValues[k]
        .slice(1)
        .reduce((sum, stopValue) => sum + Math.max(stopValue, values[k + 1]), 0) / k;
  }

  return { n, utilities: [...utilities], stopValues, values };
}

export function recommend(model: StrategyModel, k: number, s: number): Recommendation {
  if (!Number.isInteger(k) || k < 1 || k > model.n) throw new Error("Invalid progress");
  if (!Number.isInteger(s) || s < 1 || s > k) throw new Error("Invalid relative rank");

  const stopValue = model.stopValues[k][s];
  const continueValue = k === model.n ? null : model.values[k + 1];
  const acceptedRelativeRanks = Array.from({ length: k }, (_, index) => index + 1).filter(
    (rank) => k === model.n || model.stopValues[k][rank] + EPSILON >= model.values[k + 1],
  );

  return {
    action:
      k === model.n ? "forced" : stopValue + EPSILON >= model.values[k + 1] ? "hire" : "continue",
    stopValue,
    continueValue,
    advantage: continueValue === null ? null : stopValue - continueValue,
    acceptedRelativeRanks,
    finalRankProbabilities: finalRankDistribution(model.n, k, s),
  };
}
