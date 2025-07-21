# GraphQL Category Queries for Testing

## Get All Categories
```graphql
query GetCategories {
  categories {
    id
    name
    color
    created_at
    updated_at
  }
}
```

## Get TODOs with Categories
```graphql
query GetTodosWithCategories {
  todos {
    id
    title
    description
    completed
    category_id
    category {
      id
      name
      color
    }
    priority
    deadline
    deadline_status
    created_at
  }
}
```

## Create TODO with Category
```graphql
mutation CreateTodoWithCategory {
  createTodo(
    title: "新しいタスク"
    description: "カテゴリ付きのテストタスク"
    user_id: "1"
    priority: MEDIUM
    category_id: "1"
  ) {
    id
    title
    category {
      id
      name
      color
    }
  }
}
```

## Filter TODOs by Category
```graphql
query FilterTodosByCategory {
  todos(category_id: "1") {
    id
    title
    category {
      name
      color
    }
  }
}
```

## Create New Category
```graphql
mutation CreateCategory {
  createCategory(
    name: "テスト"
    color: "#ff5722"
  ) {
    id
    name
    color
  }
}
```