---
theme: default
title: 測度論から確率論へ
info: |
  理学部出身者向けの確率論勉強会資料。
  PDF出力を前提に、定義・直感・応用の流れを重視する。
class: text-left
drawings:
  persist: false
transition: none
mdc: true
comark: true
fonts:
  sans: Noto Sans JP
  serif: Noto Serif JP
  mono: Fira Code
layout: cover
---

# 測度論から確率論へ

確率変数・収束・確率過程・応用までの見取り図

[40-60分想定 / 測度論・Lebesgue積分の概論後]{class="mt-10 text-sm opacity-70"}

---
layout: two-cols-header
---

# 今日のゴール

測度論の言葉で確率論を読み替え、確率論でよく出てくる対象の位置づけをつかむ。

::left::

## 前半

- 確率空間と確率変数
- 分布と期待値
- 独立性
- 4種類の収束
- 大数の法則と中心極限定理

::right::

## 後半

- 確率過程
- ポアソン過程
- ブラウン運動とMarkov性
- 確率微分方程式の入口
- ブラックショールズと最適戦略

---
layout: default
---

# 時間配分

PDFとして読んでも流れが追えるように、定義はやや明示的に残す。

| パート | 内容 | 目安 |
|---|---|---:|
| 1 | 確率空間・確率変数・分布 | 8分 |
| 2 | 独立性・期待値・収束概念 | 12分 |
| 3 | 大数の法則・中心極限定理 | 8分 |
| 4 | 確率過程・ブラウン運動・Markov性 | 15分 |
| 5 | SDE・ブラックショールズ・最適戦略 | 12分 |
| 6 | まとめ・議論 | 5分 |

---
layout: section
---

# 1. 測度論から確率論へ

---
layout: default
---

# 確率空間

測度空間 $(\Omega,\mathcal{F},P)$ が

$$
P(\Omega)=1
$$

を満たすとき、これを **確率空間** と呼ぶ。

| 測度論 | 確率論での読み方 |
|---|---|
| $\Omega$ | 標本空間 |
| $\omega\in\Omega$ | 標本、実現値 |
| $A\in\mathcal{F}$ | 事象 |
| $P(A)$ | 事象 $A$ の確率 |
| a.e. | a.s. |

::note
$\mathcal{F}$ は「観測・判定できる事象の集まり」と見ると、後の filtration とつながりやすい。
::

---
layout: two-cols-header
---

# 確率変数

実数値確率変数とは、可測写像

$$
X:(\Omega,\mathcal{F})\to(\mathbb{R},\mathcal{B}(\mathbb{R}))
$$

のこと。

::left::

## 大事な見方

- $X$ は標本 $\omega$ に数値を対応させる
- 可測性は $X$ で事象を引き戻せる条件
- $X^{-1}(B)\in\mathcal{F}$ により $P(X\in B)$ が定義できる

::right::

## 一般化

$$
X:(\Omega,\mathcal{F})\to(S,\mathcal{S})
$$

可測空間値の確率変数として考えられる。

例: $\mathbb{R}^d$ 値、関数空間値、経路値。

---
layout: default
---

# 分布

確率変数 $X$ は、もとの確率測度 $P$ を値域側へ押し出す。

$$
P_X(A)
=P(X^{-1}(A))
=P(\{\omega\in\Omega:X(\omega)\in A\})
$$

これを $X$ の **分布** という。

::diagram
$(\Omega,\mathcal{F},P)$
$\xrightarrow{\quad X\quad}$
$(S,\mathcal{S},P_X)$
::

::note
確率論では、個々の標本空間よりも「分布が何か」が主役になる場面が多い。
::

---
layout: default
---

# 期待値

可積分な確率変数 $X$ に対して、

$$
E[X]=\int_{\Omega}X(\omega)\,P(d\omega)
$$

と定義する。

分布 $P_X$ を使えば、

$$
E[f(X)]=\int_S f(x)\,P_X(dx)
$$

と書ける。

::note
測度論での積分が、そのまま期待値になる。確率論固有の記法に見えて、中身は Lebesgue 積分。
::

---
layout: two-cols-header
---

# 生成する $\sigma$ 加法族

確率変数 $X$ が生成する $\sigma$ 加法族は

$$
\sigma(X)=\{X^{-1}(B):B\in\mathcal{B}(\mathbb{R})\}
$$

を含む最小の $\sigma$ 加法族。

::left::

## 意味

$X$ を観測して判別できる事象の全体。

::right::

## 後で使う

- 独立性
- 条件付き期待値
- filtration
- Markov性

