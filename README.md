# kojikoji81 Portfolio & Diary

2000年代初頭の日本の個人テキストサイト・個人Webサイトの雰囲気を再現した、ポートフォリオ ＆ 個人日記ポータルサイトです。

## 🌐 公開 URL
- **ポートフォリオ（トップ）**: [https://kojikoji81.github.io/portfolio/](https://kojikoji81.github.io/portfolio/)
- **kojikoji81の日記（サブコンテンツ）**: [https://kojikoji81.github.io/portfolio/diary/](https://kojikoji81.github.io/portfolio/diary/)
- **GitHub リポジトリ**: [https://github.com/kojikoji81/portfolio](https://github.com/kojikoji81/portfolio)

---

## 📁 階層・ファイル構成
```text
portfolio/
├── index.html            # ポートフォリオ（トップページ）
├── style.css             # ポートフォリオ用スタイル (レトロテキストサイト風)
├── script.js             # ポートフォリオ用JS (カレンダー連携)
├── README.md             # プロジェクト説明書
└── diary/                # 日記サブディレクトリ
    ├── index.html        # 日記メインページ
    ├── style.css         # 日記用スタイル
    ├── script.js         # 日記用動的描画JS
    ├── editor.html       # 日記作成ツール
    └── posts/            # 日記データ
        ├── index.json    # 記事日付インデックス ["2026-07-25"]
        └── 2026-07-25.json
```

---

## ✍️ 日記の追加手順 (GitHub Web上から)

1. GitHub リポジトリ ([https://github.com/kojikoji81/portfolio](https://github.com/kojikoji81/portfolio)) を開きます。
2. `diary/posts/` フォルダに入り、**Add file ➔ Create new file** から `2026-07-26.json` を作成・コミットします。
   ```json
   {
     "date": "2026-07-26",
     "displayDate": "2026/07/26（日）",
     "title": "今日の日記タイトル",
     "tag": "日記",
     "content": [
       "ここに日記本文を書きます。"
     ]
   }
   ```
3. `diary/posts/index.json` を編集し、`"2026-07-26"` を追加してコミットすると、1分程度で自動反映されます。
