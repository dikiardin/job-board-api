"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateDataService = void 0;
const certificate_service_1 = require("../certificate.service");
class CertificateDataService {
    static buildCertificateResponse(result) {
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
            verificationUrl: certificate_service_1.CertificateService.generateQRCodeData(result.certificateCode),
        };
    }
    static buildDownloadResponse(certificateCode) {
        return {
            certificateUrl: `https://example.com/certificates/${certificateCode}.pdf`,
            fileName: `certificate-${certificateCode}.pdf`,
        };
    }
    static buildPaginationResponse(page, limit, total) {
        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    static buildBulkVerificationResult(certificateCodes, results) {
        return results.map((result, index) => ({
            certificateCode: certificateCodes[index],
            isValid: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason.message : null,
        }));
    }
}
exports.CertificateDataService = CertificateDataService;
//# sourceMappingURL=CertificateDataService.js.map