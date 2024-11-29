import express from "express";
import BankController from "../controllers/BankController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, BankController.get);
router.delete("/:bankId", authMiddleware, BankController.delete);
router.post("/", authMiddleware, BankController.store);

export default router;
