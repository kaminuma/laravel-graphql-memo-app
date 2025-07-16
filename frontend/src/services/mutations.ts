import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo(
    $title: String!
    $description: String
    $user_id: ID!
    $deadline: String
    $priority: Priority
  ) {
    createTodo(
      title: $title
      description: $description
      user_id: $user_id
      deadline: $deadline
      priority: $priority
    ) {
      id
      title
      description
      completed
      user_id
      deadline
      priority
      deadline_status
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
  ) {
    updateTodo(
      id: $id
      title: $title
      description: $description
      completed: $completed
      deadline: $deadline
      priority: $priority
    ) {
      id
      title
      description
      completed
      user_id
      deadline
      priority
      deadline_status
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