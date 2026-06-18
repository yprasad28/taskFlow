import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error("Error:", err.name, err.message);

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
    const prismaErr = err as unknown as { code: string; meta?: { target?: string[]; constraint?: string } };

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

    if (prismaErr.code === "P2003") {
      res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: `Foreign key constraint failed: ${prismaErr.meta?.constraint || "unknown"}`,
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: `Database error: ${prismaErr.code}`,
      },
    });
    return;
  }

  if (err.name === "PrismaClientUnknownRequestError") {
    const prismaErr = err as unknown as { message?: string };
    console.error("PrismaClientUnknownRequestError:", prismaErr.message);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Database query failed",
      },
    });
    return;
  }

  if (err.name === "PrismaClientRustPanicError") {
    console.error("PrismaClientRustPanicError:", err.message);
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Database engine error",
      },
    });
    return;
  }

  if (err.message?.includes("Connection pool timeout") || err.message?.includes("Timed out")) {
    console.error("Connection pool timeout:", err.message);
    res.status(503).json({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Server is temporarily busy, please try again",
      },
    });
    return;
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

  console.error("Unhandled error:", {
    name: err.name,
    message: err.message,
  });

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
}
