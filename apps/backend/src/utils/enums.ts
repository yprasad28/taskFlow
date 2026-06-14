import { z } from "zod";

export const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]);
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
