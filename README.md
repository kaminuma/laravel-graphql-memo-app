# ✨ Laravel + GraphQL + React (Material UI) TODOアプリ 📝

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

## 🚀 概要

このプロジェクトは、Laravel（バックエンド）・GraphQL API・React（Material UI, TypeScript）によるモダンなTODOアプリです。

---

## 💡 このプロジェクトについて

このアプリは「**みんなでオープンに開発する**」ことを目的に作成しています。  
もともとはバイブコーディングで作成した機能をベースに、今後もどんどん新しい機能を追加していく予定です。

💬 誰でも気軽にIssueやPull Requestを送ってください！  
📦 ある程度の機能が揃った段階で正式リリースを予定しています。

みなさんのご参加・ご貢献をお待ちしています！

- 🔧 バックエンド: Laravel + rebing/graphql-laravel  
- 🎨 フロントエンド: React + TypeScript + Material UI + Apollo Client  
- 🗄️ DB: MySQL（Dockerコンテナ）

---

## 📦 必要なもの

- 🐳 Docker / Docker Compose  
- 🟢 Node.js（開発時のみ、Docker内で完結も可）  
- 🧰 Git

---

## ⚙️ セットアップ手順

1. **📥 リポジトリをクローン**
   ```bash
   git clone <このリポジトリのURL>
   cd laravel-graphql-memo-app
以下は、絵文字付きで装飾された `README.md` の後半部分（手順・起動方法・テスト・Contributors）をマークダウン形式で再構成したものです。元の構成は変えず、絵文字のみ追加しています。

---

## 🛠️ セットアップ手順（続き）

### 🔐 環境変数の設定

```bash
cp .env.example .env
cp server/.env.example server/.env
```

※ 必要に応じて `.env` を編集してください。

### 📦 Dockerコンテナの起動

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

### 🗃️ DBマイグレーション・シーディング（初回のみ）

```bash
docker-compose exec backend php artisan migrate --seed
```

### 🧩 フロントエンド依存インストール（初回のみ）

```bash
docker-compose exec frontend npm install
```

---

## ▶️ 起動方法

* 🔌 **バックエンドAPI**: [http://localhost:8000/graphql](http://localhost:8000/graphql)
* 🖥️ **フロントエンド**: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ MySQL接続情報（外部ツール用）

* **Host**: `localhost`
* **Port**: `3306`
* **User**: `todo_user`
* **Password**: `todo_password`
* **Database**: `todo_app`

💡 `.env` ファイルで `DB_HOST_PORT` を変更することでポート競合回避が可能です。

例：`.env` に `DB_HOST_PORT=13306` と設定すれば、`localhost:13306` でMySQLに接続できます。

---

## 🧪 テスト実行方法

### 🎨 フロントエンド単体テスト

```bash
cd frontend
npm test
```

### 🧩 E2Eテスト（Cypress）

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

## 🔧 GraphQL Codegen 活用ガイド

フロントエンドでGraphQL Code Generatorを活用して型安全な開発を行います。


### セットアップ手順

このリポジトリは、GraphQL Code Generator の設定ファイル（`codegen.yml`）や `package.json` のスクリプトがすでに含まれています。

1. **依存パッケージのインストール**
```bash
cd frontend
npm install
```

2. **コード生成の実行**
```bash
npm run codegen
```

3. **生成されたコードの利用例**
```typescript
import { useGetTodosQuery } from '../generated/graphql';

const { data, loading, error } = useGetTodosQuery({
  variables: { /* クエリ変数 */ }
});
```

> ⚡ クローン直後は `npm install` だけでOK！設定ファイルやスクリプトの再作成は不要です。

この機能は開発の生産性向上と型の安全性確保に役立ちます。

---

## � GraphQL Codegen 設定内容メモ

> このリポジトリは、下記のようにGraphQL Code Generatorの設定がすでに済んでいます。

### 手動セットアップ手順（参考）

1. **必要なパッケージをインストール**
```bash
cd frontend
npm install @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo --save-dev
```

2. **設定ファイル作成例**
```yaml
# frontend/codegen.yml
schema:
  - 'http://localhost:8000/graphql':
      headers:
        Accept: 'application/json'
documents:
  - './src/services/**/*.ts'
  - './src/graphql/**/*.graphql'
generates:
  src/generated/graphql.tsx:
    plugins:
      - 'typescript'
      - 'typescript-operations'
      - 'typescript-react-apollo'
    config:
      withHooks: true
      withComponent: false
      withHOC: false
```

3. **package.jsonにスクリプト追加例**
```json
"scripts": {
  "codegen": "graphql-codegen --config codegen.yml"
}
```

---

---

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
