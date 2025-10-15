"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateQueryService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const CertificateValidationService_1 = require("./helpers/CertificateValidationService");
const CertificateDataService_1 = require("./helpers/CertificateDataService");
const customError_1 = require("../../utils/customError");
class CertificateQueryService {
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        CertificateValidationService_1.CertificateValidationService.validateCertificateCode(certificateCode);
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.verifyCertificate(certificateCode);
        if (!result) {
            throw new customError_1.CustomError("Certificate not found", 404);
        }
        return CertificateDataService_1.CertificateDataService.buildCertificateResponse(result);
    }
    // Get user's certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        CertificateValidationService_1.CertificateValidationService.validateUserId(userId);
        // Mock implementation - replace with actual repository call
        const certificates = [];
        const total = 0;
        return {
            certificates,
            pagination: CertificateDataService_1.CertificateDataService.buildPaginationResponse(page, limit, total),
        };
    }
    // Bulk certificate verification (for employers)
    static async bulkVerifyCertificates(certificateCodes) {
        CertificateValidationService_1.CertificateValidationService.validateBulkCertificates(certificateCodes);
        const results = await Promise.allSettled(certificateCodes.map(code => this.verifyCertificate(code)));
        return CertificateDataService_1.CertificateDataService.buildBulkVerificationResult(certificateCodes, results);
    }
}
exports.CertificateQueryService = CertificateQueryService;
//# sourceMappingURL=CertificateQueryService.js.map