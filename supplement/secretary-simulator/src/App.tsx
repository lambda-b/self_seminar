import { useDeferredValue, useMemo, useState } from "react";
import Explanation from "@/Explanation.mdx";
import { buildStrategy, recommend } from "@/strategy";
import { compileUtilityExpression } from "@/utilityExpression";

type UtilityMode = "best" | "topM" | "linear" | "custom" | "formula";

const MAX_N = 200;
const panelClass =
  "rounded border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-9";
const baseInputClass =
  "w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10";

const inputClass = (error: string | null): string =>
  `${baseInputClass} ${error ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-600/10" : ""}`;

const parseIntegerInput = (
  input: string,
  minimum: number,
  maximum: number,
  label: string,
): { value: number | null; error: string | null } => {
  if (!input.trim()) return { value: null, error: `${label}を入力してください。` };
  const value = Number(input);
  if (!Number.isInteger(value)) return { value: null, error: `${label}は整数で入力してください。` };
  if (value < minimum || value > maximum) {
    return { value: null, error: `${minimum}〜${maximum}の範囲で入力してください。` };
  }
  return { value, error: null };
};

const makeUtilities = (
  mode: UtilityMode,
  n: number,
  topM: number,
  custom: string,
  formula: string,
): number[] => {
  if (mode === "custom") {
    const values = custom
      .split(/[\s,、]+/)
      .filter(Boolean)
      .map(Number);
    if (values.length !== n || values.some((value) => !Number.isFinite(value))) {
      throw new Error(`効用を1位から${n}位まで、ちょうど${n}個入力してください。`);
    }
    return values;
  }

  if (mode === "formula") {
    const utility = compileUtilityExpression(formula);
    return Array.from({ length: n }, (_, index) => utility(index + 1));
  }

  return Array.from({ length: n }, (_, index) => {
    const rank = index + 1;
    if (mode === "best") return rank === 1 ? 1 : 0;
    if (mode === "topM") return rank <= topM ? 1 : 0;
    return n === 1 ? 1 : (n - rank) / (n - 1);
  });
};

const formatValue = (value: number): string =>
  new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 6 }).format(value);

