import { Prisma, TaskStatus, TaskPriority } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from "./task.schema";
import { TaskResponse, PaginatedTasksResponse, TaskKPIsResponse } from "./task.types";

export async function createTask(
  userId: string,
  data: CreateTaskInput
): Promise<TaskResponse> {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId,
    },
  });

  return formatTask(task);
}

export async function getTasks(
  userId: string,
  query: TaskQueryInput
): Promise<PaginatedTasksResponse> {
  const { page, limit, status, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status && { status }),
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items: tasks.map(formatTask),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
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
}

export async function getTaskKPIs(userId: string): Promise<TaskKPIsResponse> {
  const [total, pending, inProgress, completed] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "PENDING" } }),
    prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { userId, status: "COMPLETED" } }),
  ]);

  return { total, pending, inProgress, completed };
}

function formatTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    userId: task.userId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
