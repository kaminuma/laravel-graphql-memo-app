# Laravel + GraphQL + React (Material UI) TODOアプリ
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## 概要

このプロジェクトは、Laravel（バックエンド）・GraphQL API・React（Material UI, TypeScript）によるモダンなTODOアプリです。

## このプロジェクトについて

このアプリは「みんなでオープンに開発する」ことを目的に作成しています。
もともとはバイブコーディングで作成した機能をベースに、今後もどんどん新しい機能を追加していく予定です。

誰でも気軽にIssueやPull Requestを送ってください！
ある程度の機能が揃った段階で正式リリースを予定しています。

みなさんのご参加・ご貢献をお待ちしています！

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

2. **環境変数の設定**

   ```bash
   # Docker Compose用の.envファイルをコピー
   cp .env.example .env

   # Laravel用の.envファイルをコピー
   cp server/.env.example server/.env
   ```

   設定には必要に応じて編集してください。


3. **Dockerコンテナの起動**
   ```bash
   docker-compose up -d
   ```


4. **バックエンド依存インストール（初回のみ）**
   ```bash
   docker-compose exec backend composer install
   ```

5. **アプリケーションキー生成（初回のみ）**
   ```bash
   docker-compose exec backend php artisan key:generate
   ```

6. **※必要に応じて以下も実行してください：**
   ```bash
   docker-compose exec backend php artisan config:cache
   ```

7. **DBマイグレーション・シーディング（初回のみ）**
   ```bash
   docker-compose exec backend php artisan migrate --seed
   ```

8. **フロントエンド依存インストール（初回のみ）**
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

データベースの認証情報は、設定した`.env`ファイルを参照してください。

※ローカルMySQLと競合する場合は、`.env`ファイルで`DB_HOST_PORT`を設定するか、ホスト側MySQLを一時停止してください。

例：`.env`ファイルに`DB_HOST_PORT=13306`と記述すると、`localhost:13306`にMySQLを公開します。

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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/emilythedev"><img src="https://avatars.githubusercontent.com/u/140520093?v=4?s=100" width="100px;" alt="emilythedev"/><br /><sub><b>emilythedev</b></sub></a><br /><a href="https://github.com/kaminuma/laravel-graphql-memo-app/commits?author=emilythedev" title="Documentation">📖</a></td>
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
