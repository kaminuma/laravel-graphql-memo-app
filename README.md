# ✨ Laravel + GraphQL + React (Material UI) TODO アプリ 📝

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

## 🚀 概要

このプロジェクトは、Laravel（バックエンド）・GraphQL API・React（Material UI, TypeScript）によるモダンな TODO アプリです。

---

## 💡 このプロジェクトについて

このアプリは「**みんなでオープンに開発する**」ことを目的に作成しています。  
もともとはバイブコーディングで作成した機能をベースに、今後もどんどん新しい機能を追加していく予定です。

💬 誰でも気軽に Issue や Pull Request を送ってください！  
📦 ある程度の機能が揃った段階で正式リリースを予定しています。

みなさんのご参加・ご貢献をお待ちしています！

- 🔧 バックエンド: Laravel + rebing/graphql-laravel
- 🎨 フロントエンド: React + TypeScript + Material UI + Apollo Client
- 🗄️ DB: MySQL（Docker コンテナ）

---

## 📦 必要なもの

- 🐳 Docker / Docker Compose
- 🟢 Node.js（開発時のみ、Docker 内で完結も可）
- 🧰 Git

---

## ⚙️ セットアップ手順

1. **📥 リポジトリをクローン**
   ```bash
   git clone <このリポジトリのURL>
   cd laravel-graphql-memo-app
   以下は、絵文字付きで装飾された `README.md` の後半部分（手順・起動方法・テスト・Contributors）をマークダウン形式で再構成したものです。元の構成は変えず、絵文字のみ追加しています。
   ```

---

## 🛠️ セットアップ手順（続き）

### 🔐 環境変数の設定

```bash
cp .env.example .env
cp server/.env.example server/.env
```

※ 必要に応じて `.env` を編集してください。

**フロントエンドの環境変数（オプション）:**

Docker 環境ではデフォルト設定で動作しますが、ローカル開発時に API URL を変更する場合は以下を実行してください。

```bash
cp frontend/.env.example frontend/.env.local
# frontend/.env.local を編集して REACT_APP_API_URL を設定
```

