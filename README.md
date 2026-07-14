# 確率論勉強会資料

測度論・Lebesgue積分の概論講義の後に実施する、確率論勉強会用の Slidev 資料です。

メイン資料は `slides.md` にまとめています。PDF出力を前提に、アニメーション依存を避けて1ページごとに読める構成にしています。

## 前提条件

- Node.js
- pnpm

Dev Container を使う場合は、このリポジトリを VS Code で開いて `Dev Containers: Reopen in Container` を実行してください。

## セットアップ

```bash
pnpm install
```

## プレビュー

```bash
pnpm dev
```

既定では Slidev のローカルサーバーが起動します。
秘書問題の補足シミュレータも同時に `http://localhost:5174/` で起動します。

## 補足アプリ

一般化された秘書問題の最適戦略シミュレータは、独立した React/Vite
プロジェクトとして次に配置しています。

```text
supplement/secretary-simulator/
```

スライド内のリンクからポップアップで開きます。単体で起動する場合:

```bash
pnpm --dir supplement/secretary-simulator dev
```

## PDF出力

```bash
pnpm export
```

出力先:

```text
dist/probability-seminar.pdf
```

`main` に push すると GitHub Actions でもPDFを生成し、レポジトリ上では最新版のPDFを以下に配置してコミットします。

```text
export/probability-seminar.pdf
```

## GitHub Pages

`main` に push されると GitHub Actions で Slidev をビルドし、GitHub Pages に公開します。

公開 URL:

```text
https://lambda-b.github.io/self_seminar/
```

初回の Pages 設定手順は `docs/github_pages.md` を参照してください。

## 方針メモ

Slidev / LaTeX の使い分けや、40-60分想定の構成方針は `docs/slidev_plan.md` にまとめています。

## Format / Check

Biome を使います。

```bash
pnpm format
pnpm check
```

Vue ファイルの formatter も Biome に寄せています。構文ハイライトと言語機能は Volar が担当するため、色が付かない場合は Dev Container を rebuild するか、VS Code の拡張機能を reload してください。

## スライド記法

本文はできるだけ Markdown と Slidev の slot 記法で書きます。共通の見た目が必要な箇所は、MDC/Comark のブロックコンポーネントを使います。

```md
::note
ここに補足を書く。inline 数式 $X_n \to X$ も Markdown として処理されます。
::

::diagram
$(\Omega,\mathcal{F},P)$
$\xrightarrow{\quad X\quad}$
$(S,\mathcal{S},P_X)$
::
```

スタイルは `style.css` と `components/` 配下に寄せています。Slidev は UnoCSS を内蔵しているため、コンポーネント内では Tailwind 互換の utility class を使えます。
