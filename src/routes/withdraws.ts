import express from "express";
import { getWithdraw, withdrawCharge } from "../controllers/withdrawController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getWithdraw);
router.post("/", authMiddleware, withdrawCharge);

export default router;
