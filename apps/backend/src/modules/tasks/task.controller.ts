import { Request, Response } from "express";
import * as taskService from "./task.service";
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from "./task.schema";
import { withRetry } from "../../utils/withRetry";

interface IdParams {
  id: string;
}

export const createTask = withRetry(async (req: Request, res: Response): Promise<void> => {
  const task = await taskService.createTask(
    req.user!.userId,
    req.body as CreateTaskInput
  );
  res.status(201).json({
    success: true,
    data: { task },
  });
});

export const getTasks = withRetry(async (req: Request, res: Response): Promise<void> => {
  const result = await taskService.getTasks(
    req.user!.userId,
    req.query as unknown as TaskQueryInput
  );
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTaskById = withRetry(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as unknown as IdParams;
  const task = await taskService.getTaskById(
    req.user!.userId,
    id
  );
  res.status(200).json({
    success: true,
    data: { task },
  });
});

export const updateTask = withRetry(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as unknown as IdParams;
  const task = await taskService.updateTask(
    req.user!.userId,
    id,
    req.body as UpdateTaskInput
  );
  res.status(200).json({
    success: true,
    data: { task },
  });
});

export const deleteTask = withRetry(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as unknown as IdParams;
  await taskService.deleteTask(req.user!.userId, id);
  res.status(200).json({
    success: true,
    data: { message: "Task deleted successfully" },
  });
});

export const getTaskKPIs = withRetry(async (req: Request, res: Response): Promise<void> => {
  const kpis = await taskService.getTaskKPIs(req.user!.userId);
  res.status(200).json({
    success: true,
    data: { kpis },
  });
});

export const getUserActivity = withRetry(async (req: Request, res: Response): Promise<void> => {
  const limit = Number(req.query.limit) || 10;
  const activities = await taskService.getUserActivityLogs(req.user!.userId, limit);
  res.status(200).json({
    success: true,
    data: { activities },
  });
});
