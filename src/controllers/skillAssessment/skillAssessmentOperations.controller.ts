import { Request, Response, NextFunction } from "express";
import { SkillAssessmentService } from "../../services/skillAssessment/skillAssessment.service";
import { CustomError } from "../../utils/customError";

export class SkillAssessmentOperationsController {
  // Create assessment (Developer only)
  public static async createAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const { title, description, questions, badgeTemplateId } = req.body;

      if (!title || !questions) {
        throw new CustomError("Title and questions are required", 400);
      }

      const assessment = await SkillAssessmentService.createAssessment({
        title,
        description,
        badgeTemplateId,
        createdBy: userId,
        userRole: role,
        questions,
      });

      res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all assessments (for discovery)
  public static async getAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');

      const result = await SkillAssessmentService.getAssessments(page, limit);

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

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await SkillAssessmentService.getAssessmentForTaking(assessmentId, userId);

      res.status(200).json({
        success: true,
        message: "Assessment retrieved for taking",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit assessment
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

      const result = await SkillAssessmentService.submitAssessment({
        assessmentId: parseInt(assessmentId),
        userId,
        startedAt: new Date(Date.now() - (Number(timeSpent) || 0) * 1000).toISOString(),
        answers,
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

  // Get user's assessment results
  public static async getUserResults(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');

      const result = await SkillAssessmentService.getUserResults(userId);

      res.status(200).json({
        success: true,
        message: "User results retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get specific assessment result
  public static async getAssessmentResult(
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

      // Use getUserResults to get specific result (mock implementation)
      const resultsData = await SkillAssessmentService.getUserResults(userId);
      const result = (resultsData as any).results?.find((r: any) => r.assessmentId === assessmentId) || null;

      res.status(200).json({
        success: true,
        message: "Assessment result retrieved successfully",
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
      const limit = parseInt((req.query.limit as string) || '10');

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await SkillAssessmentService.getAssessmentLeaderboard(assessmentId, limit);

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

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await SkillAssessmentService.getAssessmentStats(assessmentId);

      res.status(200).json({
        success: true,
        message: "Assessment statistics retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
