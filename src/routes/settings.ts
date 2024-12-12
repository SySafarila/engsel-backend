import express from "express";
import SettingController from "../controllers/SettingController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/overlays/:overlayCode", SettingController.getOverlaySetting);
router.post(
  "/overlays/:overlayCode",
  authMiddleware,
  SettingController.setOverlaySetting
);
router.get("/min-tts", authMiddleware, SettingController.getMinTts);
router.patch("/min-tts", authMiddleware, SettingController.minTts);

export default router;
