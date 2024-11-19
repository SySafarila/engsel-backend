import express from "express";
import loginController from "../controllers/loginController";
import logoutController from "../controllers/logoutController";
import meController from "../controllers/meController";
import registerController from "../controllers/registerController";
import updateAccountController from "../controllers/updateAccount";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);
router.get("/auth/me", authMiddleware, meController);
router.patch("/auth/me", authMiddleware, updateAccountController);
router.post("/auth/logout", authMiddleware, logoutController);

export default router;
