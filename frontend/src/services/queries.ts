import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos(
    $completed: Boolean
    $priority: Priority
    $deadline_status: String
    $sort_by: String
    $sort_direction: String
  ) {
    todos(
      completed: $completed
      priority: $priority
      deadline_status: $deadline_status
      sort_by: $sort_by
      sort_direction: $sort_direction
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