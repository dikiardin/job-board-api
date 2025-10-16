"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cv_main_controller_1 = require("../controllers/cv/cv.main.controller");
const cv_download_controller_1 = require("../controllers/cv/cv.download.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cv_validator_1 = require("../middlewares/validator/cv.validator");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const router = (0, express_1.Router)();
// Public download routes (no auth required)
router.get("/public/:id/:filename", cv_download_controller_1.cvDownloadController.publicDownloadCV);
router.get("/public/:id", cv_download_controller_1.cvDownloadController.publicDownloadCV);
// All other CV routes require authentication
router.use(auth_middleware_1.authMiddleware);
// All CV routes require active subscription
router.use(subscription_middleware_1.checkSubscription);
// Get available CV templates (filtered by subscription)
router.get("/templates", cv_download_controller_1.cvDownloadController.getTemplates);
// Generate new CV (with subscription limits)
router.post("/generate", cv_validator_1.validateCVGeneration, subscription_middleware_1.checkCVGenerationLimit, subscription_middleware_1.checkTemplateAccess, cv_main_controller_1.cvMainController.generateCV);
// Get user's CVs
router.get("/", cv_main_controller_1.cvMainController.getUserCVs);
// Get specific CV by ID
router.get("/:id", cv_main_controller_1.cvMainController.getCVById);
// Download CV
router.get("/:id/download", cv_download_controller_1.cvDownloadController.downloadCV);
// Update CV
router.patch("/:id", cv_validator_1.validateCVGeneration, subscription_middleware_1.checkTemplateAccess, cv_main_controller_1.cvMainController.updateCV);
// Delete CV
router.delete("/:id", cv_main_controller_1.cvMainController.deleteCV);
exports.default = router;
