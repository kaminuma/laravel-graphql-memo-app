# GitHub Copilot カスタムインストラクション

## コードレビュー

すべてのコードレビューコメント、説明、レスポンスは**日本語**で記述してください。

## レビュー方針

- セキュリティの脆弱性を最優先で指摘する
- パフォーマンスの問題を指摘する
- コードの可読性と保守性を重視する
- Laravel、GraphQL、Reactのベストプラクティスに従っているか確認する
- 型安全性の問題を指摘する

## プロジェクト固有の注意点

- このプロジェクトはLaravel + Lighthouse GraphQL + Reactで構成されている
- バックエンド: PHP 8.2, Laravel 12, Lighthouse GraphQL
- フロントエンド: React, TypeScript, Material UI
- データベース: MySQL 8.0
- GraphQL Code Generatorで型を自動生成している
