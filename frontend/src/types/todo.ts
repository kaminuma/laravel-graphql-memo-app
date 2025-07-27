export type Priority = 'high' | 'medium' | 'low';

export type DeadlineStatus = 'overdue' | 'due_today' | 'due_soon' | 'normal';

export interface Category {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  deadline?: string;
  priority: Priority;
  deadline_status: DeadlineStatus;
  category_id?: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  deadline?: string;
  priority?: Priority;
  category_id?: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  deadline?: string;
  priority?: Priority;
  category_id?: string;
}