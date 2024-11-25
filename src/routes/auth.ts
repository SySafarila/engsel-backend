import express from "express";
import loginController from "../controllers/loginController";
import logoutController from "../controllers/logoutController";
import meController from "../controllers/meController";
import registerController from "../controllers/registerController";
import updateAccountController from "../controllers/updateAccount";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/me", authMiddleware, meController);
router.patch("/me", authMiddleware, updateAccountController);
router.post("/logout", authMiddleware, logoutController);

export default router;
