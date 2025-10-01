import { Request, Response, NextFunction } from "express";
import { AssessmentExecutionService } from "../../services/skillAssessment/assessmentExecution.service";
import { AssessmentSubmissionService } from "../../services/skillAssessment/assessmentSubmission.service";
import { CustomError } from "../../utils/customError";

export class AssessmentExecutionController {
  // Get all assessments for discovery (User with subscription)
  public static async getAssessmentsForDiscovery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Mock implementation
      const result = {
        assessments: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };

      res.status(200).json({
        success: true,
        message: "Assessments retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment for taking (User with subscription)
  public static async getAssessmentForTaking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');

      const result = await AssessmentExecutionService.getAssessmentForTaking(
        assessmentId,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Assessment retrieved for taking",
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
      const { assessmentId, answers, timeSpent } = req.body;

      if (!assessmentId || !answers || timeSpent === undefined) {
        throw new CustomError("Assessment ID, answers, and time spent are required", 400);
      }

      const result = await AssessmentSubmissionService.submitAssessment({
        assessmentId: parseInt(assessmentId),
        userId,
        answers,
        timeSpent: parseInt(timeSpent),
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

  // Get user's assessment results (Mock implementation)
  public static async getUserAssessmentResults(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Mock implementation
      const result = {
        results: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };

      res.status(200).json({
        success: true,
        message: "User assessment results retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AssessmentExecutionService.getAssessmentLeaderboard(
        assessmentId,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Assessment leaderboard retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment statistics
  public static async getAssessmentStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const assessmentId = parseInt(req.params.assessmentId || '0');

      const result = await AssessmentExecutionService.getAssessmentStats(assessmentId);

      res.status(200).json({
        success: true,
        message: "Assessment statistics retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Check if user can retake assessment
  public static async canRetakeAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');

      const canRetake = await AssessmentExecutionService.canRetakeAssessment(userId, assessmentId);

      res.status(200).json({
        success: true,
        message: "Retake eligibility checked",
        data: { canRetake },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get time remaining for assessment
  public static async getTimeRemaining(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');

      // Mock: Get start time (in real app, this would come from database)
      const startTime = new Date(); // This should be fetched from user's assessment session
      const result = await AssessmentExecutionService.getTimeRemaining(startTime);

      res.status(200).json({
        success: true,
        message: "Time remaining retrieved",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
