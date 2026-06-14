import { Role } from "../../types/roles";

export interface AdminStatsResponse {
  totalUsers: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  taskCount: number;
  completedTasks: number;
}

export interface AdminTaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedUsersResponse {
  items: AdminUserResponse[];
  pagination: PaginationMeta;
}

export interface PaginatedAdminTasksResponse {
  items: AdminTaskResponse[];
  pagination: PaginationMeta;
}
