"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessmentManagement_controller_1 = require("../controllers/skillAssessment/assessmentManagement.controller");
const assessmentTaking_controller_1 = require("../controllers/skillAssessment/assessmentTaking.controller");
const questionManagement_controller_1 = require("../controllers/skillAssessment/questionManagement.controller");
const certificateManagement_controller_1 = require("../controllers/skillAssessment/certificateManagement.controller");
const badgeTemplate_controller_1 = require("../controllers/skillAssessment/badgeTemplate.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifySubscription_1 = require("../middlewares/verifySubscription");
const prisma_1 = require("../generated/prisma");
const uploadImage_1 = require("../middlewares/uploadImage");
const skillAssessment_validator_1 = require("../middlewares/validator/skillAssessment.validator");
const badgeTemplate_validator_1 = require("../middlewares/validator/badgeTemplate.validator");
const verifyRole_1 = require("../middlewares/verifyRole");
class SkillAssessmentRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Public routes
        this.route.get("/verify/:certificateCode", skillAssessment_validator_1.SkillAssessmentValidator.validateCertificateCode, certificateManagement_controller_1.CertificateManagementController.verifyCertificate);
        // Certificate view (public - inline PDF view)
        this.route.get("/certificates/:certificateCode/view", skillAssessment_validator_1.SkillAssessmentValidator.validateCertificateCode, certificateManagement_controller_1.CertificateManagementController.viewCertificate);
        // Certificate download (authenticated)
        this.route.get("/certificates/:resultId/download", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), skillAssessment_validator_1.SkillAssessmentValidator.validateResultId, certificateManagement_controller_1.CertificateManagementController.downloadCertificate);
        // Assessment discovery (subscription required)
        this.route.get("/assessments", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, skillAssessment_validator_1.SkillAssessmentValidator.validatePagination, assessmentManagement_controller_1.AssessmentManagementController.getAssessments);
        // Get single assessment by slug (developer)
        this.route.get("/developer/assessments/slug/:slug", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentSlug, assessmentManagement_controller_1.AssessmentManagementController.getAssessmentBySlug);
        // Developer routes (create and manage assessments)
        this.route.post("/assessments", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateCreateAssessment, assessmentManagement_controller_1.AssessmentManagementController.createAssessment);
        // Get single assessment by ID (for editing) - MUST BE BEFORE general list
        this.route.get("/developer/assessments/:assessmentId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, assessmentManagement_controller_1.AssessmentManagementController.getAssessmentById);
        this.route.get("/developer/assessments", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), assessmentManagement_controller_1.AssessmentManagementController.getDeveloperAssessments);
        this.route.patch("/assessments/:assessmentId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, skillAssessment_validator_1.SkillAssessmentValidator.validateUpdateAssessment, assessmentManagement_controller_1.AssessmentManagementController.updateAssessment);
        this.route.delete("/assessments/:assessmentId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, assessmentManagement_controller_1.AssessmentManagementController.deleteAssessment);
        // Save individual question
        this.route.post("/assessments/questions", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateSaveQuestion, questionManagement_controller_1.QuestionManagementController.saveQuestion);
        this.route.get("/assessments/:assessmentId/results", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, assessmentTaking_controller_1.AssessmentTakingController.getAssessmentResults);
        // User routes (take assessments - subscription required)
        // Place slug route BEFORE numeric ID route to avoid param collision
        this.route.get("/assessments/slug/:slug/take", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentSlug, assessmentTaking_controller_1.AssessmentTakingController.getAssessmentForUserBySlug);
        this.route.get("/assessments/:assessmentId/take", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, assessmentTaking_controller_1.AssessmentTakingController.getAssessmentForUser);
        this.route.post("/assessments/:assessmentId/submit", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, verifySubscription_1.checkAssessmentLimits, skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, skillAssessment_validator_1.SkillAssessmentValidator.validateSubmitAssessment, assessmentTaking_controller_1.AssessmentTakingController.submitAssessment);
        // Get user's attempts for a specific assessment
        this.route.get("/assessments/:assessmentId/my-attempts", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), skillAssessment_validator_1.SkillAssessmentValidator.validateAssessmentId, assessmentTaking_controller_1.AssessmentTakingController.getUserAssessmentAttempts);
        this.route.get("/user/results", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, assessmentTaking_controller_1.AssessmentTakingController.getUserResults);
        // Alias for user results (singular)
        this.route.get("/user/result", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, assessmentTaking_controller_1.AssessmentTakingController.getUserResults);
        this.route.get("/user/badges", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.USER]), verifySubscription_1.verifySubscription, certificateManagement_controller_1.CertificateManagementController.getUserBadges);
        // Badge Template Management Routes (Developer only)
        this.route.post("/badge-templates", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), (0, uploadImage_1.uploadSingle)("icon"), // File upload for badge icon
        badgeTemplate_controller_1.BadgeTemplateController.createBadgeTemplate);
        this.route.get("/badge-templates", badgeTemplate_controller_1.BadgeTemplateController.getAllBadgeTemplates);
        this.route.get("/badge-templates/search", badgeTemplate_validator_1.validateSearchBadgeTemplate, badgeTemplate_controller_1.BadgeTemplateController.searchBadgeTemplates);
        this.route.get("/badge-templates/popular", badgeTemplate_controller_1.BadgeTemplateController.getPopularBadgeTemplates);
        this.route.get("/badge-templates/category/:category", badgeTemplate_validator_1.validateCategory, badgeTemplate_controller_1.BadgeTemplateController.getBadgeTemplatesByCategory);
        this.route.get("/developer/badge-templates", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), badgeTemplate_controller_1.BadgeTemplateController.getDeveloperBadgeTemplates);
        this.route.get("/badge-templates/:templateId", badgeTemplate_validator_1.validateTemplateId, badgeTemplate_controller_1.BadgeTemplateController.getBadgeTemplateById);
        this.route.patch("/badge-templates/:templateId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), badgeTemplate_validator_1.validateTemplateId, (0, uploadImage_1.uploadSingle)("icon"), // Optional file upload for badge icon update
        badgeTemplate_validator_1.validateUpdateBadgeTemplate, badgeTemplate_controller_1.BadgeTemplateController.updateBadgeTemplate);
        this.route.delete("/badge-templates/:templateId", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), badgeTemplate_validator_1.validateTemplateId, badgeTemplate_controller_1.BadgeTemplateController.deleteBadgeTemplate);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SkillAssessmentRouter;
//# sourceMappingURL=skillAssessment.router.js.map