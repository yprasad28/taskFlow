import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import { AdminUserQueryInput, AdminTaskQueryInput, AdminUpdateTaskInput } from "./admin.schema";
import { getActivityLogs } from "./activity-log.service";

export async function getStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await adminService.getStats();
    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await adminService.getUsers(
      req.query as unknown as AdminUserQueryInput
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await adminService.getTasks(
      req.query as unknown as AdminTaskQueryInput
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const task = await adminService.updateTask(
      id,
      req.body as AdminUpdateTaskInput,
      req.user!.userId
    );
    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    await adminService.deleteTask(id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: { message: "Task deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}

export async function getActivity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = Number(req.query.limit) || 20;
    const logs = await getActivityLogs(limit);
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
}
