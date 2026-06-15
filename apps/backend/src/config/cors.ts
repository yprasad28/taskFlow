import { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:3000",
  "https://task-flow-lcx3hj465-yprasad28s-projects.vercel.app",
  "https://frontend-h6h7a0aju-yprasad28s-projects.vercel.app",
  "https://frontend-alpha-liard-54.vercel.app",
].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
