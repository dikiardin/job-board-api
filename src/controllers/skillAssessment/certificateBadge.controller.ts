import { Request, Response, NextFunction } from "express";
import { CertificateVerificationService } from "../../services/skillAssessment/certificateVerification.service";
import { BadgeCoreService } from "../../services/skillAssessment/badgeCore.service";
import { BadgeVerificationService } from "../../services/skillAssessment/badgeVerification.service";
import { BadgeProgressService } from "../../services/skillAssessment/badgeProgress.service";
import { CustomError } from "../../utils/customError";

export class CertificateBadgeController {
  // ===== CERTIFICATE MANAGEMENT =====

  // Verify certificate by code
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

  // Download certificate PDF
  public static async downloadCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code } = req.params;
      const userId = res.locals.decrypt?.userId; // Optional for public access

      if (!code) {
        throw new CustomError("Certificate code is required", 400);
      }

      const result = await CertificateVerificationService.downloadCertificate(code, userId);

      // Mock PDF buffer
      const mockBuffer = Buffer.from('Mock PDF content');
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${code}.pdf"`);
      res.setHeader('Content-Length', mockBuffer.length);

      res.send(mockBuffer);
    } catch (error) {
      next(error);
    }
  }

  // Get user's certificates
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

  // Share certificate to social media
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
        throw new CustomError("Social media platform is required", 400);
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

  // Get certificate analytics (Developer only)
  public static async getCertificateAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;

      const result = await CertificateVerificationService.getCertificateAnalytics(role);

      res.status(200).json({
        success: true,
        message: "Certificate analytics retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ===== BADGE MANAGEMENT =====

  // Get user's badges
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

  // Get badge details
  public static async getBadgeDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const badgeId = parseInt(req.params.badgeId || '0');

      const result = await BadgeCoreService.getBadgeDetails(badgeId);

      res.status(200).json({
        success: true,
        message: "Badge details retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify badge
  public static async verifyBadge(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const badgeId = parseInt(req.params.badgeId || '0');
      const { userId } = res.locals.decrypt;

      const result = await BadgeVerificationService.verifyBadge(badgeId, userId);

      res.status(200).json({
        success: true,
        message: "Badge verification completed",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge analytics (Developer only)
  public static async getBadgeAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { role } = res.locals.decrypt;

      const result = await BadgeProgressService.getBadgeAnalytics(role);

      res.status(200).json({
        success: true,
        message: "Badge analytics retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get badge leaderboard
  public static async getBadgeLeaderboard(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const badgeTemplateId = parseInt(req.params.badgeTemplateId || '0');
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await BadgeProgressService.getBadgeLeaderboard(
        badgeTemplateId,
        limit
      );

      res.status(200).json({
        success: true,
        message: "Badge leaderboard retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's badge progress
  public static async getUserBadgeProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;

      const result = await BadgeProgressService.getUserBadgeProgress(userId);

      res.status(200).json({
        success: true,
        message: "User badge progress retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Share badge to social media
  public static async shareBadge(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.decrypt;
      const badgeId = parseInt(req.params.badgeId || '0');
      const { platform } = req.body;

      if (!platform) {
        throw new CustomError("Social media platform is required", 400);
      }

      const result = await BadgeVerificationService.shareBadge(badgeId, platform, userId);

      res.status(200).json({
        success: true,
        message: "Badge share link generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
