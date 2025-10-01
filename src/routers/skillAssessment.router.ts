import { Router } from "express";
import { SkillAssessmentController } from "../controllers/skillAssessment/skillAssessment.controller";
import { BadgeTemplateController } from "../controllers/skillAssessment/badgeTemplate.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifySubscription, checkAssessmentLimits } from "../middlewares/verifySubscription";
import { UserRole } from "../generated/prisma";
import { uploadSingle } from "../middlewares/uploadImage";
import {
  validateCreateAssessment,
  validateUpdateAssessment,
  validateSubmitAssessment,
  validateAssessmentId,
  validatePagination,
  validateCertificateCode,
  validateResultId,
} from "../middlewares/validator/skillAssessment.validator";
import {
  validateCreateBadgeTemplate,
  validateUpdateBadgeTemplate,
  validateSearchBadgeTemplate,
  validateTemplateId,
  validateCategory,
} from "../middlewares/validator/badgeTemplate.validator";
import { verifyRole } from "../middlewares/verifyRole";

class SkillAssessmentRouter {
  private route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.route.get(
      "/verify/:certificateCode",
      validateCertificateCode,
      SkillAssessmentController.verifyCertificate
    );

    // Certificate download (authenticated)
    this.route.get(
      "/certificates/:resultId/download",
      verifyToken,
      verifyRole([UserRole.USER]),
      validateResultId,
      SkillAssessmentController.downloadCertificate
    );

    // Assessment discovery (public)
    this.route.get(
      "/assessments",
      validatePagination,
      SkillAssessmentController.getAssessments
    );

    // Developer routes (create and manage assessments)
    this.route.post(
      "/assessments",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateCreateAssessment,
      SkillAssessmentController.createAssessment
    );

    // Get single assessment by ID (for editing) - MUST BE BEFORE general list
    this.route.get(
      "/developer/assessments/:assessmentId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateAssessmentId,
      SkillAssessmentController.getAssessmentById
    );

    this.route.get(
      "/developer/assessments",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentController.getDeveloperAssessments
    );

    this.route.patch(
      "/assessments/:assessmentId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateAssessmentId,
      validateUpdateAssessment,
      SkillAssessmentController.updateAssessment
    );

    this.route.delete(
      "/assessments/:assessmentId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateAssessmentId,
      SkillAssessmentController.deleteAssessment
    );

    this.route.get(
      "/assessments/:assessmentId/results",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateAssessmentId,
      SkillAssessmentController.getAssessmentResults
    );

    // User routes (take assessments - subscription required)
    this.route.get(
      "/assessments/:assessmentId/take",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      validateAssessmentId,
      SkillAssessmentController.getAssessmentForUser
    );

    this.route.post(
      "/assessments/:assessmentId/submit",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      checkAssessmentLimits,
      validateAssessmentId,
      validateSubmitAssessment,
      SkillAssessmentController.submitAssessment
    );

    this.route.get(
      "/user/results",
      verifyToken,
      verifyRole([UserRole.USER]),
      SkillAssessmentController.getUserResults
    );

    // Alias for user results (singular)
    this.route.get(
      "/user/result",
      verifyToken,
      verifyRole([UserRole.USER]),
      SkillAssessmentController.getUserResults
    );

    this.route.get(
      "/user/badges",
      verifyToken,
      verifyRole([UserRole.USER]),
      SkillAssessmentController.getUserBadges
    );

    // Badge Template Management Routes (Developer only)
    this.route.post(
      "/badge-templates",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      uploadSingle("icon"), // File upload for badge icon
      BadgeTemplateController.createBadgeTemplate
    );

    this.route.get(
      "/badge-templates",
      BadgeTemplateController.getAllBadgeTemplates
    );

    this.route.get(
      "/badge-templates/search",
      validateSearchBadgeTemplate,
      BadgeTemplateController.searchBadgeTemplates
    );

    this.route.get(
      "/badge-templates/popular",
      BadgeTemplateController.getPopularBadgeTemplates
    );

    this.route.get(
      "/badge-templates/category/:category",
      validateCategory,
      BadgeTemplateController.getBadgeTemplatesByCategory
    );

    this.route.get(
      "/developer/badge-templates",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      BadgeTemplateController.getDeveloperBadgeTemplates
    );

    this.route.get(
      "/badge-templates/:templateId",
      validateTemplateId,
      BadgeTemplateController.getBadgeTemplateById
    );

    this.route.patch(
      "/badge-templates/:templateId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateTemplateId,
      uploadSingle("icon"), // Optional file upload for badge icon update
      validateUpdateBadgeTemplate,
      BadgeTemplateController.updateBadgeTemplate
    );

    this.route.delete(
      "/badge-templates/:templateId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      validateTemplateId,
      BadgeTemplateController.deleteBadgeTemplate
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SkillAssessmentRouter;
