import { CertificateService } from "../certificate.service";

export class CertificateDataService {
  public static buildCertificateResponse(result: any) {
    return {
      isValid: true,
      certificate: {
        id: result.id,
        certificateCode: result.certificateCode,
        userName: result.user.name,
        userEmail: result.user.email,
        assessmentTitle: result.assessment.title,
        score: result.score,
        completedAt: result.createdAt,
        issuedAt: result.createdAt,
      },
      verificationUrl: CertificateService.generateQRCodeData(
        result.certificateCode
      ),
    };
  }

  public static buildDownloadResponse(
    certificateCode: string,
    pdfUrl?: string | null
  ) {
    return {
      certificateUrl:
        pdfUrl || `https://example.com/certificates/${certificateCode}.pdf`,
      fileName: `certificate-${certificateCode}.pdf`,
    };
  }

  public static buildPaginationResponse(
    page: number,
    limit: number,
    total: number
  ) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public static buildBulkVerificationResult(
    certificateCodes: string[],
    results: any[]
  ) {
    return results.map((result, index) => ({
      certificateCode: certificateCodes[index],
      isValid: result.status === "fulfilled",
      data: result.status === "fulfilled" ? result.value : null,
      error: result.status === "rejected" ? result.reason.message : null,
    }));
  }
}
