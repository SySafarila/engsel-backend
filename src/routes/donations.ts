import express from "express";
import DonateController from "../controllers/DonateController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, DonateController.getDonations);
router.post("/:username/donate", DonateController.charge);
router.post("/replay", authMiddleware, DonateController.replay);
router.post("/test", authMiddleware, DonateController.test);

export default router;
