# ChocoTore（ちょこトレ）

毎日の「ちょこっと」した運動を楽しく続けるための、**ログイン不要・完全ローカル動作・ホスティング無料**のWebアプリです。

## 特徴

- **ログイン・ユーザー情報不要**：アカウント登録や認証は一切不要。個人情報もサーバーへ送信しません。
- **JSONファイルで記録管理**：普段の記録はブラウザ（`localStorage`）に自動保存しつつ、スマホやPCに `.json` ファイルとして保存（エクスポート）・読み込み（インポート）できます。端末移行やバックアップも簡単です。
- **維持費ゼロ（静的サイト）**：GitHub Pages + GitHub Actions だけでビルドからデプロイまで無料で運用できます。

## ローカル開発

**必要なもの:** Node.js 20 以上

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動 (http://localhost:3000)
npm run dev

# リント・テスト・本番ビルドの確認
npm run lint
npm test
npm run build
```

## GitHub Pages へのデプロイ手順

このリポジトリには [.github/workflows/deploy.yml](.github/workflows/deploy.yml) が含まれており、`main` ブランチへのプッシュ時に自動でテスト・ビルド・デプロイが実行されます。

### 初回のみ必要なGitHub側の設定

1. GitHub でこのリポジトリの **Settings** → **Pages** を開く
2. **Build and deployment** の **Source** を **GitHub Actions** に変更する
3. `main` ブランチへ `git push` する（または **Actions** タブから手動実行する）

デプロイが完了すると `https://boxdate.github.io/chocotore/` で公開されます。

### デプロイ運用の練習フロー（おすすめ）

1. 作業用ブランチを作成（例: `git checkout -b feature/my-change`）
2. 変更して Pull Request を作成 → GitHub Actions が自動で `lint` / `test` / `build` を検証
3. PR を `main` にマージ → GitHub Pages へ自動デプロイ！

## 記録JSONファイルの形式

エクスポートされる `.json` ファイルの形式例です。

```json
{
  "app": "chocotore",
  "version": 1,
  "exportedAt": "2026-11-25T08:45:00.000Z",
  "currentStreakDays": 3,
  "longestStreakDays": 5,
  "lastCompletedDate": "2026-11-25T08:30:00.000Z",
  "customVideo": {
    "videoId": "dQw4w9WgXcQ",
    "youtubeUrl": "https://youtu.be/dQw4w9WgXcQ",
    "title": "My Daily Workout",
    "targetMuscle": "Custom Routine",
    "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  "logs": [
    {
      "date": "2026-11-25",
      "completedAt": "2026-11-25T08:30:00.000Z",
      "videoId": "dQw4w9WgXcQ",
      "videoTitle": "My Daily Workout"
    }
  ]
}
```
