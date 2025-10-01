import { Request, Response, NextFunction } from "express";
import { AssessmentCreationService } from "../../services/skillAssessment/assessmentCreation.service";
import { CustomError } from "../../utils/customError";

export class AssessmentCreationController {
  // Create new assessment (Developer only)
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

  // Get all assessments for management (Developer only)
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

  // Get assessment by ID for editing (Developer only)
  public static async getAssessmentForEditing(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');

      const result = await AssessmentCreationService.getAssessmentById(assessmentId, role);

      res.status(200).json({
        success: true,
        message: "Assessment retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update assessment (Developer only)
  public static async updateAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');
      const updateData = req.body;

      const result = await AssessmentCreationService.updateAssessment(assessmentId, userId, updateData);

      res.status(200).json({
        success: true,
        message: "Assessment updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete assessment (Developer only)
  public static async deleteAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');

      const result = await AssessmentCreationService.deleteAssessment(assessmentId, userId);

      res.status(200).json({
        success: true,
        message: "Assessment deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get developer's assessments
  public static async getDeveloperAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Mock implementation
      const result = {
        assessments: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };

      res.status(200).json({
        success: true,
        message: "Developer assessments retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Search assessments (Developer only)
  public static async searchAssessments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;
      const searchTerm = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!searchTerm) {
        throw new CustomError("Search term is required", 400);
      }

      // Mock implementation
      const result = {
        assessments: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };

      res.status(200).json({
        success: true,
        message: "Assessment search completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment statistics (Developer only)
  public static async getAssessmentStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;

      // Mock implementation
      const result = { totalAssessments: 0, totalQuestions: 0 };

      res.status(200).json({
        success: true,
        message: "Assessment statistics retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Duplicate assessment (Developer only)
  public static async duplicateAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');
      const { title } = req.body;

      // Mock implementation
      const result = { id: Date.now(), title: (title || 'Assessment') + ' (Copy)' };

      res.status(201).json({
        success: true,
        message: "Assessment duplicated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
