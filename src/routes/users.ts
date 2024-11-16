import express from "express";
import donateController from "../controllers/donateController";
import { getUserDetail, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:username", getUserDetail);
router.post("/users/:username/donate", donateController);

export default router;
