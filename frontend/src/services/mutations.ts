import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo(
    $title: String!
    $description: String
    $user_id: ID!
    $deadline: String
    $priority: Priority
    $category_id: ID
  ) {
    createTodo(
      title: $title
      description: $description
      user_id: $user_id
      deadline: $deadline
      priority: $priority
      category_id: $category_id
    ) {
      id
      title
      description
      completed
      user_id
      deadline
      priority
      deadline_status
      category_id
      category {
        id
        name
        color
      }
      created_at
      updated_at
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: ID!
    $title: String
    $description: String
    $completed: Boolean
    $deadline: String
    $priority: Priority
    $category_id: ID
  ) {
    updateTodo(
      id: $id
      title: $title
      description: $description
      completed: $completed
      deadline: $deadline
      priority: $priority
      category_id: $category_id
    ) {
      id
      title
      description
      completed
      user_id
      deadline
      priority
      deadline_status
      category_id
      category {
        id
        name
        color
      }
      created_at
      updated_at
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $color: String) {
    createCategory(name: $name, color: $color) {
      id
      name
      color
      created_at
      updated_at
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String, $color: String) {
    updateCategory(id: $id, name: $name, color: $color) {
      id
      name
      color
      created_at
      updated_at
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`; 