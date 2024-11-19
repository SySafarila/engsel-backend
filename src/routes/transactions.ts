import express from "express";
import {
  getTransactionDetail,
  midtransWebhook,
} from "../controllers/transactionController";

const router = express.Router();

router.get("/transactions/:transactionId", getTransactionDetail);

// webhook
router.post("/transactions/:transactionId/midtrans", midtransWebhook);

export default router;
