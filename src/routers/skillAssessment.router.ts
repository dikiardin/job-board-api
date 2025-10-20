import { Router } from "express";
import { AssessmentManagementController } from "../controllers/skillAssessment/assessmentManagement.controller";
import { AssessmentTakingController } from "../controllers/skillAssessment/assessmentTaking.controller";
import { QuestionManagementController } from "../controllers/skillAssessment/questionManagement.controller";
import { CertificateManagementController } from "../controllers/skillAssessment/certificateManagement.controller";
import { BadgeTemplateController } from "../controllers/skillAssessment/badgeTemplate.controller";
import { verifyToken } from "../middlewares/verifyToken";
import {
  verifySubscription,
  checkAssessmentLimits,
} from "../middlewares/verifySubscription";
import { UserRole } from "../generated/prisma";
import { uploadSingle } from "../middlewares/uploadImage";
import { SkillAssessmentValidator } from "../middlewares/validator/skillAssessment.validator";
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
    this.initializePublicRoutes();
    this.initializeDeveloperRoutes();
    this.initializeUserRoutes();
    this.initializeBadgeTemplateRoutes();
  }

  private initializePublicRoutes(): void {
    this.route.get(
      "/verify/:certificateCode",
      SkillAssessmentValidator.validateCertificateCode,
      CertificateManagementController.verifyCertificate
    );

    this.route.get(
      "/certificates/:certificateCode/view",
      SkillAssessmentValidator.validateCertificateCode,
      CertificateManagementController.viewCertificate
    );

    this.route.get(
      "/certificates/:resultId/download",
      verifyToken,
      verifyRole([UserRole.USER]),
      SkillAssessmentValidator.validateResultId,
      CertificateManagementController.downloadCertificate
    );

    this.route.get(
      "/assessments",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      SkillAssessmentValidator.validatePagination,
      AssessmentManagementController.getAssessments
    );
  }

  private initializeDeveloperRoutes(): void {
    this.route.get(
      "/developer/assessments/slug/:slug",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateAssessmentSlug,
      AssessmentManagementController.getAssessmentBySlug
    );
    this.route.post(
      "/assessments",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateCreateAssessment,
      AssessmentManagementController.createAssessment
    );

    this.route.get(
      "/developer/assessments/:assessmentId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateAssessmentId,
      AssessmentManagementController.getAssessmentById
    );

    this.route.get(
      "/developer/assessments",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      AssessmentManagementController.getDeveloperAssessments
    );

    this.route.patch(
      "/assessments/:assessmentId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateAssessmentId,
      SkillAssessmentValidator.validateUpdateAssessment,
      AssessmentManagementController.updateAssessment
    );

    this.route.delete(
      "/assessments/:assessmentId",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateAssessmentId,
      AssessmentManagementController.deleteAssessment
    );

    this.route.post(
      "/assessments/questions",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateSaveQuestion,
      QuestionManagementController.saveQuestion
    );

    this.route.get(
      "/assessments/:assessmentId/results",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      SkillAssessmentValidator.validateAssessmentId,
      AssessmentTakingController.getAssessmentResults
    );
  }

  private initializeUserRoutes(): void {
    this.route.get(
      "/assessments/slug/:slug/take",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      SkillAssessmentValidator.validateAssessmentSlug,
      AssessmentTakingController.getAssessmentForUserBySlug
    );

    this.route.get(
      "/assessments/:assessmentId/take",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      SkillAssessmentValidator.validateAssessmentId,
      AssessmentTakingController.getAssessmentForUser
    );

    this.route.post(
      "/assessments/:assessmentId/submit",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      checkAssessmentLimits,
      SkillAssessmentValidator.validateAssessmentId,
      SkillAssessmentValidator.validateSubmitAssessment,
      AssessmentTakingController.submitAssessment
    );

    // Get user's attempts for a specific assessment
    this.route.get(
      "/assessments/:assessmentId/my-attempts",
      verifyToken,
      verifyRole([UserRole.USER]),
      SkillAssessmentValidator.validateAssessmentId,
      AssessmentTakingController.getUserAssessmentAttempts
    );

    this.route.get(
      "/user/results",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      AssessmentTakingController.getUserResults
    );

    // Alias for user results (singular)
    this.route.get(
      "/user/result",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      AssessmentTakingController.getUserResults
    );

    this.route.get(
      "/user/badges",
      verifyToken,
      verifyRole([UserRole.USER]),
      verifySubscription,
      CertificateManagementController.getUserBadges
    );
  }

  private initializeBadgeTemplateRoutes(): void {
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
