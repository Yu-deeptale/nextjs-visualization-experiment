```markdown
# Next.js 可視化実験プロトタイプ（最小）

概要:
- Next.js + Framer Motion を使った「可視化 + アニメーション」実験プロトタイプです。
- /api/data でデモデータを返し、/api/log に POST するとローカルの `data/logs.json` に追記します（ローカル開発用）。

セットアップ（ローカル開発）:
1. Node.js (>=16) を用意します。
2. リポジトリをクローンまたはファイルを作成します。
3. 依存をインストール:
   ```bash
   npm install
   ```
4. 開発サーバーを起動:
   ```bash
   npm run dev
   ```
5. ブラウザで http://localhost:3000 を開きます。

ログの取り扱い:
- ローカルでは `data/logs.json` に追記されます（`data/` フォルダは初回起動時に作られます）。
- サーバーレス環境（Vercel 等）ではファイル書き込みが継続されないため、実運用の被験者ログ収集には Firebase / Supabase / Google Sheets / Airtable 等の外部ストレージを使ってください。

初回コミット手順（ローカルで）:
```bash
git init
git add .
git commit -m "Initial commit: Next.js visualization experiment prototype"
# GitHub に新規リポジトリを作成して push するか、gh cli を使って作成して push してください:
# gh repo create YOUR_USERNAME/nextjs-visualization-experiment --public --source=. --remote=origin --push
```

注意:
- prefers-reduced-motion に対応しています（システム設定を尊重）。
- このプロトタイプは実験の「プロトタイプ」目的で設計されています。被験者データの取り扱いは匿名化・同意取得等、倫理要件に従ってください。
```