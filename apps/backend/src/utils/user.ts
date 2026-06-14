import { prisma } from "../config/prisma";

export async function getUserName(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  return user?.name || "Unknown";
}
