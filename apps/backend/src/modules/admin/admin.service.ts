import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import {
  AdminStatsResponse,
  AdminUserResponse,
  AdminTaskResponse,
  PaginatedUsersResponse,
  PaginatedAdminTasksResponse,
} from "./admin.types";
import { AdminUserQueryInput, AdminTaskQueryInput } from "./admin.schema";

export async function getStats(): Promise<AdminStatsResponse> {
  const [
    totalUsers,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    lowPriority,
    mediumPriority,
    highPriority,
    urgentPriority,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: "PENDING" } }),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { status: "COMPLETED" } }),
    prisma.task.count({ where: { priority: "LOW" } }),
    prisma.task.count({ where: { priority: "MEDIUM" } }),
    prisma.task.count({ where: { priority: "HIGH" } }),
    prisma.task.count({ where: { priority: "URGENT" } }),
  ]);

  return {
    totalUsers,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    tasksByPriority: {
      low: lowPriority,
      medium: mediumPriority,
      high: highPriority,
      urgent: urgentPriority,
    },
  };
}

export async function getUsers(
  query: AdminUserQueryInput
): Promise<PaginatedUsersResponse> {
  const { page, limit, search, role } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as AdminUserResponse["role"],
      createdAt: user.createdAt,
      taskCount: user._count.tasks,
    })),
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

export async function getTasks(
  query: AdminTaskQueryInput
): Promise<PaginatedAdminTasksResponse> {
  const { page, limit, status, priority, userId, search, sortBy, sortOrder } =
    query;
  const skip = (page - 1) * limit;

  const where: Prisma.TaskWhereInput = {
    ...(status && { status }),
    ...(priority && { priority }),
    ...(userId && { userId }),
    ...(search && {
      title: { contains: search },
    }),
  };

  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as AdminTaskResponse["status"],
      priority: task.priority as AdminTaskResponse["priority"],
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      user: task.user,
    })),
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
