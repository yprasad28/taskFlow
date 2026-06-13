import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { ROLES } from "../src/types/roles";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hashPassword("password123");

  const existingDemo = await prisma.user.findUnique({
    where: { email: "demo@taskflow.com" },
  });

  let demoUser;
  if (existingDemo) {
    console.log("Demo user already exists, skipping.");
    demoUser = existingDemo;
  } else {
    demoUser = await prisma.user.create({
      data: {
        name: "Demo User",
        email: "demo@taskflow.com",
        passwordHash,
        role: ROLES.USER,
      },
    });
    console.log(`Created demo user: ${demoUser.email}`);
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@taskflow.com" },
  });

  let adminUser;
  if (existingAdmin) {
    console.log("Admin user already exists, skipping.");
    adminUser = existingAdmin;
  } else {
    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@taskflow.com",
        passwordHash,
        role: ROLES.ADMIN,
      },
    });
    console.log(`Created admin user: ${adminUser.email}`);
  }

  const existingTasks = await prisma.task.count();
  if (existingTasks > 0) {
    console.log("Tasks already exist, skipping seed.");
    return;
  }

  const tasks = [
    {
      title: "Set up project repository",
      description: "Initialize Git repo and configure CI/CD pipeline",
      status: "COMPLETED" as const,
      priority: "HIGH" as const,
      dueDate: new Date("2026-06-10"),
      userId: demoUser.id,
    },
    {
      title: "Design database schema",
      description: "Create Prisma schema for users and tasks",
      status: "COMPLETED" as const,
      priority: "HIGH" as const,
      dueDate: new Date("2026-06-11"),
      userId: demoUser.id,
    },
    {
      title: "Implement authentication",
      description: "Build JWT-based auth with register and login",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      dueDate: new Date("2026-06-12"),
      userId: demoUser.id,
    },
    {
      title: "Build task CRUD API",
      description: "Create, read, update, delete endpoints for tasks",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      dueDate: new Date("2026-06-12"),
      userId: demoUser.id,
    },
    {
      title: "Write API tests",
      description: "Integration tests for all endpoints",
      status: "PENDING" as const,
      priority: "MEDIUM" as const,
      dueDate: new Date("2026-06-13"),
      userId: demoUser.id,
    },
    {
      title: "Deploy to production",
      description: "Deploy backend to Render and frontend to Vercel",
      status: "PENDING" as const,
      priority: "LOW" as const,
      dueDate: new Date("2026-06-15"),
      userId: demoUser.id,
    },
    {
      title: "Update documentation",
      description: "Write README with setup instructions and API docs",
      status: "PENDING" as const,
      priority: "MEDIUM" as const,
      dueDate: null,
      userId: demoUser.id,
    },
    {
      title: "Code review preparation",
      description: "Clean up code, add comments, prepare for review",
      status: "PENDING" as const,
      priority: "URGENT" as const,
      dueDate: new Date("2026-06-14"),
      userId: demoUser.id,
    },
  ];

  await prisma.task.createMany({ data: tasks });

  console.log(`Seeded ${tasks.length} tasks for user: ${demoUser.email}`);
  console.log(`Admin user ready: ${adminUser.email} / password123`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
