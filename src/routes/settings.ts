import express from "express";
import SettingController from "../controllers/SettingController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/overlays/:overlayCode",
  authMiddleware,
  SettingController.getOverlaySetting
);
router.post(
  "/overlays/:overlayCode",
  authMiddleware,
  SettingController.setOverlaySetting
);

export default router;
