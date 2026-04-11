# fit-log フロントエンド

## 技術スタック

- **フレームワーク**: Next.js 16（App Router）
- **言語**: TypeScript
- **スタイル**: CSS Modules（Tailwind CSS は使用しない）
- **パッケージマネージャー**: pnpm

## 開発コマンド

```bash
pnpm dev                    # 開発サーバー起動
pnpm build                  # ビルド
pnpm lint                   # ESLint
pnpm exec tsc --noEmit      # 型チェック
```

## コーディング規約

### Next.js
- **App Router** を使用する（Pages Router は使用しない）
- `"use client"` は状態管理・イベントハンドラが必要な場合のみ付与する（サーバーコンポーネントを優先）

### TypeScript
- `any` 型は使用しない
- バックエンド API の URL は必ず `process.env.NEXT_PUBLIC_API_URL` から取得する

### CSS
- スタイルは **CSS Modules** のみ使用する（Tailwind・styled-components・emotion は使用しない）
- CSS Modules ファイルはコンポーネントと同じディレクトリに置く（例: `Button.module.css`）

## ディレクトリ構成方針

- ページは `src/app/` 配下に配置する
- コンポーネントは `src/components/` 配下に配置する

## 認証

- Laravel Sanctum による Cookie 認証を使用する
- トークンはローカルストレージに保存しない

## Next.js に関する注意

このプロジェクトは Next.js 16 を使用しています。過去のバージョンとは API・規約・ファイル構成が異なる場合があります。コードを書く前に `node_modules/next/dist/docs/` を参照し、非推奨の API は使用しないこと。

## ブランチ戦略

| ブランチ | 用途 |
|---------|------|
| `main` | 本番リリース |
| `develop` | 開発統合 |
| `feature/xxx` | 機能開発 |
| `hotfix/xxx` | 本番緊急修正 |

## コミット規約

Conventional Commits に従う:

| プレフィックス | 用途 |
|-------------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメント |
| `chore` | 雑務・設定変更 |
| `ci` | CI/CD |
| `refactor` | リファクタリング |
| `test` | テスト |
