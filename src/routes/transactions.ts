import express from "express";
import TransactionController from "../controllers/TransactionController";

const router = express.Router();

router.get("/:transactionId", TransactionController.getDetail);

export default router;
