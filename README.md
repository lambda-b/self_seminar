## 概要

このプロジェクトは `#{projectName}` のための開発テンプレートです。
VSCode + Dev Container を前提とし、すぐに開発を開始できる環境を提供します。

## 前提条件

- Docker
- Visual Studio Code
- Dev Containers 拡張

## セットアップ

1. VSCode でこのリポジトリを開く
2. コマンドパレットから
   
   ```
   Dev Containers: Reopen in Container
   ```

3. コンテナ起動完了後、開発開始

## ディレクトリ構成

```
.
├─ .devcontainer/     # 開発用コンテナ定義
├─ src/               # アプリケーションコード
├─ README.md
└─ .gitignore
```

## 環境変数

必要に応じて `.env` ファイルを作成してください。

```
# example
APP_ENV=development
APP_PORT=3000
```
