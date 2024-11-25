import express from "express";
import PermissionController from "../controllers/PermissionController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/permissions", authMiddleware);
router.get(
  "/permissions",
  can("permissions-read"),
  PermissionController.readPermission
);
router.post(
  "/permissions",
  can("permissions-create"),
  PermissionController.storePermission
);
router.patch(
  "/permissions/:permissionName",
  can("permissions-update"),
  PermissionController.updatePermission
);
router.delete(
  "/permissions/:permissionName",
  can("permissions-delete"),
  PermissionController.deletePermission
);

export default router;
