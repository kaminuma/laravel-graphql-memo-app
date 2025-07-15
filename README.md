# Laravel + GraphQL + React (Material UI) TODOアプリ

## 概要

このプロジェクトは、Laravel（バックエンド）・GraphQL API・React（Material UI, TypeScript）によるモダンなTODOアプリです。

- バックエンド: Laravel + rebing/graphql-laravel
- フロントエンド: React + TypeScript + Material UI + Apollo Client
- DB: MySQL（Dockerコンテナ）

---

## 必要なもの

- Docker / Docker Compose
- Node.js（開発時のみ、Docker内で完結も可）
- Git

---

## セットアップ手順

1. **リポジトリをクローン**
   ```bash
   git clone <このリポジトリのURL>
   cd laravel-graphql-memo-app
   ```

2. **Dockerコンテナの起動**
   ```bash
   docker-compose up -d
   ```


3. **バックエンド依存インストール（初回のみ）**
   ```bash
   docker-compose exec backend composer install
   ```

4. **DBマイグレーション・シーディング（初回のみ）**
   ```bash
   docker-compose exec backend php artisan migrate --seed
   ```

5. **フロントエンド依存インストール（初回のみ）**
   ```bash
   docker-compose exec frontend npm install
   ```

---

## 起動方法

- **バックエンドAPI**: http://localhost:8000/graphql
- **フロントエンド**: http://localhost:3000

---

## MySQL接続情報（外部ツール用）
- Host: `localhost`
- Port: `3306`
- User: `todo_user`
- Password: `todo_password`
- Database: `todo_app`


※ローカルMySQLと競合する場合は、ホスト側MySQLを一時停止してください。

## バックエンド環境変数（.env）
初回セットアップ時は、`server/.env.example` をコピーして `server/.env` を作成し、必要に応じて編集してください。
```bash
cp server/.env.example server/.env
```

---

## テスト実行方法

### フロントエンド
```bash
cd frontend
npm test
```

### バックエンド（Laravel）
```bash
cd server
./vendor/bin/phpunit
# または
php artisan test
```

---

## その他
- 詳細な開発手順やコマンドは `docs/SETUP.md` も参照してください。
- 不明点・トラブルは issue か README 末尾に追記してください。
