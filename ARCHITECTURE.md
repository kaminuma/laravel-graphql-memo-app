# 🏗️ アーキテクチャ全体図

このドキュメントは、Laravel GraphQL Memo Appのフロントエンドからバックエンドまでの全体的なデータフローを可視化します。

## 📊 システム構成図

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          🌐 Browser (localhost:3000)                     │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP Request
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       📦 Docker Container: Frontend                      │
│                         (React + TypeScript)                             │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  App.tsx (エントリーポイント)                                    │   │
│  │  ├─ ApolloProvider (GraphQLクライアント設定)                     │   │
│  │  │   └─ uri: http://localhost:8000/graphql                       │   │
│  │  ├─ AuthProvider (認証状態管理 - Context API)                   │   │
│  │  └─ Router (ルーティング)                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                      │                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📁 src/features/                                                │   │
│  │                                                                   │   │
│  │  🔐 auth/                          ✅ todo/                      │   │
│  │  ├─ pages/                         ├─ pages/                     │   │
│  │  │  ├─ LoginPage.tsx              │  ├─ TodoPage.tsx            │   │
│  │  │  └─ RegisterPage.tsx           │  └─ TodoEditPage.tsx        │   │
│  │  ├─ graphql/                       ├─ components/                │   │
│  │  │  ├─ login.graphql              │  ├─ TodoList.tsx            │   │
│  │  │  ├─ register.graphql           │  └─ TodoForm.tsx            │   │
│  │  │  └─ me.graphql                 └─ graphql/                   │   │
│  │  └─ hooks/                            ├─ getTodos.graphql        │   │
│  │     └─ useAuth()                      ├─ createTodo.graphql      │   │
│  │                                        ├─ updateTodo.graphql      │   │
│  │                                        └─ deleteTodo.graphql      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                      │                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔧 src/generated/graphql.ts                                     │   │
│  │  (GraphQL Code Generatorで自動生成)                              │   │
│  │  ├─ useLoginUserMutation()                                       │   │
│  │  ├─ useGetMeQuery()                                              │   │
│  │  ├─ useGetTodosQuery()                                           │   │
│  │  ├─ useCreateTodoMutation()                                      │   │
│  │  ├─ useUpdateTodoMutation()                                      │   │
│  │  └─ useDeleteTodoMutation()                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ GraphQL Query/Mutation
                                      │ (Apollo Client)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       🚀 Docker Container: Backend                       │
