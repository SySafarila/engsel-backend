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
router.put("/permissions", can("permissions-create"), storePermission);
router.patch("/permissions", can("permissions-update"), updatePermission);
router.delete("/permissions", can("permissions-delete"), deletePermission);
router.get("/permissions", can("permissions-read"), readPermission);

export default router;
