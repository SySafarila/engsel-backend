import express from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/users", authMiddleware);
router.get("/users", can("users-read"), UserController.getUsers);
router.get("/users/:username", can("users-read"), UserController.getUserDetail);
router.patch(
  "/users/:username",
  can("users-update"),
  UserController.updateUser
);
router.delete(
  "/users/:username",
  can("users-delete"),
  UserController.deleteUser
);

export default router;