---
layout: default
---

# 独立性

事象 $A,B$ が独立とは

$$
P(A\cap B)=P(A)P(B)
$$

であること。

確率変数 $X,Y$ が独立とは、生成する $\sigma$ 加法族

$$
\sigma(X),\quad \sigma(Y)
$$

が独立であること。

::note
「値が無関係」という直感を、可測集合全体の積構造として定式化している。
::

---
layout: section
---

# 2. 収束概念

---
layout: default
---

# 確率変数列の4つの収束

同じ確率空間上の確率変数列 $X_n$ と $X$ を考える。

| 収束 | 定義 |
|---|---|
| 概収束 | $X_n\to X$ a.s. |
| 確率収束 | $\forall\varepsilon>0,\ P(|X_n-X|>\varepsilon)\to0$ |
| $L^p$ 収束 | $E[|X_n-X|^p]\to0$ |
| 法則収束 | $P_{X_n}\Rightarrow P_X$ |

::note
法則収束は、$X_n$ と $X$ が同一の確率空間上にある必要がない。
::

---
layout: two-cols-header
---

# 収束概念の関係

基本的な含意関係は次の通り。

$$
L^p\text{収束}\Rightarrow\text{確率収束}\Rightarrow\text{法則収束}
$$

$$
\text{概収束}\Rightarrow\text{確率収束}\Rightarrow\text{法則収束}
$$

::left::

## 強い情報

概収束、$L^p$ 収束は、同じ確率空間上の比較をしている。

::right::

## 弱い情報

法則収束は、分布だけを見る。

同じ $\omega$ ごとの比較はしない。

---
layout: default
---

# 概収束と確率収束の差

概収束:

$$
P\left(\{\omega:\lim_{n\to\infty}X_n(\omega)=X(\omega)\}\right)=1
$$

確率収束:

$$
P(|X_n-X|>\varepsilon)\to0
$$

::note
概収束は「ほとんどすべての標本路で最後は収束する」。確率収束は「各時点で外れる確率が小さくなる」。
::

---
layout: default
---

# 法則収束

法則収束は、分布が弱く近づくこと。

$$
X_n \Rightarrow X
$$

連続有界関数 $f$ に対して

$$
E[f(X_n)]\to E[f(X)]
$$

と見てもよい。

::note
中心極限定理は「標準化された和が正規分布へ法則収束する」という定理として理解する。
::

---
layout: section
---

# 3. 大数の法則と中心極限定理

---
layout: two-cols-header
---

# 大数の法則

$X_1,X_2,\dots$ を独立同分布、$E[|X_1|]<\infty$ とする。

標本平均

$$
\overline{X}_n=\frac{1}{n}\sum_{k=1}^n X_k
$$

は、期待値 $m=E[X_1]$ に近づく。

::left::

## 弱法則

$$
\overline{X}_n\to m
$$

in probability

::right::

## 強法則

$$
\overline{X}_n\to m
$$

almost surely

---
layout: default
---

# 大数の法則の直感

個々の試行は揺らぐが、平均を取ると揺らぎがならされる。

$$
\overline{X}_n-m
=\frac{1}{n}\sum_{k=1}^n(X_k-m)
$$

分散有限なら

$$
\mathrm{Var}(\overline{X}_n)=\frac{\mathrm{Var}(X_1)}{n}
$$

となり、平均のばらつきは $n^{-1}$ のオーダーで小さくなる。

---
layout: default
---

# 中心極限定理

$X_1,X_2,\dots$ を独立同分布、$E[X_1]=m$、$\mathrm{Var}(X_1)=\sigma^2<\infty$ とする。

このとき

$$
\frac{\sum_{k=1}^n X_k-nm}{\sqrt{n}\sigma}
\Rightarrow N(0,1)
$$

::note
平均そのものは $m$ に近づく。一方、$\sqrt{n}$ 倍して揺らぎを拡大すると、極限分布として正規分布が現れる。
::

---
layout: default
---

# LLN と CLT の違い

| 定理 | 見ているもの | 結論 |
|---|---|---|
| 大数の法則 | 平均の極限 | 定数 $m$ へ収束 |
| 中心極限定理 | 平均の揺らぎ | 正規分布へ法則収束 |

$$
\overline{X}_n\to m
$$

$$
\sqrt{n}\frac{\overline{X}_n-m}{\sigma}\Rightarrow N(0,1)
$$

::note
「平均が収束する」と「収束の周りの揺らぎがどう見えるか」は別の問い。
::

---
layout: section
---

