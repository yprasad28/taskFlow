import { Request, Response, NextFunction } from "express";
import * as taskService from "./task.service";
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from "./task.schema";

interface IdParams {
  id: string;
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.createTask(
      req.user!.userId,
      req.body as CreateTaskInput
    );
    res.status(201).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await taskService.getTasks(
      req.user!.userId,
      req.query as unknown as TaskQueryInput
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as unknown as IdParams;
    const task = await taskService.getTaskById(
      req.user!.userId,
      id
    );
    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
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
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params as unknown as IdParams;
    await taskService.deleteTask(req.user!.userId, id);
    res.status(200).json({
      success: true,
      data: { message: "Task deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskKPIs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const kpis = await taskService.getTaskKPIs(req.user!.userId);
    res.status(200).json({
      success: true,
      data: { kpis },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Number(req.query.limit) || 10;
    const activities = await taskService.getUserActivityLogs(req.user!.userId, limit);
    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
}
