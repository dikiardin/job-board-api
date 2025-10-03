import { Request, Response, NextFunction } from "express";
import { CertificateVerificationService } from "../../services/skillAssessment/certificateVerification.service";
import { BadgeCoreService } from "../../services/skillAssessment/badgeCore.service";
import { AssessmentSubmissionService } from "../../services/skillAssessment/assessmentSubmission.service";
import { CustomError } from "../../utils/customError";

export class CertificateAndBadgeController {
  // Get user's assessment results
  public static async getUserResults(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AssessmentSubmissionService.getUserResults(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "User results retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===== CERTIFICATE MANAGEMENT =====

  // Verify certificate
  public static async verifyCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code } = req.params;

      if (!code) {
        throw new CustomError("Certificate code is required", 400);
      }

      const result = await CertificateVerificationService.verifyCertificate(code);

      res.status(200).json({
        success: true,
        message: "Certificate verification completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Download certificate
  public static async downloadCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code } = req.params;
      const userId = res.locals.decrypt?.userId;

      if (!code) {
        throw new CustomError("Certificate code is required", 400);
      }

      const result = await CertificateVerificationService.downloadCertificate(code, userId);

      res.status(200).json({
        success: true,
        message: "Certificate downloaded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user certificates
  public static async getUserCertificates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CertificateVerificationService.getUserCertificates(
        userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: "User certificates retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===== BADGE MANAGEMENT =====

  // Get user badges
  public static async getUserBadges(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;

      const result = await BadgeCoreService.getUserBadges(userId);

      res.status(200).json({
        success: true,
        message: "User badges retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Share certificate
  public static async shareCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const { code } = req.params;
      const { platform } = req.body;

      if (!code) {
        throw new CustomError("Certificate code is required", 400);
      }

      if (!platform) {
        throw new CustomError("Platform is required", 400);
      }

      const result = await CertificateVerificationService.shareCertificate(
        code,
        platform,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Certificate share link generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
