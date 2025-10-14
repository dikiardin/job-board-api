import { Request, Response, NextFunction } from "express";
import { AssessmentCreationService } from "../../services/skillAssessment/assessmentCreation.service";
import { ControllerHelper } from "../../utils/controllerHelper";

export class AssessmentManagementController {
  public static async createAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const {
        title,
        description,
        category,
        questions,
        badgeTemplateId,
        passScore,
      } = req.body;

      ControllerHelper.validateRequired(
        { title, category },
        "Title and category are required"
      );

      if (!Array.isArray(questions)) {
        return res.status(400).json({ message: "Questions must be an array" });
      }

      if (questions.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one question is required" });
      }

      // Validate each question
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.question.trim()) {
          return res
            .status(400)
            .json({ message: `Question ${i + 1}: Question text is required` });
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          return res.status(400).json({
            message: `Question ${i + 1}: Must have exactly 4 options`,
          });
        }
        if (!q.answer || !q.answer.trim()) {
          return res
            .status(400)
            .json({ message: `Question ${i + 1}: Answer is required` });
        }
        if (!q.options.includes(q.answer)) {
          return res.status(400).json({
            message: `Question ${i + 1}: Answer must be one of the options`,
          });
        }
      }

      const assessment = await AssessmentCreationService.createAssessment({
        title,
        description,
        category,
        badgeTemplateId,
        passScore,
        createdBy: userId,
        userRole: role,
        questions,
      });

      res.status(201).json({
        success: true,
        message: "Assessment created successfully",
        data: assessment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public static async getAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt((req.query.page as string) || "1");
      const limit = parseInt((req.query.limit as string) || "10");

      const result = await AssessmentCreationService.getAssessments(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Assessments retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      const assessment = await AssessmentCreationService.getAssessmentById(
        assessmentId,
        role
      );

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessmentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;
      const slug = (req.params as any).slug as string;

      const assessment = await AssessmentCreationService.getAssessmentBySlug(
        slug,
        role
      );

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);
      const {
        title,
        description,
        category,
        badgeTemplateId,
        passScore,
        questions,
      } = req.body;

      const result = await AssessmentCreationService.updateAssessment(
        assessmentId,
        userId,
        { title, description, category, badgeTemplateId, passScore, questions }
      );

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      const result = await AssessmentCreationService.deleteAssessment(
        assessmentId,
        userId
      );

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  public static async getDeveloperAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const assessments = await AssessmentCreationService.getAssessments(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Developer assessments retrieved successfully",
        data: assessments,
      });
    } catch (error) {
      next(error);
    }
  }
}
