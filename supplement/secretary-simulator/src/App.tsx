import { useDeferredValue, useMemo, useState } from "react";
import Explanation from "@/Explanation.mdx";
import { buildStrategy, recommend } from "@/strategy";

type UtilityMode = "best" | "top3" | "topM" | "linear" | "custom";

const MAX_N = 200;
const panelClass =
  "rounded border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-9";
const inputClass =
  "w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10";

const clampInteger = (value: number, minimum: number, maximum: number): number => {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
};

const makeUtilities = (mode: UtilityMode, n: number, topM: number, custom: string): number[] => {
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

  return Array.from({ length: n }, (_, index) => {
    const rank = index + 1;
    if (mode === "best") return rank === 1 ? 1 : 0;
    if (mode === "top3") return rank <= Math.min(3, n) ? 1 : 0;
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
  const [n, setN] = useState(20);
  const [mode, setMode] = useState<UtilityMode>("top3");
  const [topM, setTopM] = useState(3);
  const [custom, setCustom] = useState(
    "1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0",
  );
  const [k, setK] = useState(8);
  const [s, setS] = useState(1);
  const deferredN = useDeferredValue(n);
  const deferredMode = useDeferredValue(mode);
  const deferredTopM = useDeferredValue(topM);
  const deferredCustom = useDeferredValue(custom);

  const calculation = useMemo(() => {
    try {
      return {
        model: buildStrategy(makeUtilities(deferredMode, deferredN, deferredTopM, deferredCustom)),
        error: null,
      };
    } catch (error) {
      return {
        model: null,
        error: error instanceof Error ? error.message : "入力を確認してください。",
      };
    }
  }, [deferredCustom, deferredMode, deferredN, deferredTopM]);

  const safeK = clampInteger(k, 1, n);
  const safeS = clampInteger(s, 1, safeK);
  const result = calculation.model ? recommend(calculation.model, safeK, safeS) : null;
  const isPending =
    n !== deferredN || mode !== deferredMode || topM !== deferredTopM || custom !== deferredCustom;

  const updateN = (next: number) => {
    const normalized = clampInteger(next, 1, MAX_N);
    setN(normalized);
    setTopM((value) => Math.min(value, normalized));
    setK((value) => Math.min(value, normalized));
    setS((value) => Math.min(value, normalized));
  };

  const presets: [UtilityMode, string, string][] = [
    ["best", "最良だけ", "1位なら1"],
    ["top3", "上位3人", "1〜3位なら1"],
    ["topM", "上位 m 人", "m位まで同じ"],
    ["linear", "順位点", "順位に応じて減少"],
    ["custom", "カスタム", "効用を直接入力"],
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
                className={`${inputClass} mt-2`}
                type="number"
                min="1"
                max={MAX_N}
                value={n}
                onChange={(event) => updateN(Number(event.target.value))}
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">1〜{MAX_N}人</span>
            </label>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">評価（効用）関数 u(r)</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {presets.map(([value, title, detail]) => (
                  <label
                    className={`relative cursor-pointer rounded border p-4 pl-10 transition ${
                      mode === value
                        ? "border-teal-700 bg-teal-50 shadow-[inset_3px_0_#0f766e]"
                        : "border-slate-200 hover:border-teal-400"
                    } ${value === "custom" ? "sm:col-span-2" : ""}`}
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
                  className={`${inputClass} mt-2`}
                  type="number"
                  min="1"
                  max={n}
                  value={topM}
                  onChange={(event) => setTopM(clampInteger(Number(event.target.value), 1, n))}
                />
              </label>
            )}

            {mode === "custom" && (
              <label className="mt-6 block text-sm font-semibold">
                u(1), u(2), …, u(n)
                <textarea
                  className={`${inputClass} mt-2 min-h-24`}
                  value={custom}
                  onChange={(event) => setCustom(event.target.value)}
                  rows={4}
                  spellCheck="false"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  1位から順に、カンマまたは空白区切りで {n} 個
                </span>
              </label>
            )}

            <div className="mt-9 border-t border-slate-200 pt-8">
              <SectionHeading step="2" title="現在の状況" subtitle="いま見えている情報だけを入力" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  現在 k 人目
                  <input
                    className={`${inputClass} mt-2`}
                    type="number"
                    min="1"
                    max={n}
                    value={safeK}
                    onChange={(event) => {
                      const value = clampInteger(Number(event.target.value), 1, n);
                      setK(value);
                      setS((rank) => Math.min(rank, value));
                    }}
                  />
                </label>
                <label className="text-sm font-semibold">
                  暫定順位 s
                  <input
                    className={`${inputClass} mt-2`}
                    type="number"
                    min="1"
                    max={safeK}
                    value={safeS}
                    onChange={(event) => setS(clampInteger(Number(event.target.value), 1, safeK))}
                  />
                </label>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                暫定順位は、現在の候補が「ここまでの {safeK} 人中で何位か」です。
              </p>
            </div>
          </form>

          <section className={`${panelClass} lg:sticky lg:top-4`} aria-live="polite">
            <SectionHeading
              step="3"
              title="最適な判断"
              subtitle={`${safeK}人目・暫定${safeS}位の場合`}
            />
            {calculation.error ? (
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
                      ["いま採用", formatValue(result.stopValue), `E[u(Rₖ) | Sₖ=${safeS}]`],
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
                            rank === safeS
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