const SectionHeading = ({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-7 flex items-center gap-3">
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-600 text-sm font-bold text-white">
      {step}
    </span>
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const App = () => {
  const [nInput, setNInput] = useState("20");
  const [mode, setMode] = useState<UtilityMode>("topM");
  const [topMInput, setTopMInput] = useState("3");
  const [custom, setCustom] = useState(
    "1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0",
  );
  const [formula, setFormula] = useState("1 / x");
  const [kInput, setKInput] = useState("8");
  const [sInput, setSInput] = useState("1");
  const deferredNInput = useDeferredValue(nInput);
  const deferredMode = useDeferredValue(mode);
  const deferredTopMInput = useDeferredValue(topMInput);
  const deferredCustom = useDeferredValue(custom);
  const deferredFormula = useDeferredValue(formula);

  const nState = parseIntegerInput(nInput, 1, MAX_N, "候補者の総数 n");
  const n = nState.value;
  const topMState = parseIntegerInput(topMInput, 1, n ?? MAX_N, "上位 m 人");
  const kState = parseIntegerInput(kInput, 1, n ?? MAX_N, "現在の人数 k");
  const sState = parseIntegerInput(sInput, 1, kState.value ?? n ?? MAX_N, "暫定順位 s");

  const calculation = useMemo(() => {
    try {
      const deferredN = parseIntegerInput(deferredNInput, 1, MAX_N, "候補者の総数 n");
      if (deferredN.error || deferredN.value === null)
        throw new Error(deferredN.error ?? "nを入力してください。");
      const deferredTopM = parseIntegerInput(deferredTopMInput, 1, deferredN.value, "上位 m 人");
      if (deferredMode === "topM" && (deferredTopM.error || deferredTopM.value === null)) {
        throw new Error(deferredTopM.error ?? "mを入力してください。");
      }
      return {
        model: buildStrategy(
          makeUtilities(
            deferredMode,
            deferredN.value,
            deferredTopM.value ?? 1,
            deferredCustom,
            deferredFormula,
          ),
        ),
        error: null,
      };
    } catch (error) {
      return {
        model: null,
        error: error instanceof Error ? error.message : "入力を確認してください。",
      };
    }
  }, [deferredCustom, deferredFormula, deferredMode, deferredNInput, deferredTopMInput]);

  const isPending =
    nInput !== deferredNInput ||
    mode !== deferredMode ||
    topMInput !== deferredTopMInput ||
    custom !== deferredCustom ||
    formula !== deferredFormula;
  const progressError = kState.error ?? sState.error;
  const result =
    !isPending &&
    calculation.model &&
    kState.value !== null &&
    sState.value !== null &&
    !progressError
      ? recommend(calculation.model, kState.value, sState.value)
      : null;

  const presets: [UtilityMode, string, string][] = [
    ["best", "最良だけ", "1位なら1"],
    ["topM", "上位 m 人", "m位まで同じ"],
    ["linear", "順位点", "順位に応じて減少"],
    ["custom", "値を直接入力", "順位ごとの効用を列挙"],
    ["formula", "式で入力", "xを最終順位として計算"],
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="relative overflow-hidden bg-teal-950 px-6 pb-16 pt-14 text-white md:px-[6vw]">
        <div className="absolute -right-24 -top-48 size-[28rem] rounded-full border border-teal-600/50 shadow-[0_0_0_4rem_rgb(20_184_166_/_0.06),0_0_0_8rem_rgb(20_184_166_/_0.04)]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-orange-400">
              GENERALIZED SECRETARY PROBLEM
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tighter md:text-6xl">
              最適戦略シミュレータ
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-teal-100/80">
              選んだ候補の最終順位に効用を設定し、いま採用すべきかを後ろ向き計算で判定します。
            </p>
          </div>
          <div className="relative hidden size-32 place-items-center rounded-full border border-teal-600 font-serif text-5xl italic text-orange-300 md:grid">
            τ*
          </div>
        </div>
      </header>

      <main className="relative mx-auto -mt-6 max-w-7xl px-4 pb-16 md:px-8">
        <section className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form className={panelClass} onSubmit={(event) => event.preventDefault()}>
            <SectionHeading step="1" title="問題を設定" subtitle="候補数と順位の効用を入力" />
            <label className="mb-7 block text-sm font-semibold">
              候補者の総数 n
              <input
                className={`${inputClass(nState.error)} mt-2`}
                type="number"
                min="1"
                max={MAX_N}
                value={nInput}
                aria-invalid={Boolean(nState.error)}
                onChange={(event) => setNInput(event.target.value)}
              />
              <span
                className={`mt-1 block text-xs font-normal ${nState.error ? "text-red-600" : "text-slate-500"}`}
              >
                {nState.error ?? `1〜${MAX_N}人`}
              </span>
            </label>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">評価（効用）関数 u(r)</legend>
              <div className="mb-4 border-l-4 border-teal-600 bg-teal-50 px-4 py-3 text-xs leading-5 text-teal-900">
                <strong className="mr-2">推奨条件</strong>
                順位が良いほど効用が高くなるよう、正の単調非増加
                <span className="mx-1 font-mono">u(1) ≥ u(2) ≥ … ≥ u(n) &gt; 0</span>
                に設定するのが自然です。計算上は、有限値であれば負の値や増加関数も利用できます。
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {presets.map(([value, title, detail]) => (
                  <label
                    className={`relative cursor-pointer rounded border p-4 pl-10 transition ${
                      mode === value
                        ? "border-teal-700 bg-teal-50 shadow-[inset_3px_0_#0f766e]"
                        : "border-slate-200 hover:border-teal-400"
                    }`}
                    key={value}
                  >
                    <input
                      className="absolute left-4 top-5 accent-teal-700"
                      type="radio"
                      name="mode"
                      checked={mode === value}
                      onChange={() => setMode(value)}
                    />
                    <strong className="block text-sm">{title}</strong>
                    <small className="text-xs text-slate-500">{detail}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            {mode === "topM" && (
              <label className="mt-6 block text-sm font-semibold">
                同じ効用を与える上位 m 人
                <input
                  className={`${inputClass(topMState.error)} mt-2`}
                  type="number"
                  min="1"
                  max={n ?? MAX_N}
                  value={topMInput}
                  aria-invalid={Boolean(topMState.error)}
                  onChange={(event) => setTopMInput(event.target.value)}
                />
                {topMState.error && (
                  <span className="mt-1 block text-xs font-normal text-red-600">
                    {topMState.error}
                  </span>
                )}
              </label>
            )}

            {mode === "custom" && (
              <label className="mt-6 block text-sm font-semibold">
                u(1), u(2), …, u(n)
                <textarea
                  className={`${inputClass(null)} mt-2 min-h-24`}
                  value={custom}
                  onChange={(event) => setCustom(event.target.value)}
                  rows={4}
                  spellCheck="false"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  1位から順に、カンマまたは空白区切りで {n ?? "n"} 個
                </span>
              </label>
            )}

            {mode === "formula" && (
              <label className="mt-6 block text-sm font-semibold">
                効用関数 u(x)
                <input
                  className={`${inputClass(calculation.error)} mt-2 font-mono`}
                  type="text"
                  value={formula}
                  aria-invalid={Boolean(calculation.error)}
                  onChange={(event) => setFormula(event.target.value)}
                  placeholder="例: 1 / x"
                  spellCheck="false"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  xは最終順位。利用可能: exp, log, +, -, *, /, 括弧
                </span>
              </label>
            )}

            <div className="mt-9 border-t border-slate-200 pt-8">
              <SectionHeading step="2" title="現在の状況" subtitle="いま見えている情報だけを入力" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  現在 k 人目
                  <input
                    className={`${inputClass(kState.error)} mt-2`}
                    type="number"
                    min="1"
                    max={n ?? MAX_N}
                    value={kInput}
                    aria-invalid={Boolean(kState.error)}
                    onChange={(event) => setKInput(event.target.value)}
                  />
                  {kState.error && (
                    <span className="mt-1 block text-xs font-normal text-red-600">
                      {kState.error}
                    </span>
                  )}
                </label>
                <label className="text-sm font-semibold">
                  暫定順位 s
                  <input
                    className={`${inputClass(sState.error)} mt-2`}
                    type="number"
                    min="1"
                    max={kState.value ?? n ?? MAX_N}
                    value={sInput}
                    aria-invalid={Boolean(sState.error)}
                    onChange={(event) => setSInput(event.target.value)}
                  />
                  {sState.error && (
                    <span className="mt-1 block text-xs font-normal text-red-600">
                      {sState.error}
                    </span>
                  )}
                </label>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                暫定順位は、現在の候補が「ここまでの {kState.value ?? "k"} 人中で何位か」です。
              </p>
            </div>
          </form>

          <section className={`${panelClass} lg:sticky lg:top-4`} aria-live="polite">
            <SectionHeading
              step="3"
              title="最適な判断"
              subtitle={
                kState.value !== null && sState.value !== null
                  ? `${kState.value}人目・暫定${sState.value}位の場合`
                  : "現在の状況を入力してください"
              }
            />
            {progressError ? (
              <div className="border-l-4 border-red-600 bg-red-50 p-5 text-red-800">
                入力が完了すると、ここに最適な判断を表示します。
              </div>
            ) : calculation.error ? (
              <div className="border-l-4 border-red-600 bg-red-50 p-5 text-red-800">
                {calculation.error}
              </div>
            ) : (
              result && (
                <div className={isPending ? "opacity-50" : "transition-opacity"}>
                  <div
                    className={`border-l-4 p-6 ${
                      result.action === "continue"
                        ? "border-orange-600 bg-orange-50"
                        : result.action === "forced"
                          ? "border-slate-500 bg-slate-100"
                          : "border-teal-700 bg-teal-50"
                    }`}
                  >
                    <span className="text-[0.65rem] font-bold tracking-[0.16em] text-slate-500">
                      RECOMMENDATION
                    </span>
                    <strong className="mt-2 block text-2xl font-bold tracking-tight md:text-3xl">
                      {result.action === "continue"
                        ? "見送って、次へ進む"
                        : result.action === "forced"
                          ? "最後なので採用する"
                          : "この候補を採用する"}
                    </strong>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {result.action === "continue"
                        ? "待つ場合の期待効用の方が高い状態です。"
                        : result.action === "forced"
                          ? "これ以上候補がいないため、この候補を選びます。"
                          : "いま採用する期待効用が、待つ価値以上です。"}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["いま採用", formatValue(result.stopValue), `E[u(Rₖ) | Sₖ=${sState.value}]`],
                      [
                        "見送る",
                        result.continueValue === null ? "—" : formatValue(result.continueValue),
                        "Vₖ₊₁",
                      ],
                    ].map(([label, value, detail]) => (
                      <div className="border border-slate-200 bg-slate-50 p-4" key={label}>
                        <span className="block text-xs text-slate-500">{label}</span>
                        <strong className="my-1 block text-2xl tabular-nums">{value}</strong>
                        <small className="text-xs text-slate-500">{detail}</small>
                      </div>
                    ))}
                  </div>

                  <div className="my-7">
                    <h3 className="mb-3 text-sm font-bold">この時点で採用する暫定順位</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.acceptedRelativeRanks.map((rank) => (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            rank === sState.value
                              ? "bg-teal-700 text-white ring-4 ring-teal-700/15"
                              : "bg-teal-50 text-teal-800"
                          }`}
                          key={rank}
                        >
                          {rank}位
                        </span>
                      ))}
                    </div>
                    {result.acceptedRelativeRanks.length === 0 && (
                      <p className="text-sm text-slate-500">
                        この時点では、どの暫定順位でも見送ります。
                      </p>
                    )}
                  </div>

                  <details className="border-t border-slate-200 pt-5">
                    <summary className="cursor-pointer text-sm font-semibold text-teal-800">
                      現在候補の最終順位の見込み
                    </summary>
                    <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
                      {result.finalRankProbabilities
                        .map((probability, index) => ({ probability, rank: index + 1 }))
                        .filter(({ probability }) => probability > 1e-7)
                        .map(({ probability, rank }) => (
                          <div
                            className="grid grid-cols-[2.5rem_1fr_3.5rem] items-center gap-2 text-xs"
                            key={rank}
                          >
                            <span>{rank}位</span>
                            <progress
                              className="h-1.5 w-full accent-orange-600"
                              value={probability}
                              max="1"
                            />
                            <strong className="text-right tabular-nums">
                              {(probability * 100).toFixed(1)}%
                            </strong>
                          </div>
                        ))}
                    </div>
                  </details>
                </div>
              )
            )}
          </section>
        </section>

        <Explanation />
      </main>
      <footer className="bg-teal-950 px-6 py-7 text-center text-xs tracking-wider text-teal-100/60">
        確率論勉強会 · 一般化された秘書問題
      </footer>
    </div>
  );
};

export default App;
