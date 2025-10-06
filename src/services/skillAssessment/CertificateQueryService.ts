import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CertificateValidationService } from "./helpers/CertificateValidationService";
import { CertificateDataService } from "./helpers/CertificateDataService";
import { CustomError } from "../../utils/customError";

export class CertificateQueryService {
  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    CertificateValidationService.validateCertificateCode(certificateCode);
    
    const result = await SkillAssessmentModularRepository.verifyCertificate(certificateCode);
    if (!result) {
      throw new CustomError("Certificate not found", 404);
    }

    return CertificateDataService.buildCertificateResponse(result);
  }

  // Get user's certificates
  public static async getUserCertificates(userId: number, page: number = 1, limit: number = 10) {
    CertificateValidationService.validateUserId(userId);

    // Mock implementation - replace with actual repository call
    const certificates: any[] = [];
    const total = 0;

    return {
      certificates,
      pagination: CertificateDataService.buildPaginationResponse(page, limit, total),
    };
  }

  // Bulk certificate verification (for employers)
  public static async bulkVerifyCertificates(certificateCodes: string[]) {
    CertificateValidationService.validateBulkCertificates(certificateCodes);

    const results = await Promise.allSettled(
      certificateCodes.map(code => this.verifyCertificate(code))
    );

    return CertificateDataService.buildBulkVerificationResult(certificateCodes, results);
  }
}
