"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateManagementController = void 0;
const badgeCore_service_1 = require("../../services/skillAssessment/badgeCore.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
const certificateDownload_service_1 = require("../../services/skillAssessment/certificateDownload.service");
const assessmentResults_repository_1 = require("../../repositories/skillAssessment/assessmentResults.repository");
class CertificateManagementController {
    static async downloadCertificate(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const resultId = controllerHelper_1.ControllerHelper.parseId(req.params.resultId);
            // Mock certificate data - would integrate with certificate service
            const certificateData = { certificateUrl: 'https://example.com/cert.pdf', certificateCode: 'CERT123' };
            await certificateDownload_service_1.CertificateDownloadService.streamCertificateToResponse(certificateData, res, true // forceDownload = true
            );
        }
        catch (error) {
            next(error);
        }
    }
    static async viewCertificate(req, res, next) {
        try {
            const { certificateCode } = req.params;
            if (!certificateCode) {
                return res.status(400).json({
                    success: false,
                    message: "Certificate code is required"
                });
            }
            // Get certificate from database
            const certificate = await assessmentResults_repository_1.AssessmentResultsRepository.verifyCertificate(certificateCode);
            if (!certificate) {
                return res.status(404).json({
                    success: false,
                    message: "Certificate not found or invalid",
                });
            }
            // Stream PDF for inline viewing
            await certificateDownload_service_1.CertificateDownloadService.streamCertificateToResponse({ certificateUrl: certificate.certificateUrl, certificateCode }, res, false // forceDownload = false (inline view)
            );
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyCertificate(req, res, next) {
        try {
            const { certificateCode } = req.params;
            if (!certificateCode) {
                return res.status(400).json({
                    success: false,
                    message: "Certificate code is required"
                });
            }
            // Verify certificate using repository
            const certificate = await assessmentResults_repository_1.AssessmentResultsRepository.verifyCertificate(certificateCode);
            if (!certificate) {
                return res.status(404).json({
                    success: false,
                    message: "Certificate not found or invalid",
                });
            }
            res.status(200).json({
                success: true,
                message: "Certificate verified successfully",
                certificate: {
                    id: certificate.id,
                    certificateCode: certificate.certificateCode,
                    score: certificate.score,
                    isPassed: certificate.isPassed,
                    certificateUrl: certificate.certificateUrl,
                    createdAt: certificate.createdAt,
                    user: {
                        id: certificate.user.id,
                        name: certificate.user.name,
                        email: certificate.user.email,
                    },
                    assessment: {
                        id: certificate.assessment.id,
                        title: certificate.assessment.title,
                        description: certificate.assessment.description,
                        category: certificate.assessment.category,
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserBadges(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const badges = await badgeCore_service_1.BadgeCoreService.getUserBadges(userId);
            res.status(200).json({
                success: true,
                message: "User badges retrieved successfully",
                data: badges,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CertificateManagementController = CertificateManagementController;
//# sourceMappingURL=certificateManagement.controller.js.map