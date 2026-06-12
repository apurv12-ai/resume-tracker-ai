import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { analyzeResumeATS } from "../controllers/ats.controller";

const router = Router();

router.post(
  "/analyze",
  authenticate,
  upload.single("resume"),
  analyzeResumeATS
);

export default router;