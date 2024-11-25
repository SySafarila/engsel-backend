import express from "express";
import WithdrawController from "../controllers/WithdrawController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, WithdrawController.get);
router.post("/", authMiddleware, WithdrawController.charge);

export default router;
