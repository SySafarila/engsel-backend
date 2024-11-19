import express from "express";
import {
  donateCharge,
  getDonations,
  replayDonation,
} from "../controllers/donateController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/donations", authMiddleware, getDonations);
router.post("/donations/:username/donate", donateCharge);
router.post("/donations/replay", authMiddleware, replayDonation);

export default router;
