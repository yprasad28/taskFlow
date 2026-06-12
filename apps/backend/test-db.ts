import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    const userCount = await prisma.user.count();
    console.log("Users in database:", userCount);

    const taskCount = await prisma.task.count();
    console.log("Tasks in database:", taskCount);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
