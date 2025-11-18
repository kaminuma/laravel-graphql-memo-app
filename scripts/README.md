# 📘 仕様書自動生成ツール - セットアップガイド

## 🎯 概要

このツールは、laravel-graphql-memo-app のコードベースから自動で階層構造の仕様書を生成し、
Notion API を通じて整理された Notion ページとして公開します。

**Phase 1.5: 階層構造版**

- 📊 Query 仕様
- ✏️ Mutation 仕様
- 🧱 型定義

各 API・型が個別ページになり、見やすい構造で管理できます。

---

## 📋 前提条件

- Python 3.11 以上
- Gemini API キー（無料）
- Notion Integration（無料）

---

## 🚀 クイックスタート

### 1️⃣ Python 仮想環境のセットアップ

```bash
# プロジェクトルートに移動
cd laravel-graphql-memo-app

# 仮想環境作成
python3 -m venv venv

# 仮想環境有効化
source venv/bin/activate

# 依存パッケージインストール
pip install -r scripts/requirements.txt
```

### 2️⃣ Gemini API キーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. 「Create API Key」をクリック
3. API キーをコピー（`AIza...` で始まる文字列）

### 3️⃣ Notion Integration の作成

1. [Notion Integrations](https://www.notion.so/my-integrations) にアクセス
2. 「+ New integration」をクリック
3. 設定:
   - Name: `laravel-graphql-spec-generator`（任意の名前でOK）
   - Associated workspace: 自分のワークスペースを選択
   - Capabilities:
     - ✅ Read content
     - ✅ Update content
     - ✅ Insert content
4. 「Submit」をクリック
5. **Internal Integration Token** をコピー（`ntn_...` または `secret_...` で始まる文字列）

### 4️⃣ Notion 親ページの作成と ID 取得

1. Notion で新しいページを作成（例: 「📚 仕様書」）
2. 右上の「...」→「接続」→ 作成したIntegrationを追加
3. ページ URL から ID を抽出:
   ```
   https://www.notion.so/Your-Page-12345678901234567890abcd
                                    ^^^^^^^^^^^^^^^^^^^^^^^^
                                    これがPage ID（32文字）
   ```

### 5️⃣ 環境変数の設定

```bash
# .envファイルを作成（プロジェクトルート）
cp .env.example .env

# .envを編集
vim .env  # または code .env
```

以下を設定:

```bash
# Gemini API
GEMINI_API_KEY=AIza_your_actual_api_key_here

# Notion API
NOTION_TOKEN=ntn_your_actual_notion_token_here
NOTION_PARENT_PAGE_ID=12345678901234567890abcd
```

### 6️⃣ 仕様書生成 → Notion アップロード

```bash
# 仮想環境有効化（まだの場合）
source venv/bin/activate

# ステップ1: 構造化仕様書を生成
python scripts/generate_spec_structured.py

# ステップ2: Notionに階層構造でアップロード
python scripts/upload_to_notion_structured.py
```

**結果:**

```
API仕様書📕 (親ページ)
├── 📊 Query仕様 (子ページ)
│   ├── todos (孫ページ)
│   ├── categories (孫ページ)
│   └── me (孫ページ)
├── ✏️ Mutation仕様 (子ページ)
│   ├── createTodo (孫ページ)
│   ├── updateTodo (孫ページ)
│   └── login (孫ページ)
└── 🧱 型定義 (子ページ)
    ├── Todo (孫ページ)
    ├── Category (孫ページ)
    └── User (孫ページ)
```

---

## 📝 使い方

### コマンド

```bash
# 仮想環境有効化
source venv/bin/activate

# 仕様書生成
python scripts/generate_spec_structured.py

# Notionにアップロード
python scripts/upload_to_notion_structured.py
```

---

## 📂 生成されるファイル

```
laravel-graphql-memo-app/
├── specs/
│   └── api_spec_structured.json  # 構造化仕様書（JSON）
└── venv/                         # Python仮想環境
```

---

## 🔍 トラブルシューティング

### エラー: `GEMINI_API_KEY が設定されていません`

**原因:** 環境変数が読み込まれていない

**解決策:**

```bash
# .envファイルが存在するか確認
ls -la .env

# .envファイルに正しく記載されているか確認
cat .env | grep GEMINI_API_KEY
```

---

### エラー: `NOTION_TOKEN が設定されていません`

**原因:** Notion Integration Token が設定されていない

**解決策:**

1. [Notion Integrations](https://www.notion.so/my-integrations) で作成した Integration の Token を確認
2. `.env`ファイルに正しく記載されているか確認
3. Token は `ntn_` または `secret_` で始まる

---

### エラー: `externally-managed-environment`

**原因:** Python 3.13 以降のシステム保護

**解決策:**

```bash
# 仮想環境を作成して使用
python3 -m venv venv
source venv/bin/activate
pip install -r scripts/requirements.txt
```

---

### Notion ページ作成に失敗

**原因:** 親ページに Integration が接続されていない

**解決策:**

1. Notion で親ページを開く
2. 右上の「...」→「接続」
3. `laravel-graphql-spec-generator` を追加
4. 再度スクリプトを実行

---

## 🎨 出力例

### 生成される JSON 構造

```json
{
  "title": "API仕様書",
  "children": [
    {
      "title": "📊 Query仕様",
      "type": "page",
      "children": [
        {
          "title": "todos",
          "type": "page",
          "content": {
            "summary": "Todo一覧を取得するクエリです。",
            "arguments": [...],
            "returns": "[Todo!]!",
            "security": [...],
            "example": "..."
          }
        }
      ]
    }
  ]
}
```

### Notion ページ

- ✅ 見出し（H1, H2, H3）が階層構造
- ✅ コードブロックがシンタックスハイライト
- ✅ テーブルが見やすく表示
- ✅ 各 API・型が個別ページ

---

## 🔄 次のステップ

Phase 1.5 が完成したら、次は：

1. **データモデル仕様書追加** - Eloquent モデルの仕様書
2. **GitHub Actions 連携** - main ブランチ push で自動更新
3. **差分更新機能** - 既存ページの差分更新

---

## 💡 Tips

### 仕様書を再生成したい場合

```bash
# 1. Notionで古いページを削除
# 2. 再生成
source venv/bin/activate
python scripts/generate_spec_structured.py
python scripts/upload_to_notion_structured.py
```

### 仮想環境を再作成したい場合

```bash
# 既存の仮想環境を削除
rm -rf venv

# 新規作成
python3 -m venv venv
source venv/bin/activate
pip install -r scripts/requirements.txt
```

---

## 📞 サポート

問題が解決しない場合は、以下の情報と共に報告してください：

- Python バージョン: `python3 --version`
- エラーメッセージ全文
- `.env` ファイルの内容（トークンは隠す）

---

## 📄 ライセンス

MIT License
