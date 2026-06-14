import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ROLES } from "../../types/roles";
import * as adminController from "./admin.controller";
import {
  adminUserQuerySchema,
  adminTaskQuerySchema,
  adminTaskIdParamSchema,
  adminUpdateTaskSchema,
} from "./admin.schema";

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get("/stats", adminController.getStats);

router.get(
  "/users",
  validate(adminUserQuerySchema, "query"),
  adminController.getUsers
);

router.get(
  "/tasks",
  validate(adminTaskQuerySchema, "query"),
  adminController.getTasks
);

router.patch(
  "/tasks/:id",
  validate(adminTaskIdParamSchema, "params"),
  validate(adminUpdateTaskSchema),
  adminController.updateTask
);

router.delete(
  "/tasks/:id",
  validate(adminTaskIdParamSchema, "params"),
  adminController.deleteTask
);

router.get("/activity", adminController.getActivity);

export default router;
