import { Request, Response, NextFunction } from "express";
import { BadgeCoreService } from "../../services/skillAssessment/badgeCore.service";
import { ControllerHelper } from "../../utils/controllerHelper";
import { CertificateDownloadService } from "../../services/skillAssessment/certificateDownload.service";
import { AssessmentResultsRepository } from "../../repositories/skillAssessment/assessmentResults.repository";

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
        res,
        true // forceDownload = true
      );
    } catch (error) {
      next(error);
    }
  }

  public static async viewCertificate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { certificateCode } = req.params;

      if (!certificateCode) {
        return res.status(400).json({ 
          success: false,
          message: "Certificate code is required" 
        });
      }

      // Get certificate from database
      const certificate = await AssessmentResultsRepository.verifyCertificate(certificateCode);

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found or invalid",
        });
      }

      // Stream PDF for inline viewing
      await CertificateDownloadService.streamCertificateToResponse(
        { certificateUrl: certificate.certificateUrl, certificateCode }, 
        res,
        false // forceDownload = false (inline view)
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
        return res.status(400).json({ 
          success: false,
          message: "Certificate code is required" 
        });
      }

      // Verify certificate using repository
      const certificate = await AssessmentResultsRepository.verifyCertificate(certificateCode);

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found or invalid",
        });
      }

      res.status(200).json({
        success: true,
        message: "Certificate verified successfully",
        certificate: {
          id: certificate.id,
          certificateCode: certificate.certificateCode,
          score: certificate.score,
          isPassed: certificate.isPassed,
          certificateUrl: certificate.certificateUrl,
          createdAt: certificate.createdAt,
          user: {
            id: certificate.user.id,
            name: certificate.user.name,
            email: certificate.user.email,
          },
          assessment: {
            id: certificate.assessment.id,
            title: certificate.assessment.title,
            description: certificate.assessment.description,
            category: certificate.assessment.category,
          },
        },
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
