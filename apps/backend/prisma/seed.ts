import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const existingUser = await prisma.user.findUnique({
    where: { email: "demo@taskflow.com" },
  });

  if (existingUser) {
    console.log("Demo user already exists, skipping seed.");
    return;
  }

  const passwordHash = await hashPassword("password123");

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@taskflow.com",
      passwordHash,
    },
  });

  const tasks = [
    {
      title: "Set up project repository",
      description: "Initialize Git repo and configure CI/CD pipeline",
      status: "COMPLETED" as const,
      priority: "HIGH" as const,
      dueDate: new Date("2026-06-10"),
      userId: user.id,
    },
    {
      title: "Design database schema",
      description: "Create Prisma schema for users and tasks",
      status: "COMPLETED" as const,
      priority: "HIGH" as const,
      dueDate: new Date("2026-06-11"),
      userId: user.id,
    },
    {
      title: "Implement authentication",
      description: "Build JWT-based auth with register and login",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      dueDate: new Date("2026-06-12"),
      userId: user.id,
    },
    {
      title: "Build task CRUD API",
      description: "Create, read, update, delete endpoints for tasks",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      dueDate: new Date("2026-06-12"),
      userId: user.id,
    },
    {
      title: "Write API tests",
      description: "Integration tests for all endpoints",
      status: "PENDING" as const,
      priority: "MEDIUM" as const,
      dueDate: new Date("2026-06-13"),
      userId: user.id,
    },
    {
      title: "Deploy to production",
      description: "Deploy backend to Render and frontend to Vercel",
      status: "PENDING" as const,
      priority: "LOW" as const,
      dueDate: new Date("2026-06-15"),
      userId: user.id,
    },
    {
      title: "Update documentation",
      description: "Write README with setup instructions and API docs",
      status: "PENDING" as const,
      priority: "MEDIUM" as const,
      dueDate: null,
      userId: user.id,
    },
    {
      title: "Code review preparation",
      description: "Clean up code, add comments, prepare for review",
      status: "PENDING" as const,
      priority: "URGENT" as const,
      dueDate: new Date("2026-06-14"),
      userId: user.id,
    },
  ];

  await prisma.task.createMany({ data: tasks });

  console.log(`Seeded ${tasks.length} tasks for user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
