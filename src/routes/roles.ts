import express from "express";
import RoleController from "../controllers/RoleController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/roles", authMiddleware);
router.post("/roles", can("roles-create"), RoleController.store);
router.patch(
  "/roles/:roleName",
  can("roles-update"),
  RoleController.update
);
router.delete(
  "/roles/:roleName",
  can("roles-delete"),
  RoleController.delete
);
router.get("/roles", can("roles-read"), RoleController.read);

export default router;
