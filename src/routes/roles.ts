import express from "express";
import RoleController from "../controllers/RoleController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/roles", authMiddleware);
router.post("/roles", can("roles-create"), RoleController.storeRole);
router.patch(
  "/roles/:roleName",
  can("roles-update"),
  RoleController.updateRole
);
router.delete(
  "/roles/:roleName",
  can("roles-delete"),
  RoleController.deleteRole
);
router.get("/roles", can("roles-read"), RoleController.readRole);

export default router;
