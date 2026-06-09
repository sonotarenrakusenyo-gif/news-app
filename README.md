# 今日のマイニュース

選んだXアカウントの最新投稿を自動取得し、Geminiで小学生向けの解説を付けて、ジャンル別に表示する個人用ニュースアプリです。

## 機能

- ジャンル登録（AI / 政治 / 経済 など）
- 各ジャンルにXアカウントを追加
- 1日4回の自動取得（8時・12時・18時・22時）
- 小学生向けのやさしい解説を自動生成
- 「今日のマイニュース」画面でジャンル別に閲覧
- Vercel + GitHub でデプロイ、スマホのホーム画面に追加可能

## データ取得について

X APIは使わず、**FxTwitter API**（無料・APIキー不要）で投稿を取得します。  
個人利用・8アカウント程度なら、追加料金なしで運用できます。

## セットアップ

### 1. 依存関係のインストール

```bash
cd my-news-app
npm install
```

### 2. 環境変数

`.env.local` を作成します。

```bash
cp .env.example .env.local
```

| 変数名 | 説明 |
|--------|------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) で取得 |
| `CRON_SECRET` | Cron認証用のランダム文字列（本番必須） |

### 3. フォローするアカウントを設定

`src/lib/sources.ts` を編集して、ジャンルとXアカウント（@なし）を設定します。

```typescript
export const genres: Genre[] = [
  {
    id: "ai",
    name: "AI",
    accounts: ["ylecun", "sama"],
  },
  // ...
];
```

### 4. ローカルで起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、「今すぐ更新」で新着を取得できます。

## Vercel へのデプロイ

### 1. GitHub に push

```bash
git remote add origin https://github.com/<ユーザー名>/my-news-app.git
git push -u origin main
```

### 2. Vercel に接続

1. [vercel.com](https://vercel.com) で **Add New → Project**
2. GitHub リポジトリを Import
3. **Environment Variables** に以下を追加:
   - `GEMINI_API_KEY`
   - `CRON_SECRET`
4. **Storage → Blob** を有効化（本番のデータ保存用）
5. Deploy

Blob を有効にすると `BLOB_READ_WRITE_TOKEN` が自動設定され、取得したニュースが永続化されます。

### 3. Cron の確認

`vercel.json` で1日4回の自動取得が設定済みです。  
Vercel ダッシュボードの **Cron Jobs** タブで実行状況を確認できます。

## スマホのホーム画面に追加

1. Vercel の URL をスマホのブラウザで開く
2. **共有 → ホーム画面に追加**（iPhone）
3. アプリのように起動できます

## 手動で新着を取得

画面上の「今すぐ更新」ボタン、または API を直接叩きます。

```bash
curl -X POST http://localhost:3000/api/fetch
```

## 将来 X API に切り替える場合

`src/lib/fetcher.ts` を差し替えるだけで、UI や Gemini 処理はそのまま使えます。

## 技術スタック

- Next.js 16 (App Router)
- Tailwind CSS
- Gemini API（要約）
- FxTwitter API（投稿取得・無料）
- Vercel Blob（本番ストレージ）
- Vercel Cron（定期実行）
