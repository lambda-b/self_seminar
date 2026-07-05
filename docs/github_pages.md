# GitHub Pages 公開手順

このリポジトリでは `main` に push されたタイミングで GitHub Actions が Slidev をビルドし、`dist/` を GitHub Pages にデプロイします。

公開 URL は通常、次の形式になります。

```text
https://lambda-b.github.io/self_seminar/
```

## 初回の Pages 設定

GitHub Pages の公開元を GitHub Actions に設定します。これは初回だけ実行すればよい設定です。

```bash
gh api \
  --method POST \
  repos/lambda-b/self_seminar/pages \
  -f build_type=workflow
```

すでに Pages が有効化済みで、公開元だけを GitHub Actions に揃える場合は次を実行します。

```bash
gh api \
  --method PUT \
  repos/lambda-b/self_seminar/pages \
  -f build_type=workflow
```

設定確認:

```bash
gh api repos/lambda-b/self_seminar/pages
```

## IaC として残す場合

GitHub Pages の有効化設定は `.github/workflows/*.yml` だけでは完全には表現できません。Actions workflow は「Pages に何をデプロイするか」をコード化できますが、「リポジトリの Pages 機能を有効化し、公開元を Actions にする」設定は GitHub API 側のリポジトリ設定です。

IaC として厳密に管理したい場合は Terraform の GitHub provider を使い、`github_repository_pages` resource で管理するのが分かりやすいです。軽量に運用するなら、このドキュメントの `gh api` コマンドを初回セットアップ手順として残す形で十分です。
