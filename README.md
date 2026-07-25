# Crimson Moon Diary (2000年代初頭風レトロ個人日記サイト)

2000年代初頭の日本の「個人テキストサイト / 個人日記」の雰囲気を再現した純粋な HTML / CSS / JavaScript の静的Webサイトです。

## 特徴・デザイン
- **黒背景 ＆ 蛍光色テキスト**: ネオンカラー（蛍光緑・ピンク・シアン・イエロー）
- **1px枠線 ＆ テーブルレイアウト**: `<table>` と `1px solid` の伝統的レイアウト
- **アクセスカウンター**: 7セグデジタル風デザイン ＆ `localStorage` による訪問カウント
- **Web拍手機能**: ポップアップメッセージと拍手カウント
- **リアルタイム時計 ＆ おみくじ機能**: レトロなラッキーアイテム占い
- **当時のネット表現**: （笑）、（爆）、（マテ、<s>打消し線</s>、小文字、BGM表示、キリ番報告など
- **ビルド・フレームワーク不要**: 静的ファイル（HTML/CSS/JS）のみで動作し、GitHub Pages などの静的ホスティングに即デプロイ可能

---

## 🚀 GitHub Pages へのデプロイ手順

このコードを GitHub Pages に公開する手順は以下の通りです。

### 手順 1: GitHub で新しいリポジトリを作成
1. GitHub にログインし、[New Repository] をクリックします。
2. リポジトリ名を入力します（例: `retro-diary` または `<your-username>.github.io`）。
3. 「Public」を選択して [Create repository] を作成します。

### 手順 2: ローカルファイルを Git にコミットして Push
ターミナル（または Git Bash / PowerShell）でこのディレクトリを開き、以下のコマンドを実行します：

```bash
git init
git add .
git commit -m "Initial commit: 2000s style retro diary site"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
git push -u origin main
```

### 手順 3: GitHub Pages の有効化
1. GitHub のリポジトリページで **Settings** タブを開きます。
2. 左メニューの **Pages** を選択します。
3. **Build and deployment** > **Source** で `Deploy from a branch` を選択します。
4. **Branch** で `main` ブランド / `/ (root)` を選択し、**Save** をクリックします。
5. 数分後に公開 URL（例: `https://<あなたのユーザー名>.github.io/<リポジトリ名>/`）が生成され、サイトが閲覧可能になります！

---

## ファイル構成
```text
retro-diary/
├── index.html        # メインHTML (テーブルレイアウト、日記エントリー)
├── style.css         # レトロ風スタイルシート (黒背景、1px枠線、点滅など)
├── script.js         # JavaScript (時計、アクセスカウンター、Web拍手、おみくじ)
├── GEMINI.md         # プロジェクトルール
├── ai-work-logs.md   # 開発作業ログ
└── README.md         # この説明ドキュメント
```
