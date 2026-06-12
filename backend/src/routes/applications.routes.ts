// src/routes/applications.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applications.controller";

const router = Router();

router.use(authenticate);

router.get("/", getApplications);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;