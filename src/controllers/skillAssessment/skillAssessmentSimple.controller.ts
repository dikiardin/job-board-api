import { Request, Response, NextFunction } from "express";
import { AssessmentCreationService } from "../../services/skillAssessment/assessmentCreation.service";
import { AssessmentExecutionService } from "../../services/skillAssessment/assessmentExecution.service";
import { AssessmentSubmissionService } from "../../services/skillAssessment/assessmentSubmission.service";
import { CertificateVerificationService } from "../../services/skillAssessment/certificateVerification.service";
import { BadgeManagementService } from "../../services/skillAssessment/badgeManagement.service";
import { CustomError } from "../../utils/customError";

export class SkillAssessmentSimpleController {
  // ===== ASSESSMENT CREATION (Developer Only) =====
  
  public static async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.decrypt;
      const result = await AssessmentCreationService.createAssessment({
        ...req.body,
        createdBy: userId,
        userRole: role,
      });
      res.status(201).json({ success: true, message: "Assessment created successfully", data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await AssessmentCreationService.getAssessments(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');
      const result = await AssessmentCreationService.getAssessmentById(assessmentId, role);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async updateAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');
      const result = await AssessmentCreationService.updateAssessment(assessmentId, userId, req.body);
      res.status(200).json({ success: true, message: "Assessment updated successfully", data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');
      const result = await AssessmentCreationService.deleteAssessment(assessmentId, userId);
      res.status(200).json({ success: true, message: "Assessment deleted successfully", data: result });
    } catch (error) {
      next(error);
    }
  }

  // ===== ASSESSMENT EXECUTION (User with Subscription) =====

  public static async getAssessmentForTaking(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.id || '0');
      const result = await AssessmentExecutionService.getAssessmentForTaking(assessmentId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async submitAssessment(req: Request, res: Response, next: NextFunction) {
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
      
      res.status(200).json({ success: true, message: "Assessment submitted successfully", data: result });
    } catch (error) {
      next(error);
    }
  }

  // ===== CERTIFICATE MANAGEMENT =====

  public static async verifyCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      if (!code) throw new CustomError("Certificate code is required", 400);
      
      const result = await CertificateVerificationService.verifyCertificate(code);
      res.status(200).json({ success: true, message: "Certificate verification completed", data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async downloadCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const userId = res.locals.decrypt?.userId;
      
      if (!code) throw new CustomError("Certificate code is required", 400);
      
      const result = await CertificateVerificationService.downloadCertificate(code, userId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${code}.pdf"`);
      res.send(Buffer.from('Mock PDF content')); // Mock buffer
    } catch (error) {
      next(error);
    }
  }

  public static async getUserCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await CertificateVerificationService.getUserCertificates(userId, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ===== BADGE MANAGEMENT =====

  public static async getUserBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const result = await BadgeManagementService.getUserBadges(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getBadgeDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const badgeId = parseInt(req.params.badgeId || '0');
      const result = await BadgeManagementService.getBadgeDetails(badgeId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ===== ANALYTICS & STATISTICS =====

  public static async getAssessmentStats(req: Request, res: Response, next: NextFunction) {
    try {
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const result = await AssessmentExecutionService.getAssessmentStats(assessmentId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessmentLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await AssessmentExecutionService.getAssessmentLeaderboard(assessmentId, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ===== UTILITY METHODS =====

  public static async shareCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const { code } = req.params;
      const { platform } = req.body;
      
      if (!code || !platform) {
        throw new CustomError("Certificate code and platform are required", 400);
      }
      
      const result = await CertificateVerificationService.shareCertificate(code, platform, userId);
      res.status(200).json({ success: true, message: "Certificate share link generated", data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async canRetakeAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');
      const canRetake = await AssessmentExecutionService.canRetakeAssessment(userId, assessmentId);
      res.status(200).json({ success: true, data: { canRetake } });
    } catch (error) {
      next(error);
    }
  }

  // Mock methods for missing functionality
  public static async getUserResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Mock implementation
      const result = {
        results: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async retakeAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.decrypt;
      const assessmentId = parseInt(req.params.assessmentId || '0');
      
      // Mock implementation
      const result = { message: "Assessment reset for retake", assessmentId, userId };
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
