import { Priority as GqlPriority } from "../generated/graphql";

export interface TodoFilters {
  priority?: GqlPriority | null;
  deadlineStatus?: "overdue" | "due_today" | "due_this_week" | null;
  completed?: boolean | null;
  categoryId?: string | null;
}

export interface TodoSortOptions {
  field: "priority" | "deadline" | "created_at" | "updated_at";
  direction: "asc" | "desc";
}
