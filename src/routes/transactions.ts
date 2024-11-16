import express from "express";
import {
  getTransactionDetail,
  midtransWebhook,
} from "../controllers/transactionController";

const router = express.Router();

router.get("/transactions/:transactionId", getTransactionDetail);
router.post("/transactions/:transactionId/midtrans", midtransWebhook);

export default router;
