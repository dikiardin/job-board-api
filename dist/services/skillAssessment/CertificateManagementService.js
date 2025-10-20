"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateManagementService = void 0;
const CertificateValidationService_1 = require("./helpers/CertificateValidationService");
const CertificateDataService_1 = require("./helpers/CertificateDataService");
const CertificateSharingService_1 = require("./helpers/CertificateSharingService");
const prisma_1 = require("../../config/prisma");
const customError_1 = require("../../utils/customError");
class CertificateManagementService {
    // Download certificate PDF
    static async downloadCertificate(certificateCode, userId) {
        CertificateValidationService_1.CertificateValidationService.validateCertificateCode(certificateCode);
        const certificate = await prisma_1.prisma.certificate.findUnique({
            where: { code: certificateCode },
            select: {
                pdfUrl: true,
                userId: true,
                code: true,
            },
        });
        if (!certificate) {
            throw new customError_1.CustomError("Certificate not found", 404);
        }
        // If userId provided, verify ownership
        if (userId) {
            CertificateValidationService_1.CertificateValidationService.validateOwnership(certificate.userId, userId);
        }
        return CertificateDataService_1.CertificateDataService.buildDownloadResponse(certificateCode, certificate.pdfUrl);
    }
    // Share certificate to social media
    static async shareCertificate(certificateCode, platform, userId) {
        CertificateValidationService_1.CertificateValidationService.validateCertificateCode(certificateCode);
        CertificateValidationService_1.CertificateValidationService.validatePlatform(platform);
        CertificateValidationService_1.CertificateValidationService.validateUserId(userId);
        const certificate = await prisma_1.prisma.certificate.findUnique({
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
            throw new customError_1.CustomError("Certificate not found", 404);
        }
        CertificateValidationService_1.CertificateValidationService.validateOwnership(certificate.userId, userId);
        const shareUrl = CertificateSharingService_1.CertificateSharingService.buildShareUrl(certificateCode);
        const shareText = CertificateSharingService_1.CertificateSharingService.buildShareText(certificate.assessment.title, certificate.skillResult.score);
        const shareLinks = CertificateSharingService_1.CertificateSharingService.generateShareLinks(shareUrl, shareText);
        return {
            shareUrl: CertificateSharingService_1.CertificateSharingService.getShareLinkByPlatform(platform, shareLinks),
            platform,
            shareText,
        };
    }
}
exports.CertificateManagementService = CertificateManagementService;
