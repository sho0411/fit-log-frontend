# fit-log フロントエンド

体重・食事・運動を記録して目標を達成するアプリ「fit-log」のフロントエンドです。

## 技術スタック

- **フレームワーク**: Next.js 16
- **言語**: TypeScript
- **スタイル**: CSS Modules
- **パッケージマネージャー**: pnpm

## 関連リポジトリ

- バックエンド: [fit-log-backend](https://github.com/sho0411/fit-log-backend)

## 必要な環境

- Node.js 22以上
- pnpm 10以上

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/sho0411/fit-log-frontend.git
cd fit-log-frontend

# 依存パッケージをインストール
pnpm install

# 環境変数ファイルを作成
cp .env.example .env.local
```

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# Lint
pnpm lint
```

## 環境変数

| 変数名 | 説明 |
|-------|------|
| `NEXT_PUBLIC_API_URL` | バックエンドAPIのURL |

## ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番リリース用 |
| `develop` | 開発統合ブランチ |
| `feature/xxx` | 機能開発用 |
| `hotfix/xxx` | 本番緊急修正用 |
