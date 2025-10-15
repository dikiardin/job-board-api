"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateManagementService = void 0;
const CertificateValidationService_1 = require("./helpers/CertificateValidationService");
const CertificateDataService_1 = require("./helpers/CertificateDataService");
const CertificateSharingService_1 = require("./helpers/CertificateSharingService");
class CertificateManagementService {
    // Download certificate PDF
    static async downloadCertificate(certificateCode, userId) {
        CertificateValidationService_1.CertificateValidationService.validateCertificateCode(certificateCode);
        // Mock implementation - would typically get from repository
        const certificate = {
            certificateUrl: `https://example.com/certificates/${certificateCode}.pdf`,
            userId: userId || 1,
        };
        // If userId provided, verify ownership
        if (userId) {
            CertificateValidationService_1.CertificateValidationService.validateOwnership(certificate.userId, userId);
        }
        return CertificateDataService_1.CertificateDataService.buildDownloadResponse(certificateCode);
    }
    // Share certificate to social media
    static async shareCertificate(certificateCode, platform, userId) {
        CertificateValidationService_1.CertificateValidationService.validateCertificateCode(certificateCode);
        CertificateValidationService_1.CertificateValidationService.validatePlatform(platform);
        CertificateValidationService_1.CertificateValidationService.validateUserId(userId);
        // Mock certificate check
        const certificate = {
            userId: userId,
            assessment: { title: "JavaScript Assessment" },
            score: 95,
        };
        CertificateValidationService_1.CertificateValidationService.validateOwnership(certificate.userId, userId);
        const shareUrl = CertificateSharingService_1.CertificateSharingService.buildShareUrl(certificateCode);
        const shareText = CertificateSharingService_1.CertificateSharingService.buildShareText(certificate.assessment.title, certificate.score);
        const shareLinks = CertificateSharingService_1.CertificateSharingService.generateShareLinks(shareUrl, shareText);
        return {
            shareUrl: CertificateSharingService_1.CertificateSharingService.getShareLinkByPlatform(platform, shareLinks),
            platform,
            shareText,
        };
    }
}
exports.CertificateManagementService = CertificateManagementService;
//# sourceMappingURL=CertificateManagementService.js.map