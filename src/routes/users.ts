import express from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/users", authMiddleware);
router.get("/users", can("users-read"), UserController.getUsers);
router.get("/users/:username", can("users-read"), UserController.getDetail);
router.patch(
  "/users/:username",
  can("users-update"),
  UserController.update
);
router.delete(
  "/users/:username",
  can("users-delete"),
  UserController.delete
);

export default router;
