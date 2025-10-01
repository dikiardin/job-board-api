import { Request, Response, NextFunction } from "express";
import { SkillAssessmentService } from "../../services/skillAssessment/skillAssessment.service";
import { BadgeService } from "../../services/skillAssessment/badge.service";
import { CustomError } from "../../utils/customError";

export class SkillAssessmentController {
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

  // Get assessment for taking (authenticated users with subscription)
  public static async getAssessmentForUser(
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

      const assessment = await SkillAssessmentService.getAssessmentForUser(
        assessmentId,
        userId
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

  // Submit assessment answers
  public static async submitAssessment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const { answers } = req.body;

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await SkillAssessmentService.submitAssessment({
        userId,
        assessmentId,
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

      const results = await SkillAssessmentService.getUserResults(userId);

      res.status(200).json({
        success: true,
        message: "User results retrieved successfully",
        data: results,
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

      const assessments = await SkillAssessmentService.getDeveloperAssessments(
        userId,
        role
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

  // Download certificate (User only)
  public static async downloadCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const resultId = parseInt(req.params.resultId || '0');

      if (isNaN(resultId)) {
        throw new CustomError("Invalid result ID", 400);
      }

      const certificateData = await SkillAssessmentService.downloadCertificate(resultId, userId);

      // Fetch PDF from Cloudinary and stream to client
      let response = await fetch(certificateData.certificateUrl);

      if (!response.ok) {
        // Try without .pdf extension (fallback like CV)
        const urlWithoutPdf = certificateData.certificateUrl.replace('.pdf', '');
        response = await fetch(urlWithoutPdf);
      }

      if (!response.ok) {
        // As fallback, redirect to original Cloudinary URL
        return res.redirect(certificateData.certificateUrl);
      }

      const buffer = await response.arrayBuffer();
      const pdfBuffer = Buffer.from(buffer);
      const pdfHeader = pdfBuffer.toString('ascii', 0, 4);

      if (!pdfHeader.startsWith('%PDF')) {
        throw new CustomError('Invalid certificate file', 500);
      }

      // Set proper headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateData.certificateCode}.pdf"`);
      res.setHeader('Content-Length', buffer.byteLength.toString());
      res.setHeader('Cache-Control', 'no-cache');

      // Send the PDF buffer
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  // Verify certificate (Public)
  public static async verifyCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { certificateCode } = req.params;

      if (!certificateCode) {
        throw new CustomError("Certificate code is required", 400);
      }

      const result = await SkillAssessmentService.verifyCertificate(certificateCode);

      res.status(200).json({
        success: true,
        message: "Certificate verified successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment results (Developer only)
  public static async getAssessmentResults(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const results = await SkillAssessmentService.getAssessmentResults(assessmentId, userId, role);

      res.status(200).json({
        success: true,
        message: "Assessment results retrieved successfully",
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user badges
  public static async getUserBadges(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;

      const badges = await BadgeService.getUserBadges(userId);

      res.status(200).json({
        success: true,
        message: "User badges retrieved successfully",
        data: badges,
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
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const { title, description, badgeTemplateId, questions } = req.body;

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await SkillAssessmentService.updateAssessment(
        assessmentId,
        userId,
        role,
        { title, description, badgeTemplateId, questions }
      );

      res.status(200).json({
        success: true,
        ...result,
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
      const assessmentId = parseInt(req.params.assessmentId || '0');

      if (isNaN(assessmentId)) {
        throw new CustomError("Invalid assessment ID", 400);
      }

      const result = await SkillAssessmentService.deleteAssessment(
        assessmentId,
        userId,
        role
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
