// src/routes/stats.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getStats } from "../controllers/stats.controller";

const router = Router();

router.use(authenticate);
router.get("/", getStats);

export default router;