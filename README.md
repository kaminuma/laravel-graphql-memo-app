# Laravel + GraphQL + React (Material UI) TODOアプリ
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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

4. **アプリケーションキー生成（初回のみ）**
   ```bash
   docker-compose exec backend php artisan key:generate
   ```
   
5. **※必要に応じて以下も実行してください：**
   ```bash
   docker-compose exec backend php artisan config:cache
   ```

6. **DBマイグレーション・シーディング（初回のみ）**
   ```bash
   docker-compose exec backend php artisan migrate --seed
   ```

7. **フロントエンド依存インストール（初回のみ）**
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Arnesh-pal"><img src="https://avatars.githubusercontent.com/u/144382300?v=4?s=100" width="100px;" alt="Arnesh Pal"/><br /><sub><b>Arnesh Pal</b></sub></a><br /><a href="https://github.com/kaminuma/laravel-graphql-memo-app/commits?author=Arnesh-pal" title="Documentation">📖</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
