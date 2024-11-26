import express from "express";
import WithdrawController from "../controllers/WithdrawController";
import authMiddleware from "../middlewares/authMiddleware";
import can from "../middlewares/permissionMiddleware";

const router = express.Router();

router.use("/withdraws", authMiddleware);
router.get("/withdraws", can("withdraws-read"), WithdrawController.adminGet);
router.patch(
  "/withdraws/:withdrawId/accept",
  can("withdraws-update"),
  WithdrawController.adminAccept
);

export default router;
