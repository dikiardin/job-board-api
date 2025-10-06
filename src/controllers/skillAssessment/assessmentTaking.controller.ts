import { Request, Response, NextFunction } from "express";
import { AssessmentSubmissionService } from "../../services/skillAssessment/assessmentSubmission.service";
import { AssessmentResultsService } from "../../services/skillAssessment/assessmentResults.service";
import { ControllerHelper } from "../../utils/controllerHelper";

export class AssessmentTakingController {
  public static async getAssessmentForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      // Check if assessment exists first
      const assessmentExists = await AssessmentSubmissionService.checkAssessmentExists(assessmentId);
      
      if (!assessmentExists) {
        throw new Error(`Assessment with ID ${assessmentId} not found`);
      }
      
      // Get assessment for user (without answers)
      const assessment = await AssessmentSubmissionService.getAssessmentForTaking(assessmentId);

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: assessment,
      });
    } catch (error) {
      console.error("Error in getAssessmentForUser:", error);
      next(error);
    }
  }

  public static async submitAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);
      const { answers, startedAt } = req.body;

      const result = await AssessmentSubmissionService.submitAssessment({
        userId, assessmentId, answers, timeSpent: 30,
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

  public static async getUserResults(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const results = await AssessmentResultsService.getUserResults(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "User results retrieved successfully",
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessmentResults(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      // For developers, get all results for the assessment
      // For users, get only their specific result
      const results = role === 'DEVELOPER' 
        ? await AssessmentSubmissionService.getAllAssessmentResults(assessmentId)
        : await AssessmentSubmissionService.getAssessmentResult(userId, assessmentId);

      res.status(200).json({
        success: true,
        message: "Assessment results retrieved successfully",
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
}
