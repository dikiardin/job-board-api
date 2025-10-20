import { Router } from "express";
import { cvMainController } from "../controllers/cv/cv.main.controller";
import { cvDownloadController } from "../controllers/cv/cv.download.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateCVGeneration } from "../middlewares/validator/cv.validator";
import {
  checkSubscription,
  checkCVGenerationLimit,
  checkTemplateAccess,
} from "../middlewares/subscription.middleware";

const router = Router();

// Public download routes (no auth required)
router.get("/public/:id/:filename", cvDownloadController.publicDownloadCV);
router.get("/public/:id", cvDownloadController.publicDownloadCV);

// All other CV routes require authentication
router.use(authMiddleware);

// All CV routes require active subscription
router.use(checkSubscription);

// Get available CV templates (filtered by subscription)
router.get("/templates", cvDownloadController.getTemplates);

// Generate new CV (with subscription limits)
router.post(
  "/generate",
  validateCVGeneration,
  checkCVGenerationLimit,
  checkTemplateAccess,
  cvMainController.generateCV
);

// Get user's CVs
router.get("/", cvMainController.getUserCVs);

// Get specific CV by ID
router.get("/:id", cvMainController.getCVById);

// Download CV
router.get("/:id/download", cvDownloadController.downloadCV);

// Update CV
router.patch(
  "/:id",
  validateCVGeneration,
  checkTemplateAccess,
  cvMainController.updateCV
);

// Delete CV
router.delete("/:id", cvMainController.deleteCV);

export default router;
