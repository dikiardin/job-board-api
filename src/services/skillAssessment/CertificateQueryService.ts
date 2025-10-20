import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CertificateValidationService } from "./helpers/CertificateValidationService";
import { CertificateDataService } from "./helpers/CertificateDataService";
import { CustomError } from "../../utils/customError";
import { prisma } from "../../config/prisma";

export class CertificateQueryService {
  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    CertificateValidationService.validateCertificateCode(certificateCode);

    const result = await SkillAssessmentModularRepository.verifyCertificate(
      certificateCode
    );
    if (!result) {
      throw new CustomError("Certificate not found", 404);
    }

    return CertificateDataService.buildCertificateResponse(result);
  }

  // Get user's certificates
  public static async getUserCertificates(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    CertificateValidationService.validateUserId(userId);

    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where: { userId },
        include: {
          assessment: {
            select: {
              title: true,
              category: true,
            },
          },
          skillResult: {
            select: {
              score: true,
              isPassed: true,
            },
          },
        },
        orderBy: { issuedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.certificate.count({
        where: { userId },
      }),
    ]);

    return {
      certificates: certificates.map((cert) => ({
        code: cert.code,
        pdfUrl: cert.pdfUrl,
        qrUrl: cert.qrUrl,
        verificationUrl: cert.verificationUrl,
        issuedAt: cert.issuedAt,
        assessment: cert.assessment,
        score: cert.skillResult.score,
      })),
      pagination: CertificateDataService.buildPaginationResponse(
        page,
        limit,
        total
      ),
    };
  }

  // Bulk certificate verification (for employers)
  public static async bulkVerifyCertificates(certificateCodes: string[]) {
    CertificateValidationService.validateBulkCertificates(certificateCodes);

    const results = await Promise.allSettled(
      certificateCodes.map((code) => this.verifyCertificate(code))
    );

    return CertificateDataService.buildBulkVerificationResult(
      certificateCodes,
      results
    );
  }
}
