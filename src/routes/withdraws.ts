import express from "express";
import { getWithdraw, withdrawCharge } from "../controllers/withdrawController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/withdraws", authMiddleware, getWithdraw);
router.post("/withdraws", authMiddleware, withdrawCharge);

export default router;
