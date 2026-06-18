import { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function withRetry(handler: AsyncHandler, retries = 1, delayMs = 500): AsyncHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await handler(req, res, next);
        return;
      } catch (error) {
        const isTransient =
          (error as Error).name === "PrismaClientUnknownRequestError" ||
          (error as Error).name === "PrismaClientRustPanicError";
        if (isTransient && attempt < retries) {
          console.log(`Transient error, retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})`);
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        next(error);
        return;
      }
    }
  };
}
