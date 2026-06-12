"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/validations/task";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  isLoading?: boolean;
}

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export function TaskForm({ task, onSubmit, isLoading }: TaskFormProps) {
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
        placeholder="Task title"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Task description (optional)"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
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

      <div className="flex justify-end gap-2">
        <Button type="submit" isLoading={isLoading}>
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
