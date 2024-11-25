import express from "express";
import DonateController from "../controllers/donateController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, DonateController.getDonations);
router.post("/:username/donate", DonateController.donateCharge);
router.post("/replay", authMiddleware, DonateController.replayDonation);
router.post("/test", authMiddleware, DonateController.testDonation);

export default router;
