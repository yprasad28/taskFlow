import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const PORT = env.PORT;

async function main() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

main();
