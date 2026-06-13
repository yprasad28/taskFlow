import { z } from "zod";

const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);
const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
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
    .enum(["createdAt", "priority", "status", "title"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AdminUserQueryInput = z.infer<typeof adminUserQuerySchema>;
export type AdminTaskQueryInput = z.infer<typeof adminTaskQuerySchema>;
