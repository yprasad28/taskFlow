"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { createTaskSchema, CreateTaskInput } from "@/validations/task";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: "PENDING", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "COMPLETED", label: "Completed" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export function TaskForm({ task, onSubmit, onCancel, onDelete, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema) as never,
    defaultValues: {
      title: task?.title || "",
      description: task?.description || undefined,
      status: task?.status || "PENDING",
      priority: task?.priority || "MEDIUM",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="title"
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register("title")}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Enter task description (optional)"
          rows={3}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#2170e4]/20 dark:border-white/10 dark:bg-[#0d1520] dark:text-white transition-all resize-none"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="status"
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />
        <Select
          id="priority"
          label="Priority"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register("priority")}
        />
      </div>

      <Input
        id="dueDate"
        label="Due Date"
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate")}
      />

      <div className="flex justify-between gap-3 pt-4">
        <div>
          {onDelete && task && (
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          )}
          <Button type="submit" isLoading={isLoading}>
            {task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </div>
    </form>
  );
}
