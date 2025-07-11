import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String!, $user_id: ID!) {
    createTodo(title: $title, description: $description, user_id: $user_id) {
      id
      title
      description
      completed
      user_id
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $title: String, $description: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, description: $description, completed: $completed) {
      id
      title
      description
      completed
      user_id
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