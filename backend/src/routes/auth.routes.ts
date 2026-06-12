// src/routes/auth.routes.ts
import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route — requires JWT
router.get("/me", authenticate, getMe);

export default router;
