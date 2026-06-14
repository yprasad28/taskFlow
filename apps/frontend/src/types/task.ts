export type TaskStatus = "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskKPIs {
  total: number;
  pending: number;
  inProgress: number;
  inReview: number;
  completed: number;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: "createdAt" | "dueDate" | "priority" | "title";
  sortOrder?: "asc" | "desc";
}
