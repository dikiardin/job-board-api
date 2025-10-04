"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateBadgeController = void 0;
const certificateVerification_service_1 = require("../../services/skillAssessment/certificateVerification.service");
const badgeCore_service_1 = require("../../services/skillAssessment/badgeCore.service");
const badgeVerification_service_1 = require("../../services/skillAssessment/badgeVerification.service");
const badgeProgress_service_1 = require("../../services/skillAssessment/badgeProgress.service");
const customError_1 = require("../../utils/customError");
class CertificateBadgeController {
    // ===== CERTIFICATE MANAGEMENT =====
    // Verify certificate by code
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
    // Download certificate PDF
    static async downloadCertificate(req, res, next) {
        try {
            const { code } = req.params;
            const userId = res.locals.decrypt?.userId; // Optional for public access
            if (!code) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            const result = await certificateVerification_service_1.CertificateVerificationService.downloadCertificate(code, userId);
            // Mock PDF buffer
            const mockBuffer = Buffer.from('Mock PDF content');
            // Set headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${code}.pdf"`);
            res.setHeader('Content-Length', mockBuffer.length);
            res.send(mockBuffer);
        }
        catch (error) {
            next(error);
        }
    }
    // Get user's certificates
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
    // Share certificate to social media
    static async shareCertificate(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const { code } = req.params;
            const { platform } = req.body;
            if (!code) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            if (!platform) {
                throw new customError_1.CustomError("Social media platform is required", 400);
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
    // Get certificate analytics (Developer only)
    static async getCertificateAnalytics(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const result = await certificateVerification_service_1.CertificateVerificationService.getCertificateAnalytics(role);
            res.status(200).json({
                success: true,
                message: "Certificate analytics retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== BADGE MANAGEMENT =====
    // Get user's badges
    static async getUserBadges(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const result = await badgeCore_service_1.BadgeCoreService.getUserBadges(userId);
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
    // Get badge details
    static async getBadgeDetails(req, res, next) {
        try {
            const badgeId = parseInt(req.params.badgeId || '0');
            const result = await badgeCore_service_1.BadgeCoreService.getBadgeDetails(badgeId);
            res.status(200).json({
                success: true,
                message: "Badge details retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Verify badge
    static async verifyBadge(req, res, next) {
        try {
            const badgeId = parseInt(req.params.badgeId || '0');
            const { userId } = res.locals.decrypt;
            const result = await badgeVerification_service_1.BadgeVerificationService.verifyBadge(badgeId, userId);
            res.status(200).json({
                success: true,
                message: "Badge verification completed",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge analytics (Developer only)
    static async getBadgeAnalytics(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const result = await badgeProgress_service_1.BadgeProgressService.getBadgeAnalytics(role);
            res.status(200).json({
                success: true,
                message: "Badge analytics retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge leaderboard
    static async getBadgeLeaderboard(req, res, next) {
        try {
            const badgeTemplateId = parseInt(req.params.badgeTemplateId || '0');
            const limit = parseInt(req.query.limit) || 10;
            const result = await badgeProgress_service_1.BadgeProgressService.getBadgeLeaderboard(badgeTemplateId, limit);
            res.status(200).json({
                success: true,
                message: "Badge leaderboard retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get user's badge progress
    static async getUserBadgeProgress(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const result = await badgeProgress_service_1.BadgeProgressService.getUserBadgeProgress(userId);
            res.status(200).json({
                success: true,
                message: "User badge progress retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Share badge to social media
    static async shareBadge(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const badgeId = parseInt(req.params.badgeId || '0');
            const { platform } = req.body;
            if (!platform) {
                throw new customError_1.CustomError("Social media platform is required", 400);
            }
            const result = await badgeVerification_service_1.BadgeVerificationService.shareBadge(badgeId, platform, userId);
            res.status(200).json({
                success: true,
                message: "Badge share link generated",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CertificateBadgeController = CertificateBadgeController;
//# sourceMappingURL=certificateBadge.controller.js.map