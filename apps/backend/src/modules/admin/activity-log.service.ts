import { prisma } from "../../config/prisma";

export interface CreateActivityLogInput {
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  details?: string;
}

export async function logActivity(data: CreateActivityLogInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId || null,
        userId: data.userId,
        details: data.details || null,
      },
    });
  } catch {}
}

export async function getActivityLogs(limit = 20) {
  const logs = await prisma.activityLog.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
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
    createdAt: log.createdAt,
    user: log.user,
  }));
}