# 4. 確率過程

---
layout: default
---

# 確率過程

確率過程とは、時間 $t$ をパラメータにもつ確率変数の族。

$$
X=(X_t)_{t\ge0}
$$

各 $t$ に対して

$$
X_t:\Omega\to\mathbb{R}^d
$$

が確率変数である。

::note
$\omega$ を固定すると $t\mapsto X_t(\omega)$ という関数が得られる。これを標本路という。
::

---
layout: default
---

# 経路値確率変数として見る

連続な標本路を持つ過程なら、

$$
X:\Omega\to C([0,\infty),\mathbb{R}^d)
$$

という関数空間値確率変数として見られる。

::diagram
$\omega$
$\longmapsto$
$(X_t(\omega))_{t\ge0}$
::

::note
確率過程は「時間ごとの確率変数の族」でもあり、「ランダムな関数」でもある。
::

---
layout: default
---

# 可測性と適合性

確率過程 $X$ について、次の2つを区別する。

| 概念 | 意味 |
|---|---|
| 可測性 | $(t,\omega)\mapsto X_t(\omega)$ が直積空間上で可測 |
| 適合性 | 各時刻 $t$ で $X_t$ が $\mathcal{F}_t$ 可測 |

filtration $(\mathcal{F}_t)_{t\ge0}$ は、時刻 $t$ までに得られる情報を表す。

$$
\mathcal{F}_s\subseteq\mathcal{F}_t\quad(s\le t)
$$

---
layout: default
---

# ポアソン過程

ポアソン過程 $(N_t)_{t\ge0}$ は、ランダムな到着回数を表す基本例。

強度 $\lambda>0$ のポアソン過程では、

$$
N_t-N_s\sim \mathrm{Poisson}(\lambda(t-s))
\quad(0\le s<t)
$$

かつ、互いに重ならない時間区間の増分は独立。

::note
「時間とともにランダムにジャンプする」過程。ブラウン運動は「連続的に揺れる」過程。
::

---
layout: default
---

# ブラウン運動

1次元ブラウン運動 $(B_t)_{t\ge0}$ は、次を満たす連続確率過程。

1. $B_0=0$ a.s.
2. 標本路 $t\mapsto B_t(\omega)$ は連続
3. $0\le s<t$ に対して $B_t-B_s\sim N(0,t-s)$
4. 重ならない時間区間の増分は独立

::note
連続な標本路を持つが、典型的には非常に荒く、有限変動でも微分可能でもない。
::

---
layout: default
---

# Wiener測度

ブラウン運動は、経路空間

$$
W_0=C_0([0,\infty),\mathbb{R})
$$

上の確率測度としても理解できる。

この経路空間上で、座標過程

$$
B_t(w)=w(t)
$$

がブラウン運動になるような確率測度を Wiener 測度という。

::note
確率過程を「経路空間上の確率測度」と見る視点は、測度論的確率論の中心的な発想。
::

---
layout: default
---

# Markov性

Markov性は、未来の分布が現在だけで決まり、過去の詳細には依存しないという性質。

ブラウン運動では、

$$
B_{t+s}-B_s
$$

が $\mathcal{F}_s$ と独立で、分布は $B_t$ と同じ。

条件付き期待値で書けば、

$$
E[f(B_{t+s})\mid\mathcal{F}_s]
=E_{B_s}[f(B_t)]
$$

---
layout: default
---

# 確率微分方程式の入口

通常の微分方程式

$$
dX_t=b(X_t)\,dt
$$

に、ブラウン運動によるランダムな揺らぎを加える。

$$
dX_t=b(X_t)\,dt+\sigma(X_t)\,dB_t
$$

積分形では

$$
X_t=X_0+\int_0^t b(X_s)\,ds+\int_0^t \sigma(X_s)\,dB_s
$$

::note
$dB_t$ は通常の微分ではない。厳密には Itô 積分として定義する。
::

---
layout: section
---

# 5. 応用

---
layout: default
---

# ブラックショールズモデル

株価 $S_t$ を幾何ブラウン運動でモデル化する。

$$
dS_t=\mu S_t\,dt+\sigma S_t\,dB_t
$$

ここで、

| 記号 | 意味 |
|---|---|
| $\mu$ | 平均成長率 |
| $\sigma$ | ボラティリティ |
| $B_t$ | ブラウン運動 |

::note
価格そのものではなく、相対変化率にランダムな揺らぎが入るモデル。
::

---
layout: default
---

# オプション価格

ヨーロピアン・コールオプションの満期 $T$ でのペイオフは

