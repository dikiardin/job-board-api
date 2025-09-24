"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cv_controller_1 = require("../controllers/cv/cv.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cv_validator_1 = require("../middlewares/validator/cv.validator");
const router = (0, express_1.Router)();
// All CV routes require authentication
router.use(auth_middleware_1.authMiddleware);
// Get available CV templates
router.get('/templates', cv_controller_1.cvController.getTemplates);
// Generate new CV
router.post('/generate', cv_validator_1.validateCVGeneration, cv_controller_1.cvController.generateCV);
// Get user's CVs
router.get('/', cv_controller_1.cvController.getUserCVs);
// Get specific CV by ID
router.get('/:id', cv_controller_1.cvController.getCVById);
// Download CV
router.get('/:id/download', cv_controller_1.cvController.downloadCV);
// Delete CV
router.delete('/:id', cv_controller_1.cvController.deleteCV);
exports.default = router;
//# sourceMappingURL=cv.routes.js.map