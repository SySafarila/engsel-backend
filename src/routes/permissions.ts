import express from "express";
import {
  deletePermission,
  readPermission,
  storePermission,
  updatePermission,
} from "../controllers/permissionController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/permissions", authMiddleware);
router.get("/permissions", can("permissions-read"), readPermission);
router.post("/permissions", can("permissions-create"), storePermission);
router.patch(
  "/permissions/:permissionName",
  can("permissions-update"),
  updatePermission
);
router.delete(
  "/permissions/:permissionName",
  can("permissions-delete"),
  deletePermission
);

export default router;
