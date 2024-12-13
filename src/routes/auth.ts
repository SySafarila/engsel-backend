import express from "express";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/authMiddleware";
import logoutMiddleware from "../middlewares/logoutMiddleware";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/me", authMiddleware, AuthController.me);
router.patch("/me", authMiddleware, AuthController.updateMe);
router.post("/logout", logoutMiddleware, AuthController.logout);

export default router;
