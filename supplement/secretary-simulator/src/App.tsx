import { useDeferredValue, useMemo, useState } from "react";
import { buildStrategy, recommend } from "./strategy";

type UtilityMode = "best" | "top3" | "topM" | "linear" | "custom";

const MAX_N = 200;

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

const formatValue = (value: number): string => {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 6 }).format(value);
};

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
      const utilities = makeUtilities(deferredMode, deferredN, deferredTopM, deferredCustom);
      return { model: buildStrategy(utilities), error: null };
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

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">GENERALIZED SECRETARY PROBLEM</p>
          <h1>最適戦略シミュレータ</h1>
          <p className="lead">
            選んだ候補の最終順位に効用を設定し、いま採用すべきかを後ろ向き計算で判定します。
          </p>
        </div>
        <div className="hero-mark" aria-hidden="true">
          τ*
        </div>
      </header>

      <main>
        <section className="workspace" aria-label="シミュレータ">
          <form className="panel controls" onSubmit={(event) => event.preventDefault()}>
            <div className="section-heading">
              <span className="step">1</span>
              <div>
                <h2>問題を設定</h2>
                <p>候補数と順位の効用を入力</p>
              </div>
            </div>

            <label className="field">
              <span>候補者の総数 n</span>
              <input
                type="number"
                min="1"
                max={MAX_N}
                value={n}
                onChange={(event) => updateN(Number(event.target.value))}
              />
              <small>1〜{MAX_N}人</small>
            </label>

            <fieldset>
              <legend>評価（効用）関数 u(r)</legend>
              <div className="preset-grid">
                {(
                  [
                    ["best", "最良だけ", "1位なら1"],
                    ["top3", "上位3人", "1〜3位なら1"],
                    ["topM", "上位 m 人", "m位まで同じ"],
                    ["linear", "順位点", "順位に応じて減少"],
                    ["custom", "カスタム", "効用を直接入力"],
                  ] as [UtilityMode, string, string][]
                ).map(([value, title, detail]) => (
                  <label className={`preset ${mode === value ? "selected" : ""}`} key={value}>
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === value}
                      onChange={() => setMode(value)}
                    />
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            {mode === "topM" && (
              <label className="field">
                <span>同じ効用を与える上位 m 人</span>
                <input
                  type="number"
                  min="1"
                  max={n}
                  value={topM}
                  onChange={(event) => setTopM(clampInteger(Number(event.target.value), 1, n))}
                />
              </label>
            )}

            {mode === "custom" && (
              <label className="field">
                <span>u(1), u(2), …, u(n)</span>
                <textarea
                  value={custom}
                  onChange={(event) => setCustom(event.target.value)}
                  rows={4}
                  spellCheck="false"
                />
                <small>1位から順に、カンマまたは空白区切りで {n} 個</small>
              </label>
            )}

            <div className="section-heading progress-heading">
              <span className="step">2</span>
              <div>
                <h2>現在の状況</h2>
                <p>いま見えている情報だけを入力</p>
              </div>
            </div>
            <div className="two-fields">
              <label className="field">
                <span>現在 k 人目</span>
                <input
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
              <label className="field">
                <span>暫定順位 s</span>
                <input
                  type="number"
                  min="1"
                  max={safeK}
                  value={safeS}
                  onChange={(event) => setS(clampInteger(Number(event.target.value), 1, safeK))}
                />
              </label>
            </div>
            <p className="hint">
              暫定順位は、現在の候補が「ここまでの {safeK} 人中で何位か」です。
            </p>
          </form>

          <section className="panel result-panel" aria-live="polite">
            <div className="section-heading">
              <span className="step">3</span>
              <div>
                <h2>最適な判断</h2>
                <p>
                  {safeK}人目・暫定{safeS}位の場合
                </p>
              </div>
            </div>

            {calculation.error ? (
              <div className="error-box">{calculation.error}</div>
            ) : (
              result && (
                <div className={isPending ? "pending" : ""}>
                  <div className={`decision ${result.action}`}>
                    <span className="decision-kicker">RECOMMENDATION</span>
                    <strong>
                      {result.action === "continue"
                        ? "見送って、次へ進む"
                        : result.action === "forced"
                          ? "最後なので採用する"
                          : "この候補を採用する"}
                    </strong>
                    <p>
                      {result.action === "continue"
                        ? "待つ場合の期待効用の方が高い状態です。"
                        : result.action === "forced"
                          ? "これ以上候補がいないため、この候補を選びます。"
                          : "いま採用する期待効用が、待つ価値以上です。"}
                    </p>
                  </div>

                  <div className="metric-grid">
                    <div className="metric">
                      <span>いま採用</span>
                      <strong>{formatValue(result.stopValue)}</strong>
                      <small>E[u(Rₖ) | Sₖ={safeS}]</small>
                    </div>
                    <div className="metric">
                      <span>見送る</span>
                      <strong>
                        {result.continueValue === null ? "—" : formatValue(result.continueValue)}
                      </strong>
                      <small>Vₖ₊₁</small>
                    </div>
                  </div>

                  <div className="result-detail">
                    <h3>この時点で採用する暫定順位</h3>
                    <div className="rank-list">
                      {result.acceptedRelativeRanks.map((rank) => (
                        <span className={rank === safeS ? "current" : ""} key={rank}>
                          {rank}位
                        </span>
                      ))}
                    </div>
                    {result.acceptedRelativeRanks.length === 0 && (
                      <p>この時点では、どの暫定順位でも見送ります。</p>
                    )}
                  </div>

                  <details>
                    <summary>現在候補の最終順位の見込み</summary>
                    <div className="probabilities">
                      {result.finalRankProbabilities
                        .map((probability, index) => ({ probability, rank: index + 1 }))
                        .filter(({ probability }) => probability > 1e-7)
                        .map(({ probability, rank }) => (
                          <div className="probability-row" key={rank}>
                            <span>{rank}位</span>
                            <div>
                              <i style={{ width: `${probability * 100}%` }} />
                            </div>
                            <strong>{(probability * 100).toFixed(1)}%</strong>
                          </div>
                        ))}
                    </div>
                  </details>
                </div>
              )
            )}
          </section>
        </section>

        <section className="explanation">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>計算していること</h2>
          <div className="explanation-grid">
            <article>
              <span>01</span>
              <h3>順位を効用に変える</h3>
              <div className="formula">
                max E[u(R<sub>τ</sub>)]
              </div>
              <p>最終順位 r ごとの嬉しさを u(r) として、期待効用を最大化します。</p>
            </article>
            <article>
              <span>02</span>
              <h3>いま採用する価値</h3>
              <div className="formula">
                G<sub>k,s</sub> = E[u(R<sub>k</sub>) | S<sub>k</sub>=s]
              </div>
              <p>暫定順位から最終順位の分布を推定し、採用時の期待効用を計算します。</p>
            </article>
            <article>
              <span>03</span>
              <h3>待つ価値と比較</h3>
              <div className="formula">
                G<sub>k,s</sub> ≥ V<sub>k+1</sub>
              </div>
              <p>後ろ向きに求めた継続価値以上なら採用する、という停止則です。</p>
            </article>
          </div>
          <details className="math-detail">
            <summary>数式の詳細</summary>
            <div className="math-content">
              <p>k人目の暫定順位がsであるとき、最終順位がrとなる条件付き確率は</p>
              <div className="formula block">
                P(Rₖ=r | Sₖ=s) = (k/n) · C(r−1,s−1) C(n−r,k−s) / C(n−1,k−1)
              </div>
              <p>
                です。これを使って G<sub>k,s</sub> を求め、V<sub>n</sub> から V<sub>1</sub>{" "}
                へ後ろ向きに計算します。
              </p>
              <div className="formula block">
                Vₖ = (1/k) Σ<sub>s=1…k</sub> max {"{"} G<sub>k,s</sub>, V<sub>k+1</sub> {"}"}
              </div>
              <p>
                候補の到着順は全順列から一様で、観測できるのは到着済み候補間の相対順位だけ、と仮定しています。
              </p>
            </div>
          </details>
        </section>
      </main>
      <footer>確率論勉強会 · 一般化された秘書問題</footer>
    </div>
  );
};

export default App;
