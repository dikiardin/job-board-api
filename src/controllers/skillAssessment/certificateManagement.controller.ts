import { Request, Response, NextFunction } from "express";
import { BadgeCoreService } from "../../services/skillAssessment/badgeCore.service";
import { ControllerHelper } from "../../utils/controllerHelper";
import { CertificateDownloadService } from "../../services/skillAssessment/certificateDownload.service";

export class CertificateManagementController {
  public static async downloadCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);
      const resultId = ControllerHelper.parseId(req.params.resultId);

      // Mock certificate data - would integrate with certificate service
      const certificateData = { certificateUrl: 'https://example.com/cert.pdf', certificateCode: 'CERT123' };
      
      await CertificateDownloadService.streamCertificateToResponse(
        certificateData, 
        res
      );
    } catch (error) {
      next(error);
    }
  }

  public static async verifyCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { certificateCode } = req.params;

      if (!certificateCode) {
        return res.status(400).json({ message: "Certificate code is required" });
      }

      // Mock verification - would integrate with certificate service
      const result = { isValid: true, certificateCode, verifiedAt: new Date() };

      res.status(200).json({
        success: true,
        message: "Certificate verified successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getUserBadges(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = ControllerHelper.getUserId(res);

      const badges = await BadgeCoreService.getUserBadges(userId);

      res.status(200).json({
        success: true,
        message: "User badges retrieved successfully",
        data: badges,
      });
    } catch (error) {
      next(error);
    }
  }
}
