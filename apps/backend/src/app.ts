import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { corsOptions } from "./config/cors";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/tasks/task.routes";
import adminRoutes from "./modules/admin/admin.routes";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