│                         (Laravel + Lighthouse)                           │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🎯 GraphQL Endpoint: /graphql                                   │   │
│  │     (Lighthouse GraphQL Router)                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                      │                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📄 graphql/schema.graphql (統合スキーマ)                        │   │
│  │  ├─ types/                                                       │   │
│  │  │  ├─ user.graphql      (User型定義)                           │   │
│  │  │  ├─ todo.graphql      (Todo型定義)                           │   │
│  │  │  ├─ category.graphql  (Category型定義)                       │   │
│  │  │  └─ priority.graphql  (Priority enum)                        │   │
│  │  ├─ queries/                                                     │   │
│  │  │  ├─ userQueries.graphql                                      │   │
│  │  │  ├─ todoQueries.graphql                                      │   │
│  │  │  └─ categoryQueries.graphql                                  │   │
│  │  └─ mutations/                                                   │   │
│  │     ├─ authMutations.graphql  (login, register, logout)         │   │
│  │     ├─ todoMutations.graphql  (create, update, delete)          │   │
│  │     └─ categoryMutations.graphql                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                      │                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🎨 app/GraphQL/ (リゾルバー実装)                               │   │
│  │                                                                   │   │
│  │  Lighthouse/                                                     │   │
│  │  ├─ AuthResolver.php                                            │   │
│  │  │  ├─ login()      → Laravel Auth::attempt()                   │   │
│  │  │  ├─ register()   → User::create()                            │   │
│  │  │  └─ logout()     → Auth::logout()                            │   │
│  │  │                                                               │   │
│  │  ├─ TodoResolver.php                                            │   │
│  │  │  ├─ createTodo() → Todo::create()                            │   │
│  │  │  ├─ updateTodo() → Todo::update()                            │   │
│  │  │  └─ deleteTodo() → Todo::delete()                            │   │
│  │  │                                                               │   │
│  │  ├─ UserResolver.php                                            │   │
│  │  └─ CategoryResolver.php                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                      │                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🗂️ app/Models/ (Eloquent ORM)                                  │   │
│  │  ├─ User.php                                                     │   │
│  │  │  └─ hasMany(Todo)                                            │   │
│  │  ├─ Todo.php                                                     │   │
│  │  │  ├─ belongsTo(User)                                          │   │
│  │  │  ├─ belongsTo(Category)                                      │   │
│  │  │  ├─ scopeForUser()                                           │   │
│  │  │  ├─ scopeCompleted()                                         │   │
│  │  │  └─ scopeApplySorting()                                      │   │
│  │  └─ Category.php                                                │   │
│  │     └─ belongsTo(User)                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ SQL Query (Eloquent)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       🗄️ Docker Container: MySQL                        │
│                                                                           │
│  Database: todo_app                                                      │
│  ├─ users                                                                │
│  │  ├─ id, name, email, password                                        │
│  │  └─ created_at, updated_at                                           │
│  ├─ todos                                                                │
│  │  ├─ id, title, description, completed                                │
│  │  ├─ deadline, priority, category_id, user_id                         │
│  │  └─ created_at, updated_at                                           │
│  └─ categories                                                           │
│     ├─ id, name, color, user_id                                         │
│     └─ created_at, updated_at                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 データフロー詳細

### 1️⃣ 認証フロー (Login)

```
User Input (LoginPage)
    │
    │ email, password
    ▼
useLoginUserMutation()
    │ (generated hook)
    │
    │ GraphQL Mutation
    ▼
mutation {
  login(email: "...", password: "...") {
    id
    name
    email
  }
}
    │
    ▼
Backend: AuthResolver@login
    │
    │ Laravel Auth::attempt()
    ▼
MySQL: SELECT * FROM users WHERE email = '...'
    │
    │ User found & password verified
    ▼
Session Cookie Set
    │
    ▼
Frontend: refetchUser()
    │
    │ useGetMeQuery()
    ▼
AuthContext updates user state
    │
    ▼
navigate('/todos')
```

### 2️⃣ TODO作成フロー (Create)

```
User Input (TodoForm)
    │
    │ title, description, deadline, priority
    ▼
useCreateTodoMutation()
    │ (generated hook)
    │
    │ GraphQL Mutation
    ▼
mutation {
  createTodo(
    title: "..."
    description: "..."
    deadline: "2025-01-01"
    priority: HIGH
  ) {
    id
    title
    completed
  }
}
    │
    ▼
Backend: TodoResolver@createTodo
    │ @guard directive checks authentication
    │
    │ Eloquent ORM
    ▼
$user = Auth::user();
$todo = $user->todos()->create([...]);
    │
    ▼
MySQL: INSERT INTO todos (...) VALUES (...)
    │
    ▼
Return Todo object
    │
    ▼
Frontend: Apollo Cache Update
    │
    ▼
TodoList re-renders with new todo
```

### 3️⃣ TODO一覧取得フロー (Read)

```
TodoPage Mount
    │
    ▼
useGetTodosQuery()
    │ (generated hook)
    │
    │ GraphQL Query
    ▼
query {
  todos {
    id
    title
    description
    completed
    deadline
    priority
    category { name color }
  }
}
    │
    ▼
Backend: TodoResolver or Lighthouse default
    │ @guard directive checks authentication
    │
    │ Eloquent ORM with scopes
    ▼
Todo::forUser($userId)
    ->completed($completed)
    ->applySorting($sortBy, $sortDirection)
    ->get();
    │
    ▼
MySQL: SELECT * FROM todos
       WHERE user_id = ?
       ORDER BY created_at DESC
    │
    ▼
Return Todo[] array
    │
    ▼
Frontend: Apollo Cache stores data
    │
    ▼
TodoList renders todo items
```

