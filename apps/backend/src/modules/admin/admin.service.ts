import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/apiError";
import {
  AdminStatsResponse,
  AdminUserResponse,
  AdminTaskResponse,
  PaginatedUsersResponse,
  PaginatedAdminTasksResponse,
} from "./admin.types";
import { AdminUserQueryInput, AdminTaskQueryInput, AdminUpdateTaskInput } from "./admin.schema";
import { logActivity } from "./activity-log.service";
import { getUserName } from "../../utils/user";
import { STATUS_LABELS } from "../../utils/labels";
import { buildPagination } from "../../utils/pagination";

export async function getStats(): Promise<AdminStatsResponse> {
  const now = new Date();
  const [
    totalUsers,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
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
    prisma.task.count({
      where: {
        status: { not: "COMPLETED" },
        dueDate: { lt: now },
      },
    }),
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
    overdueTasks,
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
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: users.map((user) => {
      const completedTasks = user.tasks.filter((t) => t.status === "COMPLETED").length;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AdminUserResponse["role"],
        createdAt: user.createdAt,
        taskCount: user._count.tasks,
        completedTasks,
      };
    }),
    pagination: buildPagination(page, limit, total),
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
    pagination: buildPagination(page, limit, total),
  };
}

export async function updateTask(
  taskId: string,
  data: AdminUpdateTaskInput,
  adminId: string
): Promise<AdminTaskResponse> {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: { user: { select: { id: true, name: true, email: true } } },
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
      ...(data.userId !== undefined && { userId: data.userId }),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
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
  if (data.userId && data.userId !== existingTask.userId) {
    changes.push(`assignee to ${task.user.name}`);
  }

  const adminName = await getUserName(adminId);
  await logActivity({
    action: "updated",
    entity: "task",
    entityId: taskId,
    userId: adminId,
    details: changes.length > 0
      ? `${adminName} updated task "${existingTask.title}": ${changes.join(", ")}`
      : `${adminName} updated task "${existingTask.title}"`,
  });

  // If task was reassigned, also log activity for the new user
  if (data.userId && data.userId !== existingTask.userId) {
    await logActivity({
      action: "assigned",
      entity: "task",
      entityId: taskId,
      userId: data.userId,
      details: `${adminName} assigned task "${existingTask.title}" to you`,
    });
  }

  // If task status changed, log for the task owner
  if (data.status && data.status !== existingTask.status) {
    await logActivity({
      action: "status_changed",
      entity: "task",
      entityId: taskId,
      userId: existingTask.userId,
      details: `${adminName} changed task "${existingTask.title}" status to ${STATUS_LABELS[data.status] || data.status}`,
    });
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as AdminTaskResponse["status"],
    priority: task.priority as AdminTaskResponse["priority"],
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    user: task.user,
  };
}

export async function deleteTask(
  taskId: string,
  adminId: string
): Promise<void> {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw ApiError.notFound("Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  const adminName = await getUserName(adminId);
  await logActivity({
    action: "deleted",
    entity: "task",
    entityId: taskId,
    userId: adminId,
    details: `${adminName} deleted task "${existingTask.title}"`,
  });
}
