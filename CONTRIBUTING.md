# コントリビューションガイド / Contribution Guide

このプロジェクトへのご参加ありがとうございます！
Thank you for considering contributing to this project!

---

## 1. はじめに / Getting Started

- バグ報告・機能提案・質問はまず[Issue](./issues)を作成してください。
- コードの変更は必ずPull Request（PR）でお願いします。
- 日本語・英語どちらでも歓迎です。

---

## 2. 開発フロー / Development Flow

1. Issueを立てて内容を相談（既存Issueがあればそれにコメント）
2. フォークまたは新しいブランチを作成
3. コード修正・テスト
4. PR作成（Issue番号を本文に記載）
5. レビュー・修正
6. マージ

1. Open an Issue to discuss your idea (or comment on an existing one)
2. Fork or create a new branch
3. Make your changes and add tests
4. Create a PR (mention the related Issue number)
5. Review & fix if needed
6. Merge

---

## 3. コーディング規約 / Coding Guidelines

- フロントエンドはTypeScript推奨
- コメントは日本語で統一（英語も併記歓迎）
- コードは可読性・保守性を重視
- Prettier/ESLint等の自動整形を推奨

- Use TypeScript for frontend if possible
- Write comments in Japanese (English also welcome)
- Prioritize readability and maintainability
- Use Prettier/ESLint for formatting

---

## 4. テスト / Testing

- 変更にはユニットテスト・E2Eテスト（Cypress等）を追加してください
- `npm test` や `npm run cypress` でテストを実行できます

- Add unit/E2E tests (Cypress etc.) for your changes
- Run tests with `npm test` or `npm run cypress`

---

## 5. Issue・PR作成時の注意 / Issue & PR Tips

- タイトル・本文は日本語/英語どちらでもOK（両方あるとベスト）
- どのIssueに紐づくか明記
- 変更内容・動作確認方法・スクリーンショット（UI変更時）を記載

- Title/body can be in Japanese or English (both is best)
- Reference related Issue numbers
- Describe what you changed, how to test, and add screenshots for UI changes

---

## 6. その他 / Others

- 質問・相談はIssueまたは[Discussions](https://github.com/kaminuma/laravel-graphql-memo-app/discussions)へ
- OSS初心者も大歓迎！

- Feel free to ask questions via Issues or Discussions
- Beginners are welcome! 