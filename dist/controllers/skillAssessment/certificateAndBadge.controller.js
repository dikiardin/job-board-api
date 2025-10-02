"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateAndBadgeController = void 0;
const certificateVerification_service_1 = require("../../services/skillAssessment/certificateVerification.service");
const badgeManagement_service_1 = require("../../services/skillAssessment/badgeManagement.service");
const assessmentSubmission_service_1 = require("../../services/skillAssessment/assessmentSubmission.service");
const customError_1 = require("../../utils/customError");
class CertificateAndBadgeController {
    // Get user's assessment results
    static async getUserResults(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await assessmentSubmission_service_1.AssessmentSubmissionService.getUserResults(userId, page, limit);
            res.status(200).json({
                success: true,
                message: "User results retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== CERTIFICATE MANAGEMENT =====
    // Verify certificate
    static async verifyCertificate(req, res, next) {
        try {
            const { code } = req.params;
            if (!code) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            const result = await certificateVerification_service_1.CertificateVerificationService.verifyCertificate(code);
            res.status(200).json({
                success: true,
                message: "Certificate verification completed",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Download certificate
    static async downloadCertificate(req, res, next) {
        try {
            const { code } = req.params;
            const userId = res.locals.decrypt?.userId;
            if (!code) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            const result = await certificateVerification_service_1.CertificateVerificationService.downloadCertificate(code, userId);
            res.status(200).json({
                success: true,
                message: "Certificate downloaded successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get user certificates
    static async getUserCertificates(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await certificateVerification_service_1.CertificateVerificationService.getUserCertificates(userId, page, limit);
            res.status(200).json({
                success: true,
                message: "User certificates retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== BADGE MANAGEMENT =====
    // Get user badges
    static async getUserBadges(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const result = await badgeManagement_service_1.BadgeManagementService.getUserBadges(userId);
            res.status(200).json({
                success: true,
                message: "User badges retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Share certificate
    static async shareCertificate(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const { code } = req.params;
            const { platform } = req.body;
            if (!code) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            if (!platform) {
                throw new customError_1.CustomError("Platform is required", 400);
            }
            const result = await certificateVerification_service_1.CertificateVerificationService.shareCertificate(code, platform, userId);
            res.status(200).json({
                success: true,
                message: "Certificate share link generated",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CertificateAndBadgeController = CertificateAndBadgeController;
//# sourceMappingURL=certificateAndBadge.controller.js.map