"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Task, TaskKPIs, TaskFilters } from "@/types/task";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { toast } from "sonner";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  kpis: () => [...taskKeys.all, "kpis"] as const,
};

export function useTasks(filters: TaskFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.search) params.set("search", filters.search);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<Task>>>(
        `/tasks?${params.toString()}`
      );
      return data.data;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ task: Task }>>(
        `/tasks/${id}`
      );
      return data.data.task;
    },
    enabled: !!id,
  });
}

export function useTaskKPIs() {
  return useQuery({
    queryKey: taskKeys.kpis(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ kpis: TaskKPIs }>>(
        "/tasks/kpis"
      );
      return data.data.kpis;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<Task>) => {
      const { data } = await api.post<ApiResponse<{ task: Task }>>(
        "/tasks",
        input
      );
      return data.data.task;
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previousQueries = queryClient.getQueriesData({
        queryKey: taskKeys.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: taskKeys.lists() },
        (old: PaginatedResponse<Task> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: [
              {
                ...newTask,
                id: "temp-" + Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: "",
              } as Task,
              ...old.items,
            ],
          };
        }
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Task created successfully");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to create task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Task> & { id: string }) => {
      const { data } = await api.patch<ApiResponse<{ task: Task }>>(
        `/tasks/${id}`,
        input
      );
      return data.data.task;
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previousQueries = queryClient.getQueriesData({
        queryKey: taskKeys.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: taskKeys.lists() },
        (old: PaginatedResponse<Task> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((task) =>
              task.id === updatedTask.id
                ? { ...task, ...updatedTask }
                : task
            ),
          };
        }
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Task updated successfully");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to update task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      const previousQueries = queryClient.getQueriesData({
        queryKey: taskKeys.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: taskKeys.lists() },
        (old: PaginatedResponse<Task> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.filter((task) => task.id !== deletedId),
          };
        }
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to delete task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
