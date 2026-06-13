---
name: local-review
description: 手動で実行: 現在の未コミット変更（デフォルトはステージ済み、必要に応じて未ステージも含む）をコード品質・パフォーマンス・セキュリティ・プロジェクト規約の観点で静的レビューし、型チェックと Lint の結果も併せて報告する
user-invocable: true
disable-model-invocation: true
allowed-tools: Bash Read Grep
---

## 手順

1. `git status` で変更ファイル一覧を把握する
2. `git diff --cached` を取得する（未ステージも含めたい場合は `git diff HEAD`）
3. 必要に応じて、変更ファイルの周辺コード（呼び出し元・関連コンポーネント等）を `Read` で確認し、文脈を踏まえてレビューする
4. 変更ファイルに `.ts` / `.tsx` / `.js` / `.jsx` が含まれる場合のみ、`pnpm exec tsc --noEmit` を実行し型エラーの有無を確認する。失敗してもレビュー観点のチェックは継続し、失敗内容は出力に含める
5. 変更ファイルに `.ts` / `.tsx` / `.js` / `.jsx` が含まれる場合のみ、`pnpm lint` を実行し Lint エラーの有無を確認する。失敗してもレビュー観点のチェックは継続し、失敗内容は出力に含める
6. 以下の「レビュー観点」に沿って静的レビューを行う。型チェック・Lint を実行した場合はその結果も出力に含める

## レビュー観点

### 1. コード品質
- 可読性・命名の適切さ
- 単一責任の原則に違反していないか
- 重複コードがないか
- エラーハンドリングが適切か

### 2. 効率性・パフォーマンス
- 不要な再レンダリングが発生していないか
- 不要なAPI呼び出しがないか
- `useEffect` の依存配列が適切か
- コンポーネントの分割粒度が適切か

### 3. 言語・フレームワークのバージョン適合性
- TypeScript: `any` の使用や暗黙の `any` がないか
- TypeScript: 型アサーション (`as`) の濫用がないか
- TypeScript: ローカル変数や明確な初期値を持つ `useState` など、推論で十分な箇所に冗長な型注釈を書いていないか
    - 関数の引数や `null` 初期値の `useState` など推論できない箇所は明示する
    - 関数の戻り値型は省略可能だが、意図的に明示する場合は許容（冗長と判定しない）
- Next.js 16（App Router）: ファイル名規約（`page.tsx` / `layout.tsx` / `route.ts` 等）に沿っているか
- Next.js 16: `params` / `searchParams` は `Promise` 化されているため `await`（または `use()`）で展開しているか（Next.js 15 以前の同期アクセスは不可）。同様に `cookies()` / `headers()` も非同期になっている
- Next.js 16: `middleware.ts` は非推奨で `proxy.ts` に改名されている。新規・既存とも `proxy.ts` を使っているか
- Next.js 16: Server Components 優先で `"use client"` が最小の葉に限定されているか
- Next.js 16: バックエンドは Laravel に集約する方針。データ取得・mutation のために Next.js 側に独自 API ルート（`route.ts`）を生やしていないか（クライアントから Laravel API を直接呼ぶ）
- Next.js 16: 生 `<img>` / `<a>` ではなく `<Image>` / `<Link>` を使っているか
- Next.js 16: `metadata` / `generateMetadata` で SEO 対応しているか（ページ単位で適切に設定されているか）
- Next.js 16: `loading.tsx` / `error.tsx` / `not-found.tsx` が必要なルートに配置されているか
- Next.js 16: `cache` / `revalidate` / `dynamic` の指定が用途に合っているか
- React 19 の非推奨APIを使用していないか

### 4. プロジェクト規約遵守（CLAUDE.md）
- CSS: CSS Modules のみ使用しているか（Tailwind / styled-components / emotion が混入していないか）
- 認証トークン保存場所: `localStorage` / `sessionStorage` に保存していないか（Laravel Sanctum の Cookie 認証を使用）
- API URL: バックエンド API の URL を `process.env.NEXT_PUBLIC_API_URL` から取得しているか（URL のハードコードがないか）
- Pages Router 不使用: `pages/` ディレクトリや Pages Router 固有の API を使っていないか

### 5. セキュリティ
- XSS脆弱性がないか（`dangerouslySetInnerHTML` 等）
- Sanctum Cookie 認証の前提が守られているか（フロント側で検出可能な範囲）:
    - API を叩く `fetch` に `credentials: "include"` が付いているか（Cookie 送信に必須）
    - mutation 前に `/sanctum/csrf-cookie` を取得し、CSRF トークンを送信するフローになっているか
    - API URL が HTTPS（本番）か。`http://` をハードコードしていないか
    - ※ Cookie の `HttpOnly` / `Secure` / `SameSite` 属性は Laravel 側で付与するためフロントのレビュー対象外
- 環境変数の使い方が適切か（秘匿情報を `NEXT_PUBLIC_` プレフィックスで露出していないか）

### 6. バグ・エッジケース
- 潜在的なバグがないか
- 境界値・異常系の考慮が漏れていないか
- ローディング・エラー状態のハンドリングが適切か

### 7. アクセシビリティ
- セマンティックHTMLを使っているか（`<button>` / `<a>` / `<nav>` 等を意味通りに）
- `<img>` に `alt` 属性が設定されているか
- フォーム要素に `<label>` が適切に関連付けられているか
- キーボード操作（Tab移動、Enter押下等）で完結する操作か

## 出力形式

各観点について、問題点と改善提案を以下のフォーマットで日本語で記載してください:

```
- [重要度] `file_path:line_number` - 問題の概要
  改善提案: ...
```

重要度ラベル:
- critical: 必ず修正すべき（バグ・セキュリティ・規約違反）
- warning: 修正を推奨（パフォーマンス・可読性・保守性）
- suggestion: 検討の余地あり（スタイル・命名等）

問題がない観点は「✅ 問題なし」と記載してください。

レビュー観点とは別に、最後に「動作確認の推奨範囲」として以下を列挙してください:
- UI に影響する変更があれば、確認すべき画面・操作
- 副作用が大きい変更（共通コンポーネント・グローバル状態・認証フロー等）があれば、デグレード確認が必要な範囲
- いずれもなければ「動作確認の推奨範囲: なし」
