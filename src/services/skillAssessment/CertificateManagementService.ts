import { CertificateValidationService } from "./helpers/CertificateValidationService";
import { CertificateDataService } from "./helpers/CertificateDataService";
import { CertificateSharingService } from "./helpers/CertificateSharingService";

export class CertificateManagementService {
  // Download certificate PDF
  public static async downloadCertificate(certificateCode: string, userId?: number) {
    CertificateValidationService.validateCertificateCode(certificateCode);

    // Mock implementation - would typically get from repository
    const certificate = {
      certificateUrl: `https://example.com/certificates/${certificateCode}.pdf`,
      userId: userId || 1,
    };

    // If userId provided, verify ownership
    if (userId) {
      CertificateValidationService.validateOwnership(certificate.userId, userId);
    }

    return CertificateDataService.buildDownloadResponse(certificateCode);
  }

  // Share certificate to social media
  public static async shareCertificate(certificateCode: string, platform: string, userId: number) {
    CertificateValidationService.validateCertificateCode(certificateCode);
    CertificateValidationService.validatePlatform(platform);
    CertificateValidationService.validateUserId(userId);

    // Mock certificate check
    const certificate = {
      userId: userId,
      assessment: { title: "JavaScript Assessment" },
      score: 95,
    };

    CertificateValidationService.validateOwnership(certificate.userId, userId);

    const shareUrl = CertificateSharingService.buildShareUrl(certificateCode);
    const shareText = CertificateSharingService.buildShareText(certificate.assessment.title, certificate.score);
    const shareLinks = CertificateSharingService.generateShareLinks(shareUrl, shareText);

    return {
      shareUrl: CertificateSharingService.getShareLinkByPlatform(platform, shareLinks),
      platform,
      shareText,
    };
  }
}
