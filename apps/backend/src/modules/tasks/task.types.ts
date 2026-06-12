export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTasksResponse {
  items: TaskResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TaskKPIsResponse {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}
