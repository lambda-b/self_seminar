# 確率論勉強会資料

測度論・Lebesgue積分の概論講義の後に実施する、確率論勉強会用の Slidev 資料です。

メイン資料は `slides.md` にまとめています。PDF出力を前提に、アニメーション依存を避けて1ページごとに読める構成にしています。

## 前提条件

- Node.js
- npm

Dev Container を使う場合は、このリポジトリを VS Code で開いて `Dev Containers: Reopen in Container` を実行してください。

## セットアップ

```bash
npm install
```

## プレビュー

```bash
npm run dev
```

既定では Slidev のローカルサーバーが起動します。

## PDF出力

```bash
npm run export
```

出力先:

```text
dist/probability-seminar.pdf
```

## 方針メモ

Slidev / LaTeX の使い分けや、40-60分想定の構成方針は `docs/slidev_plan.md` にまとめています。
