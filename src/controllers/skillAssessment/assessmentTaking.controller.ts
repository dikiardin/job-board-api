import { Request, Response, NextFunction } from "express";
import { AssessmentSubmissionService } from "../../services/skillAssessment/assessmentSubmission.service";
import { AssessmentResultsService } from "../../services/skillAssessment/assessmentResults.service";
import { ControllerHelper } from "../../utils/controllerHelper";

export class AssessmentTakingController {
  public static async getAssessmentForUserBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const slug = (req.params as any).slug as string;

      const { SkillAssessmentModularRepository } = await import(
        "../../repositories/skillAssessment/skillAssessmentModular.repository"
      );

      let assessment =
        await SkillAssessmentModularRepository.getAssessmentBySlug(slug);
      if (!assessment) {
        const numericId = parseInt(slug as any, 10);
        if (!isNaN(numericId)) {
          assessment = await SkillAssessmentModularRepository.getAssessmentById(
            numericId
          );
        }
      }
      if (!assessment) {
        throw new Error(`Assessment with slug ${slug} not found`);
      }

      const assessmentId = (assessment as any).id as number;

      const { AssessmentSubmissionService } = await import(
        "../../services/skillAssessment/assessmentSubmission.service"
      );
      const assessmentForUser =
        await AssessmentSubmissionService.getAssessmentForTaking(assessmentId);

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: assessmentForUser,
      });
    } catch (error) {
      next(error);
    }
  }
  public static async getAssessmentForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      // Check if assessment exists first
      const assessmentExists =
        await AssessmentSubmissionService.checkAssessmentExists(assessmentId);

      if (!assessmentExists) {
        throw new Error(`Assessment with ID ${assessmentId} not found`);
      }

      // Get assessment for user (without answers)
      const assessment =
        await AssessmentSubmissionService.getAssessmentForTaking(assessmentId);

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: assessment,
      });
    } catch (error) {
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
        userId,
        assessmentId,
        answers,
        startedAt,
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

      const results = await AssessmentResultsService.getUserResults(
        userId,
        page,
        limit
      );

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
      const results =
        role === "DEVELOPER"
          ? await AssessmentSubmissionService.getAllAssessmentResults(
              assessmentId,
              userId
            )
          : await AssessmentSubmissionService.getAssessmentResult(
              userId,
              assessmentId
            );

      res.status(200).json({
        success: true,
        message: "Assessment results retrieved successfully",
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getUserAssessmentAttempts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      const attempts =
        await AssessmentSubmissionService.getUserAssessmentAttempts(
          userId,
          assessmentId
        );

      res.status(200).json({
        success: true,
        message: "User assessment attempts retrieved successfully",
        data: attempts,
      });
    } catch (error) {
      next(error);
    }
  }
}