$$
(S_T-K)^+
$$

ここで $K$ は権利行使価格。

ブラックショールズ理論では、無裁定の考え方から価格関数 $V(t,S)$ が満たす方程式を導く。

$$
\partial_t V+\frac{1}{2}\sigma^2S^2\partial_{SS}V
+rS\partial_SV-rV=0
$$

終端条件:

$$
V(T,S)=(S-K)^+
$$

---
layout: default
---

# 何が確率論とつながるか

ブラックショールズは、次の概念が一気につながる例。

- ブラウン運動
- 確率微分方程式
- Itôの公式
- Markov性
- 偏微分方程式
- 条件付き期待値
- リスク中立測度

::note
この勉強会では厳密な金融数学の完成より、「確率過程が解析と応用へ接続する」ことを見せる位置づけにする。
::

---
layout: default
---

# 最適戦略

確率論では、ランダムな状況のもとで最適な意思決定を考える。

典型例:

- サイコロを振り直すか止めるか
- 秘書問題
- 停止時刻
- 動的計画法

::note
「事前に全部見られない」「途中で止める必要がある」という状況では、情報の増え方が本質になる。
::

---
layout: default
---

# サイコロの停止問題

例: サイコロを最大 $n$ 回まで振れる。各回で止めて出目を得点にしてよい。

残り1回なら、期待値は

$$
V_1=E[D]=3.5
$$

残り $k$ 回の価値を $V_k$ とすると、

$$
V_k=E[\max(D,V_{k-1})]
$$

::note
「今の値で止める」か「続ける期待価値を選ぶ」か、という再帰構造が現れる。
::

---
layout: default
---

# 秘書問題

$n$ 人の候補者をランダムな順番で観察する。

各候補者について、その場で採用するか見送るかを決める。見送った候補者には戻れない。

古典的な目的:

$$
\text{最良候補を採用する確率を最大化する}
$$

有名な戦略:

$$
\text{最初の約 } n/e \text{ 人を見送り、その後の暫定1位を採用する}
$$

---
layout: default
---

# 目的関数を変える

秘書問題は、目的関数を変えると最適戦略も変わる。

| 目的 | 戦略の傾向 |
|---|---|
| 最良候補を当てる確率最大化 | 序盤を観察に使う |
| 採用者の順位の期待値最小化 | 早めの採用もあり得る |
| 上位 $q$% 以内を採る確率最大化 | しきい値が変わる |
| 採用しないリスクにペナルティ | さらに早めに止める |

::note
ここはシミュレーションとの相性がよい。Reactで候補数・目的関数・しきい値を変えられると議論しやすい。
::

---
layout: default
---

# シミュレータ案

秘書問題の可視化では、次を動かせるとよい。

| パラメータ | 例 |
|---|---|
| 候補者数 | $n=10,50,100,1000$ |
| 戦略 | $r$ 人見送り、その後の暫定1位 |
| 目的関数 | 最良採用率、平均順位、上位率 |
| 試行回数 | 1,000 / 10,000 / 100,000 |

出力:

- しきい値 $r$ ごとの成功率
- 目的関数ごとの最適 $r$
- 古典的 $n/e$ 戦略との比較

---
layout: section
---

# 6. まとめ

---
layout: default
---

# 全体像

::flow
- 測度論
- 確率空間
- 確率変数
- 分布
- 収束
- 確率過程
- 応用
::

今日の主眼は、個々の定理を証明し切ることではなく、測度論の言葉が確率論のどこで効くかを見えるようにすること。

---
layout: default
---

# 次に深掘りするなら

候補は3方向。

1. 収束定理を丁寧にやる  
   Borel-Cantelli、強法則、特性関数、中心極限定理

2. 確率過程へ進む  
   filtrations、停止時刻、マルチンゲール、ブラウン運動

3. 応用へ進む  
   ブラックショールズ、最適停止、秘書問題シミュレータ

::note
参加者の関心が物理・生物寄りなら、拡散過程やブラウン運動を厚めにするのも自然。
::

---
layout: default
---

# 参考文献

- 熊谷隆『確率論』
- 舟木直久『確率微分方程式』
- 既存メモ: `work/kakuritsubibun01.tex`

::note
本資料は勉強会用の導入資料として構成した。厳密な証明は必要に応じて補助ノートに分ける。
::

---
layout: end
---

# おしまい

議論したいところ:

- 一回完結にするか、複数回シリーズにするか
- ブラックショールズをどこまで厚くするか
- 秘書問題シミュレータを別プロジェクトにするか
