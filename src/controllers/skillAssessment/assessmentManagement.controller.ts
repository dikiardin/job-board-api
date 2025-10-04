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
      const { title, description, category, questions, badgeTemplateId } = req.body;

      console.log('=== CREATE ASSESSMENT DEBUG ===');
      console.log('User ID:', userId);
      console.log('User Role:', role);
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
      console.log('Title:', title);
      console.log('Category:', category);
      console.log('Questions:', questions);
      console.log('================================');

      ControllerHelper.validateRequired({ title, category }, "Title and category are required");
      
      if (!Array.isArray(questions)) {
        return res.status(400).json({ message: "Questions must be an array" });
      }

      const assessment = await AssessmentCreationService.createAssessment({
        title, description, category, badgeTemplateId, createdBy: userId, userRole: role, questions,
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

  public static async getAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');

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

  public static async getAssessmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = ControllerHelper.parseId(req.params.assessmentId);

      const assessment = await AssessmentCreationService.getAssessmentById(assessmentId, role);

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
      const { title, description, category, badgeTemplateId, questions } = req.body;

      const result = await AssessmentCreationService.updateAssessment(
        assessmentId, userId, { title, description, category, badgeTemplateId, questions }
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

      const result = await AssessmentCreationService.deleteAssessment(assessmentId, userId);

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

      const assessments = await AssessmentCreationService.getAssessments(page, limit);

      res.status(200).json({
        success: true,
        message: "Developer assessments retrieved successfully",
        data: assessments,
      });
    } catch (error) {
      console.error(`[ERROR] getDeveloperAssessments:`, error);
      next(error);
    }
  }
}
