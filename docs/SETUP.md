# TODOアプリ セットアップガイド

## 前提条件

- Docker
- Docker Compose
- Git

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd laravel-graphql-memo-app
```

### 2. Laravelプロジェクトの作成

```bash
# serverディレクトリに移動
cd server

# Laravelプロジェクトを作成
composer create-project laravel/laravel .

# 必要なパッケージをインストール
composer require rebing/graphql-laravel
composer require webonyx/graphql-php
```

### 3. 環境変数の設定

```bash
# .envファイルをコピー
cp .env.example .env

# アプリケーションキーを生成
php artisan key:generate
```

### 4. Dockerコンテナの起動

```bash
# ルートディレクトリに戻る
cd ..

# Dockerコンテナを起動
docker-compose up -d
```

### 5. データベースのマイグレーション

```bash
# Laravelコンテナに入る
docker exec -it todo_laravel_app bash

# マイグレーションを実行
php artisan migrate

# シーダーを実行（オプション）
php artisan db:seed
```

### 6. Reactアプリケーションのセットアップ

```bash
# frontendディレクトリに移動
cd frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

## アクセス方法

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **GraphQL Playground**: http://localhost:8000/graphql-playground

## 開発コマンド

### Laravel

```bash
# コンテナ内でLaravelコマンドを実行
docker exec -it todo_laravel_app php artisan [command]

# 例：新しいコントローラーを作成
docker exec -it todo_laravel_app php artisan make:controller TodoController
```

### React

```bash
# フロントエンドディレクトリで
npm start    # 開発サーバー起動
npm build    # プロダクションビルド
npm test     # テスト実行
```

## トラブルシューティング

### よくある問題

1. **ポートが既に使用されている場合**
   - `docker-compose down` でコンテナを停止
   - 使用中のポートを確認して解放

2. **権限エラーが発生する場合**
   - `chmod -R 777 server/storage` で権限を変更

3. **データベース接続エラー**
   - `.env`ファイルのデータベース設定を確認
   - コンテナが正常に起動しているか確認 