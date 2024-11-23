import express from "express";
import {
  deleteUser,
  getUserDetail,
  getUsers,
  updateUser,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import permissionMiddleware from "../middlewares/permissionMiddleware";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:username", getUserDetail);
router.patch("/users/:username", updateUser);
router.delete(
  "/users/:username",
  authMiddleware,
  permissionMiddleware("users-delete"),
  deleteUser
);

export default router;
