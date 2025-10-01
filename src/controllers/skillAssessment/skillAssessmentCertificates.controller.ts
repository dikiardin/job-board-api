import { Request, Response, NextFunction } from "express";
import { SkillAssessmentService } from "../../services/skillAssessment/skillAssessment.service";
import { BadgeService } from "../../services/skillAssessment/badge.service";
import { CustomError } from "../../utils/customError";

export class SkillAssessmentCertificatesController {
  // Download certificate
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
        
        if (!response.ok) {
          throw new CustomError('Failed to fetch certificate from storage', 500);
        }
      }

      const buffer = await response.arrayBuffer();
      
      // Validate that it's actually a PDF
      const pdfHeader = new Uint8Array(buffer.slice(0, 4));
      const pdfHeaderString = String.fromCharCode(...pdfHeader);
      
      if (!pdfHeaderString.startsWith('%PDF')) {
        throw new CustomError('Invalid certificate file', 500);
      }

      // Set proper headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateData.certificateCode}.pdf"`);
      res.setHeader('Content-Length', buffer.byteLength.toString());
      res.setHeader('Cache-Control', 'no-cache');

      // Send the PDF buffer
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  }

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

      const result = await SkillAssessmentService.verifyCertificate(code);

      res.status(200).json({
        success: true,
        message: "Certificate verification completed",
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
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');

      const result = await SkillAssessmentService.getUserCertificates(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "User certificates retrieved successfully",
        data: result,
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

      const result = await BadgeService.getUserBadges(userId);

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

      if (isNaN(badgeId)) {
        throw new CustomError("Invalid badge ID", 400);
      }

      const result = await BadgeService.getBadgeDetails(badgeId);

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

      if (isNaN(badgeId)) {
        throw new CustomError("Invalid badge ID", 400);
      }

      const result = await BadgeService.verifyBadge(badgeId, userId);

      res.status(200).json({
        success: true,
        message: "Badge verification completed",
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

      const result = await SkillAssessmentService.shareCertificate(code, platform, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
