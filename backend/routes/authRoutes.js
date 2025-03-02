import { signUp, login, logout, loginWithGoogle } from "../controllers/authControllers.js";
import express from "express";
import { verfyToken } from "../controllers/verifytokenController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/google-login", loginWithGoogle);
router.get("/verify-token", authenticate, verfyToken);

export default router;