---

## 🔑 重要な技術要素

### Frontend

| 技術 | 用途 | ファイル例 |
|-----|------|----------|
| **React Context API** | 認証状態の全体管理 | [AuthContext.tsx](frontend/src/hooks/AuthContext.tsx) |
| **Apollo Client** | GraphQLクライアント | [App.tsx:25-29](frontend/src/App.tsx#L25-L29) |
| **GraphQL Code Generator** | 型安全なhooks自動生成 | [generated/graphql.ts](frontend/src/generated/graphql.ts) |
| **Material UI** | UIコンポーネント | 全ページ |
| **React Router v6** | ルーティング | [App.tsx:56-63](frontend/src/App.tsx#L56-L63) |

### Backend

| 技術 | 用途 | ファイル例 |
|-----|------|----------|
| **Lighthouse GraphQL** | GraphQL APIフレームワーク | [schema.graphql](server/graphql/schema.graphql) |
| **Laravel Sanctum** | セッションベース認証 | AuthResolver |
| **Eloquent ORM** | データベースアクセス | [Todo.php](server/app/Models/Todo.php) |
| **@guard directive** | GraphQL認可 | [todoMutations.graphql:8](server/graphql/mutations/todoMutations.graphql#L8) |
| **@field resolver** | カスタムリゾルバー指定 | [authMutations.graphql:7](server/graphql/mutations/authMutations.graphql#L7) |

### Infrastructure

| コンポーネント | ポート | 用途 |
|------------|------|------|
| **Frontend Container** | 3000 | React開発サーバー |
| **Backend Container** | 8000 | Laravel APIサーバー |
| **MySQL Container** | 3306 | データベース |
| **Docker Network** | - | コンテナ間通信 (todo_network) |

---

## 📝 データフロー設計のポイント

### 1. **型安全性の確保**
- GraphQLスキーマが唯一の真実の源 (Single Source of Truth)
- `npm run codegen` でTypeScript型を自動生成
- フロント・バック両方で型定義が共有される

### 2. **認証の流れ**
- Laravel Sanctumのセッションベース認証
- GraphQLリクエストには `credentials: 'include'` でCookie送信
- `@guard` ディレクティブでサーバー側認可

### 3. **状態管理の階層**
```
Global State (Context API)
  └─ AuthContext: 認証状態
      └─ user, loading, logout, refetchUser

Local State (Apollo Cache)
  └─ GraphQLクエリ結果のキャッシュ
      └─ todos, categories

Component State (useState)
  └─ フォーム入力値、UI状態
```

### 4. **GraphQL Code Generatorの役割**
```
server/graphql/**/*.graphql (スキーマ定義)
         │
         │ GraphQL Code Generator
         ▼
frontend/src/generated/graphql.ts (型定義 + hooks)
         │
         │ Import
         ▼
React Components (型安全な開発)
```

---

## 🚀 開発ワークフロー

### GraphQLスキーマ変更時
1. `server/graphql/` でスキーマ編集
2. `php artisan lighthouse:print-schema` で確認
3. `npm run codegen` でフロントエンド型生成
4. React側で新しいhooksを使用
5. テスト実行

### 新機能追加時
1. データベースマイグレーション作成
2. Eloquentモデル定義
3. GraphQLスキーマ定義
4. リゾルバー実装
5. フロントエンド型生成
6. Reactコンポーネント実装
7. E2Eテスト追加

---

## 🔗 関連ドキュメント
- [CLAUDE.md](CLAUDE.md) - 開発コマンドとガイド
- [docker-compose.yml](docker-compose.yml) - インフラ構成
- [GraphQL Schema](server/graphql/schema.graphql) - APIスキーマ
