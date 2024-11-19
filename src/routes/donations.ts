import express from "express";
import {
  donateCharge,
  getDonations,
  replayDonation,
  testDonation,
} from "../controllers/donateController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/donations", authMiddleware, getDonations);
router.post("/donations/:username/donate", donateCharge);
router.post("/donations/replay", authMiddleware, replayDonation);
router.post("/donations/test", authMiddleware, testDonation);

export default router;
