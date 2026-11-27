# ChocoTore（ちょこトレ）

毎日の「ちょこっと」した運動を楽しく続けるための、**ログイン不要・完全ローカル動作**のトレーニング習慣化アプリです。

👉 **[今すぐちょこトレを使う（https://boxdate.github.io/chocotore/）](https://boxdate.github.io/chocotore/)**

アカウント登録やパスワード設定は一切不要。ブラウザを開いて YouTube 動画を 1 つ登録するだけで、すぐに毎日のトレーニングを始められます。

---

## 使い方

1. 上のリンクからアプリを開く（スマホ・PC どちらでも利用できます）
2. 毎日続けたい YouTube 動画の URL を登録する
3. 動画を見ながら運動し、終わったら「完了！」を押してストリーク（連続日数）を記録する
4. 必要に応じて「JSONファイルに保存」から記録ファイルをダウンロードし、端末の移行やバックアップに使う

## 特徴

- **ログイン・ユーザー情報不要**：氏名やメールアドレスなどの個人情報は一切取得・送信しません。
- **JSONファイルで記録管理**：普段の記録はブラウザ（`localStorage`）に自動保存しつつ、いつでも `.json` ファイルとして保存（エクスポート）・読み込み（インポート）ができます。スマホと PC 間のデータ移行も簡単です。
- **維持費ゼロの静的サイト構成**：フロントエンドのみで完結しており、GitHub Pages 上で無料公開されています。

<details>
<summary>保存される JSON ファイルの形式例</summary>

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

</details>

---

## 開発者向け情報

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

### 自動テスト・デプロイ（GitHub Actions）

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) により、`main` ブランチへのプッシュや Pull Request 時に自動で `lint` / `test` / `build` が実行され、`main` 更新時に GitHub Pages へ自動デプロイされます。
