import { z } from "zod";
import { taskStatusEnum, taskPriorityEnum } from "../../utils/enums";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters")
    .optional()
    .nullable(),
  status: taskStatusEnum.optional().default("PENDING"),
  priority: taskPriorityEnum.optional().default("MEDIUM"),
  dueDate: z
    .string()
    .optional()
    .nullable(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .optional(),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters")
    .optional()
    .nullable(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z
    .string()
    .optional()
    .nullable(),
});

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(10),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  search: z.string().max(255).optional(),
  sortBy: z
    .enum(["createdAt", "dueDate", "priority", "title"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid task ID format"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
