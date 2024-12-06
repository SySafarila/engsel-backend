import express from "express";
import BankController from "../controllers/BankController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.get(
  "/banks/",
  authMiddleware,
  can("banks-read"),
  BankController.getAdmin
);
router.patch(
  "/banks/:bankId/accept",
  authMiddleware,
  can("banks-update"),
  BankController.acceptBank
);

export default router;
