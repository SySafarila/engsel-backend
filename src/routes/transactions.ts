import express from "express";
import { getTransactionDetail } from "../controllers/transactionController";

const router = express.Router();

router.get("/:transactionId", getTransactionDetail);

export default router;