> 📖 詳細は「[API 接続先（REACT_APP_API_URL）の切り替え方法](#-api-接続先react_app_api_urlの切り替え方法)」セクションを参照してください。

### 📦 Docker コンテナの起動

```bash
docker-compose up -d
```

### 📦 バックエンド依存インストール（初回のみ）

```bash
docker-compose exec backend composer install
```

### 🔑 アプリケーションキー生成（初回のみ）

```bash
docker-compose exec backend php artisan key:generate
```

### 📁 必要に応じて以下も実行

```bash
docker-compose exec backend php artisan config:cache
```

### 🗃️ DB マイグレーション・シーディング（初回のみ）

```bash
docker-compose exec backend php artisan migrate --seed
```

### 🧩 フロントエンド依存インストール（初回のみ）

```bash
docker-compose exec frontend npm install
```

---

## ▶️ 起動方法

- 🔌 **バックエンド API**: [http://localhost:8000/graphql](http://localhost:8000/graphql)
- 🖥️ **フロントエンド**: [http://localhost:3000](http://localhost:3000)

---

## 🔄 API 接続先（REACT_APP_API_URL）の切り替え方法

フロントエンドの GraphQL API 接続先は環境変数 `REACT_APP_API_URL` で設定できます。

### Docker 環境で使用する場合（デフォルト）

`docker-compose.yml` に設定されているため、特別な設定は不要です。

```yaml
# docker-compose.yml で自動的に設定されます
environment:
  - REACT_APP_API_URL=http://localhost:8000/graphql
```

### ローカル開発環境で API URL を変更する場合

フロントエンドディレクトリに `.env.local` ファイルを作成して設定します。

```bash
# フロントエンドディレクトリに移動
cd frontend

# .env.example をコピー
cp .env.example .env.local

# .env.local を編集してAPI URLを設定
# 例: REACT_APP_API_URL=http://localhost:8000/graphql
```

### 本番環境で使用する場合

本番環境のビルド時に環境変数を設定するか、`.env.production` ファイルを作成します。

```bash
# frontend/.env.production
REACT_APP_API_URL=https://your-production-domain.com/graphql
```

### package.json の scripts で API URL を指定する方法

`package.json` の `scripts` セクションで直接指定することもできます。

```json
{
  "scripts": {
    "start": "REACT_APP_API_URL=http://localhost:8000/graphql react-scripts start",
    "start:prod": "REACT_APP_API_URL=https://api.example.com/graphql react-scripts start"
  }
}
```

> 💡 **ヒント**
> - `.env.local` ファイルは `.gitignore` に含まれているため、リポジトリにコミットされません
> - 環境変数の優先順位: `.env.local` > `.env` > `docker-compose.yml` の environment
> - React アプリでは `REACT_APP_` で始まる環境変数のみが使用できます

---

## 🛠️ MySQL 接続情報（外部ツール用）

- **Host**: `localhost`
- **Port**: `3306`
- **User**: `todo_user`
- **Password**: `todo_password`
- **Database**: `todo_app`

💡 `.env` ファイルで `DB_HOST_PORT` を変更することでポート競合回避が可能です。

例：`.env` に `DB_HOST_PORT=13306` と設定すれば、`localhost:13306` で MySQL に接続できます。

---

## 🧪 テスト実行方法

### 🎨 フロントエンド単体テスト

```bash
cd frontend
npm test
```

### 🧩 E2E テスト（Cypress）

```bash
# フロントエンドディレクトリに移動
cd frontend

# Cypressを開発モードで実行（GUIあり）
npm run cypress:open

# または、コマンドライン実行（ヘッドレスモード）
npm run cypress:run
```

### 🔧 バックエンド（Laravel）

```bash
cd server
./vendor/bin/phpunit
# または
php artisan test
```

---

## 📝 その他

📚 詳細な開発手順やコマンドは `docs/SETUP.md` を参照してください。
❓ 不明点・トラブルは issue または README 末尾に追記してください。

---

## 📕 AI 仕様書自動生成システム

このプロジェクトでは、AI を活用した仕様書の自動生成・更新の仕組みを構築しています。
現在は GraphQL API 仕様書の生成に対応しており、今後はデータベース設計書やテストケースなど、様々な仕様書を自動生成する予定です。

### 🎯 現在の機能（Phase 1.5）

- **GraphQL API 仕様書の自動生成**: スキーマファイル（`.graphql`）を Gemini AI で解析
- **階層構造での整理**: Query/Mutation/Type 別に分類された読みやすい構造
- **Notion 連携**: 階層構造で Notion ワークスペースに自動アップロード

### 🚀 使い方

```bash
# 1. Python仮想環境のセットアップ（初回のみ）
cd scripts
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. 環境変数設定（初回のみ）
# .envファイルに以下を設定:
# - GEMINI_API_KEY (Google AI Studio から取得)
# - NOTION_TOKEN (Notion Integration から取得)
# - NOTION_PARENT_PAGE_ID (Notion親ページID)

# 3. 仕様書生成・アップロード
python generate_spec_structured.py
python upload_to_notion_structured.py
```

### 📊 生成される構造イメージ

```
仕様書📕
├── 📊 Query仕様
│   ├── todos, categories, user, todo, me
├── ✏️ Mutation仕様
│   ├── createTodo, updateTodo, deleteTodo
│   ├── createCategory, updateCategory, deleteCategory
│   └── login, logout, register
└── 🧱 型定義
    └── Todo, Category, User, Priority
```

詳細は [`scripts/README.md`](scripts/README.md) を参照してください。

---

## 🔧 GraphQL Codegen 活用ガイド

フロントエンドで GraphQL Code Generator を活用して型安全な開発を行います。

### セットアップ手順

このリポジトリは、GraphQL Code Generator の設定ファイル（`frontend/codegen.ts`）や `package.json` のスクリプトがすでに含まれています。

1. **依存パッケージのインストール**

```bash
cd frontend
npm install
```

2. **コード生成の実行**

```bash
# Dockerコンテナ内で実行（推奨）
docker-compose exec frontend npm run codegen

# または、ローカルで実行
cd frontend
npm run codegen
```

> ⚠️ **注意点**
> - バックエンド（Laravel）が起動している必要があります
> - Docker環境では `http://backend:8000/graphql` をエンドポイントとして使用します

3. **生成されたコードの利用例**

```typescript
import { useGetTodosQuery } from "../generated/graphql";

const { data, loading, error } = useGetTodosQuery({
  variables: {
    /* クエリ変数 */
  },
});
```

> ⚡ クローン直後は `npm install` だけで OK！設定ファイルやスクリプトの再作成は不要です。

この機能は開発の生産性向上と型の安全性確保に役立ちます。

---

## � GraphQL Codegen 設定内容メモ

> このリポジトリは、下記のように GraphQL Code Generator の設定がすでに済んでいます。

### 手動セットアップ手順（参考）

1. **必要なパッケージをインストール**

```bash
cd frontend
npm install @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo --save-dev
```

2. **設定ファイル作成例**

> 💡 **TypeScript形式の設定ファイルのメリット**
> - 型安全性: TypeScript の型チェックにより設定ミスを防止
> - エディタサポート: 自動補完やインラインドキュメントが利用可能
> - 柔軟性: プログラマティックな設定が可能

```typescript
// frontend/codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: {
    "http://backend:8000/graphql": {
      headers: {
        Accept: "application/json",
      },
    },
  },
  documents: [
    "./src/**/*.graphql",
    "./src/services/**/*.ts",
    "./src/features/**/graphql/**/*.graphql",
  ],
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        skipTypename: false,
        documentMode: "documentNode",
        dedupeFragments: true,
      },
    },
  },
};

export default config;
```

> ⚡ Docker環境では `backend:8000` でGraphQLエンドポイントに接続します。
> ローカル環境では `localhost:8000` に変更してください。

3. **package.json にスクリプト追加例**

```json
"scripts": {
  "codegen": "graphql-codegen --config codegen.ts"
}
```

---

## test1

## �👥 Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore-start -->

<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/Arnesh-pal">
          <img src="https://avatars.githubusercontent.com/u/144382300?v=4?s=100" width="100px;" alt="Arnesh Pal"/><br />
          <sub><b>Arnesh Pal</b></sub>
        </a><br />
        <a href="https://github.com/kaminuma/laravel-graphql-memo-app/commits?author=Arnesh-pal" title="Documentation">📖</a>
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/emilythedev">
          <img src="https://avatars.githubusercontent.com/u/140520093?v=4?s=100" width="100px;" alt="emilythedev"/><br />
          <sub><b>emilythedev</b></sub>
        </a><br />
        <a href="https://github.com/kaminuma/laravel-graphql-memo-app/commits?author=emilythedev" title="Documentation">📖</a>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" colspan="7" style="font-size:13px;">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
        <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
      </td>
    </tr>
  </tfoot>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

📘 This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
💬 Contributions of any kind welcome!
