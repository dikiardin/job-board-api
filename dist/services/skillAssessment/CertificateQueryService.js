"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateQueryService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const CertificateValidationService_1 = require("./helpers/CertificateValidationService");
const CertificateDataService_1 = require("./helpers/CertificateDataService");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../config/prisma");
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
        const skip = (page - 1) * limit;
        const [certificates, total] = await Promise.all([
            prisma_1.prisma.certificate.findMany({
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
            prisma_1.prisma.certificate.count({
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
            pagination: CertificateDataService_1.CertificateDataService.buildPaginationResponse(page, limit, total),
        };
    }
    // Bulk certificate verification (for employers)
    static async bulkVerifyCertificates(certificateCodes) {
        CertificateValidationService_1.CertificateValidationService.validateBulkCertificates(certificateCodes);
        const results = await Promise.allSettled(certificateCodes.map((code) => this.verifyCertificate(code)));
        return CertificateDataService_1.CertificateDataService.buildBulkVerificationResult(certificateCodes, results);
    }
}
exports.CertificateQueryService = CertificateQueryService;
