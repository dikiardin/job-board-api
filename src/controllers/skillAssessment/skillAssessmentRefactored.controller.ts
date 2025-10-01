import { Request, Response, NextFunction } from "express";
import { AssessmentCreationService } from "../../services/skillAssessment/assessmentCreation.service";
import { AssessmentExecutionService } from "../../services/skillAssessment/assessmentExecution.service";
import { AssessmentSubmissionService } from "../../services/skillAssessment/assessmentSubmission.service";
import { CustomError } from "../../utils/customError";

export class AssessmentManagementController {
  // ===== ASSESSMENT CREATION (Developer Only) =====
  
  // Create new assessment
  public static async createAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentData = req.body;

      const result = await AssessmentCreationService.createAssessment({
        ...assessmentData,
        createdBy: userId,
        userRole: role,
      });

      res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all assessments for management
  public static async getAssessmentsForManagement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AssessmentCreationService.getAssessments(page, limit);

      res.status(200).json({
        success: true,
        message: "Assessments retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update assessment
  public static async updateAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const updateData = req.body;

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await AssessmentCreationService.updateAssessment(
        assessmentId,
        updateData,
        role
      );

      res.status(200).json({
        success: true,
        message: "Assessment updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete assessment
  public static async deleteAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      await AssessmentCreationService.deleteAssessment(assessmentId, role);

      res.status(200).json({
        success: true,
        message: "Assessment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // ===== ASSESSMENT TAKING (User with Subscription) =====

  // Get assessment for taking
  public static async getAssessmentForTaking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await AssessmentExecutionService.getAssessmentForTaking(
        assessmentId,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit assessment answers
  public static async submitAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const { answers, timeSpent } = req.body;

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await AssessmentSubmissionService.submitAssessment({
        assessmentId,
        userId,
        answers,
        timeSpent,
      });

      res.status(200).json({
        success: true,
        message: "Assessment submitted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
