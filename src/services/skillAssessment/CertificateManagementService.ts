import { CertificateValidationService } from "./helpers/CertificateValidationService";
import { CertificateDataService } from "./helpers/CertificateDataService";
import { CertificateSharingService } from "./helpers/CertificateSharingService";
import { prisma } from "../../config/prisma";
import { CustomError } from "../../utils/customError";

export class CertificateManagementService {
  // Download certificate PDF
  public static async downloadCertificate(
    certificateCode: string,
    userId?: number
  ) {
    CertificateValidationService.validateCertificateCode(certificateCode);

    const certificate = await prisma.certificate.findUnique({
      where: { code: certificateCode },
      select: {
        pdfUrl: true,
        userId: true,
        code: true,
      },
    });

    if (!certificate) {
      throw new CustomError("Certificate not found", 404);
    }

    // If userId provided, verify ownership
    if (userId) {
      CertificateValidationService.validateOwnership(
        certificate.userId,
        userId
      );
    }

    return CertificateDataService.buildDownloadResponse(
      certificateCode,
      certificate.pdfUrl
    );
  }

  // Share certificate to social media
  public static async shareCertificate(
    certificateCode: string,
    platform: string,
    userId: number
  ) {
    CertificateValidationService.validateCertificateCode(certificateCode);
    CertificateValidationService.validatePlatform(platform);
    CertificateValidationService.validateUserId(userId);

    const certificate = await prisma.certificate.findUnique({
      where: { code: certificateCode },
      include: {
        assessment: {
          select: { title: true },
        },
        skillResult: {
          select: { score: true },
        },
      },
    });

    if (!certificate) {
      throw new CustomError("Certificate not found", 404);
    }

    CertificateValidationService.validateOwnership(certificate.userId, userId);

    const shareUrl = CertificateSharingService.buildShareUrl(certificateCode);
    const shareText = CertificateSharingService.buildShareText(
      certificate.assessment.title,
      certificate.skillResult.score
    );
    const shareLinks = CertificateSharingService.generateShareLinks(
      shareUrl,
      shareText
    );

    return {
      shareUrl: CertificateSharingService.getShareLinkByPlatform(
        platform,
        shareLinks
      ),
      platform,
      shareText,
    };
  }
}
