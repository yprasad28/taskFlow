import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error("Error:", err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || undefined,
      },
    });
    return;
  }

  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as unknown as { code: string; meta?: { target?: string[] } };

    if (prismaErr.code === "P2002") {
      const field = prismaErr.meta?.target?.[0] || "field";
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: `A record with this ${field} already exists`,
        },
      });
      return;
    }

    if (prismaErr.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Record not found",
        },
      });
      return;
    }
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid token",
      },
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Token expired",
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: env.NODE_ENV === "development" ? err.message : "Internal server error",
    },
  });
}
