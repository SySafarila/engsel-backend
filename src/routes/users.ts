import express from "express";
import { getUserDetail, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:username", getUserDetail);

export default router;
