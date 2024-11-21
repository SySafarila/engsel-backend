import express from "express";
import { withdrawCharge } from "../controllers/withdrawController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/withdraws", authMiddleware, withdrawCharge);

export default router;
