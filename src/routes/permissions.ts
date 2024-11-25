import express from "express";
import PermissionController from "../controllers/PermissionController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/permissions", authMiddleware);
router.get(
  "/permissions",
  can("permissions-read"),
  PermissionController.read
);
router.post(
  "/permissions",
  can("permissions-create"),
  PermissionController.store
);
router.patch(
  "/permissions/:permissionName",
  can("permissions-update"),
  PermissionController.update
);
router.delete(
  "/permissions/:permissionName",
  can("permissions-delete"),
  PermissionController.delete
);

export default router;
