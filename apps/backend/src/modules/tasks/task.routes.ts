import { Router } from "express";
import * as taskController from "./task.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema,
} from "./task.schema";

const router = Router();

router.use(authenticate);

router.get(
  "/kpis",
  taskController.getTaskKPIs
);

router.get(
  "/",
  validate(taskQuerySchema, "query"),
  taskController.getTasks
);

router.get(
  "/:id",
  validate(taskIdParamSchema, "params"),
  taskController.getTaskById
);

router.post(
  "/",
  validate(createTaskSchema),
  taskController.createTask
);

router.patch(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  taskController.updateTask
);

router.delete(
  "/:id",
  validate(taskIdParamSchema, "params"),
  taskController.deleteTask
);

export default router;
