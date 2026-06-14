import { z } from "zod";
import { taskStatusEnum, taskPriorityEnum } from "../../utils/enums";
const roleEnum = z.enum(["USER", "ADMIN"]);

export const adminUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().max(255).optional(),
  role: roleEnum.optional(),
});

export const adminTaskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  userId: z.string().uuid().optional(),
  search: z.string().max(255).optional(),
  sortBy: z
    .enum(["createdAt", "priority", "status", "title", "dueDate"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const adminTaskIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const adminUpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z.string().optional().nullable(),
  userId: z.string().uuid().optional(),
});

export type AdminUserQueryInput = z.infer<typeof adminUserQuerySchema>;
export type AdminTaskQueryInput = z.infer<typeof adminTaskQuerySchema>;
export type AdminTaskIdParam = z.infer<typeof adminTaskIdParamSchema>;
export type AdminUpdateTaskInput = z.infer<typeof adminUpdateTaskSchema>;
