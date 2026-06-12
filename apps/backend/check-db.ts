import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  console.log(`\nTotal tasks: ${tasks.length}\n`);
  console.log("Title                          | Status      | Priority");
  console.log("-".repeat(65));
  tasks.forEach((t) => {
    console.log(
      `${t.title.padEnd(30)}| ${t.status.padEnd(12)}| ${t.priority}`
    );
  });

  await prisma.$disconnect();
}

main();
