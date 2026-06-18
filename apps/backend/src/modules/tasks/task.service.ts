import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from "./task.schema";
import { TaskResponse, PaginatedTasksResponse, TaskKPIsResponse } from "./task.types";
import { logActivity } from "../admin/activity-log.service";
import { getUserName } from "../../utils/user";
import { STATUS_LABELS } from "../../utils/labels";
import { buildPagination } from "../../utils/pagination";

export async function createTask(
  userId: string,
  data: CreateTaskInput
): Promise<TaskResponse> {
  const assignedUserId = data.userId || userId;

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId: assignedUserId,
    },
  });

  const userName = await getUserName(userId);
  const details = data.userId && data.userId !== userId
    ? `${userName} created and assigned task "${task.title}" to user`
    : `${userName} created task "${task.title}"`;

  await logActivity({
    action: "created",
    entity: "task",
    entityId: task.id,
    userId,
    details,
  });

  return formatTask(task);
}

export async function getTasks(
  userId: string,
  query: TaskQueryInput
): Promise<PaginatedTasksResponse> {
  const { page, limit, status, priority, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const orderBy: Record<string, "asc" | "desc"> = { [sortBy]: sortOrder };

  const total = await prisma.task.count({ where });

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
    skip,
    take: limit,
  });

  return {
    items: tasks.map(formatTask),
    pagination: buildPagination(page, limit, total),
  };
}

export async function getTaskById(
  userId: string,
  taskId: string
): Promise<TaskResponse> {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  return formatTask(task);
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: UpdateTaskInput
): Promise<TaskResponse> {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw ApiError.notFound("Task not found");
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
  });

  const changes: string[] = [];
  if (data.status && data.status !== existingTask.status) {
    changes.push(`status from ${STATUS_LABELS[existingTask.status] || existingTask.status} to ${STATUS_LABELS[data.status] || data.status}`);
  }
  if (data.priority && data.priority !== existingTask.priority) {
    changes.push(`priority from ${existingTask.priority} to ${data.priority}`);
  }
  if (data.title && data.title !== existingTask.title) {
    changes.push(`title to "${data.title}"`);
  }

  const userName = await getUserName(userId);
  await logActivity({
    action: "updated",
    entity: "task",
    entityId: taskId,
    userId,
    details: changes.length > 0
      ? `${userName} updated task "${existingTask.title}": ${changes.join(", ")}`
      : `${userName} updated task "${existingTask.title}"`,
  });

  return formatTask(task);
}

export async function deleteTask(
  userId: string,
  taskId: string
): Promise<void> {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw ApiError.notFound("Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  const userName = await getUserName(userId);
  await logActivity({
    action: "deleted",
    entity: "task",
    entityId: taskId,
    userId,
    details: `${userName} deleted task "${existingTask.title}"`,
  });
}

export async function getTaskKPIs(userId: string): Promise<TaskKPIsResponse> {
  const [total, pending, inProgress, inReview, completed] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "PENDING" } }),
    prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { userId, status: "IN_REVIEW" } }),
    prisma.task.count({ where: { userId, status: "COMPLETED" } }),
  ]);

  return { total, pending, inProgress, inReview, completed };
}

function formatTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskResponse["status"],
    priority: task.priority as TaskResponse["priority"],
    dueDate: task.dueDate,
    userId: task.userId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export async function getUserActivityLogs(userId: string, limit = 10) {
  const logs = await prisma.activityLog.findMany({
    where: {
      OR: [
        { userId },
        {
          AND: [
            { entity: "task" },
            {
              task: { userId },
            },
          ],
        },
      ],
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
      task: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    details: log.details,
    taskTitle: log.task?.title || null,
    createdAt: log.createdAt,
    user: log.user,
  }));
}
