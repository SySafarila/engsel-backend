import express from "express";
import {
  deleteUser,
  getUserDetail,
  getUsers,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:username", getUserDetail);
router.delete("/users/:username", authMiddleware, deleteUser);

export default router;
