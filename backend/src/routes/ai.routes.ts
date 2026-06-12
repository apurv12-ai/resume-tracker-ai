import { Router } from "express";
import { tailorResume } from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/tailor", tailorResume);

export default router;