import express from "express";
import {
  donateCharge,
  getDonations,
  replayDonation,
  testDonation,
} from "../controllers/donateController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getDonations);
router.post("/:username/donate", donateCharge);
router.post("/replay", authMiddleware, replayDonation);
router.post("/test", authMiddleware, testDonation);

export default router;
