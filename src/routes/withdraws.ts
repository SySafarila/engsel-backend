import express from "express";
import WithdrawController from "../controllers/WithdrawController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, WithdrawController.getWithdraw);
router.post("/", authMiddleware, WithdrawController.withdrawCharge);

export default router;
