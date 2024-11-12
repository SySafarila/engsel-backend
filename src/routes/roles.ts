import express from "express";
import {
  deleteRole,
  readRole,
  storeRole,
  updateRole,
} from "../controllers/roleController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/roles", authMiddleware);
router.put("/roles", can("roles-create"), storeRole);
router.patch("/roles", can("roles-update"), updateRole);
router.delete("/roles", can("roles-delete"), deleteRole);
router.get("/roles", can("roles-read"), readRole);

export default router;
