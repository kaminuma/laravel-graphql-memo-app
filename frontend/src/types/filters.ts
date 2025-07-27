import { Priority as GqlPriority } from "../generated/graphql";

export type Priority = "high" | "medium" | "low";

export type DeadlineStatus = "overdue" | "due_today" | "due_soon" | "normal";
export interface Category {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface TodoFilters {
  priority?: GqlPriority | null;
  deadlineStatus?: "overdue" | "due_today" | "due_this_week" | null;
  completed?: boolean | null;
  categoryId?: string | null;
}

export interface TodoSortOptions {
  field: "priority" | "deadline" | "created_at";
  direction: "asc" | "desc";
}
