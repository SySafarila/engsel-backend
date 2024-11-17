import express from "express";
import { getDonations } from "../controllers/donateController";
import loginController from "../controllers/loginController";
import logoutController from "../controllers/logoutController";
import meController from "../controllers/meController";
import registerController from "../controllers/registerController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);
router.get("/auth/me", authMiddleware, meController);
router.post("/auth/logout", authMiddleware, logoutController);
router.get("/auth/donations", authMiddleware, getDonations);

export default router;
