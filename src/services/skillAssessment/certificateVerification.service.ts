import { CertificateQueryService } from "./CertificateQueryService";
import { CertificateManagementService } from "./CertificateManagementService";

export class CertificateVerificationService {
  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return await CertificateQueryService.verifyCertificate(certificateCode);
  }

  // Download certificate PDF
  public static async downloadCertificate(userId: number, resultId: number) {
    return await CertificateManagementService.downloadCertificate(`cert-${resultId}`, userId);
  }

  // Get user's certificates
  public static async getUserCertificates(userId: number, page: number = 1, limit: number = 10) {
    return await CertificateQueryService.getUserCertificates(userId, page, limit);
  }

  // Bulk certificate verification (for employers)
  public static async bulkVerifyCertificates(certificateCodes: string[]) {
    return await CertificateQueryService.bulkVerifyCertificates(certificateCodes);
  }

  // Share certificate to social media
  public static async shareCertificate(certificateCode: string, platform: string, userId: number) {
    return await CertificateManagementService.shareCertificate(certificateCode, platform, userId);
  }
}
