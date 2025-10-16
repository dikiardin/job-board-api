"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateVerificationService = void 0;
const CertificateQueryService_1 = require("./CertificateQueryService");
const CertificateManagementService_1 = require("./CertificateManagementService");
class CertificateVerificationService {
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return await CertificateQueryService_1.CertificateQueryService.verifyCertificate(certificateCode);
    }
    // Download certificate PDF
    static async downloadCertificate(userId, resultId) {
        return await CertificateManagementService_1.CertificateManagementService.downloadCertificate(`cert-${resultId}`, userId);
    }
    // Get user's certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        return await CertificateQueryService_1.CertificateQueryService.getUserCertificates(userId, page, limit);
    }
    // Bulk certificate verification (for employers)
    static async bulkVerifyCertificates(certificateCodes) {
        return await CertificateQueryService_1.CertificateQueryService.bulkVerifyCertificates(certificateCodes);
    }
    // Share certificate to social media
    static async shareCertificate(certificateCode, platform, userId) {
        return await CertificateManagementService_1.CertificateManagementService.shareCertificate(certificateCode, platform, userId);
    }
}
exports.CertificateVerificationService = CertificateVerificationService;
