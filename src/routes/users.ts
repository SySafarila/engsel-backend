import express from "express";
import {
  deleteUser,
  getUserDetail,
  getUsers,
  updateUser,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/", authMiddleware);
router.get("/users", can("users-read"), getUsers);
router.get("/users/:username", can("users-read"), getUserDetail);
router.patch("/users/:username", can("users-update"), updateUser);
router.delete("/users/:username", can("users-delete"), deleteUser);

export default router;
