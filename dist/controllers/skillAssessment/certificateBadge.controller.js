"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateBadgeController = void 0;
const CertificateController_1 = require("./CertificateController");
const BadgeController_1 = require("./BadgeController");
const badgeCore_service_1 = require("../../services/skillAssessment/badgeCore.service");
const CertificateHelper_1 = require("./helpers/CertificateHelper");
const customError_1 = require("../../utils/customError");
class CertificateBadgeController {
    // ===== CERTIFICATE MANAGEMENT =====
    // Verify certificate by code
    static async verifyCertificate(req, res, next) {
        return await CertificateController_1.CertificateController.verifyCertificate(req, res, next);
    }
    // Download certificate PDF
    static async downloadCertificate(req, res, next) {
        return await CertificateController_1.CertificateController.downloadCertificate(req, res, next);
    }
    // Get user certificates
    static async getUserCertificates(req, res, next) {
        return await CertificateController_1.CertificateController.getUserCertificates(req, res, next);
    }
    // ===== BADGE MANAGEMENT =====
    // Get user badges
    static async getUserBadges(req, res, next) {
        return await BadgeController_1.BadgeController.getUserBadges(req, res, next);
    }
    // Get badge by ID
    static async getBadgeById(req, res, next) {
        return await BadgeController_1.BadgeController.getBadgeById(req, res, next);
    }
    // Verify badge
    static async verifyBadge(req, res, next) {
        return await BadgeController_1.BadgeController.verifyBadge(req, res, next);
    }
    // Get badge progress
    static async getBadgeProgress(req, res, next) {
        return await BadgeController_1.BadgeController.getBadgeProgress(req, res, next);
    }
    // Share badge to social media
    static async shareBadge(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const badgeId = parseInt(req.params.badgeId || '0');
            const { platform } = req.body;
            CertificateHelper_1.CertificateHelper.validateUserId(userId);
            if (isNaN(badgeId) || badgeId <= 0) {
                throw new customError_1.CustomError("Valid badge ID is required", 400);
            }
            if (!platform) {
                throw new customError_1.CustomError("Social media platform is required", 400);
            }
            // Mock implementation for badge sharing
            const shareUrl = `${process.env.FRONTEND_URL}/badges/${badgeId}?shared=true`;
            res.status(200).json(CertificateHelper_1.CertificateHelper.buildSuccessResponse("Badge share URL generated successfully", { shareUrl }));
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge leaderboard
    static async getBadgeLeaderboard(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category;
            // Mock implementation for badge leaderboard
            const leaderboard = { users: [], pagination: { page, limit, total: 0 } };
            res.status(200).json(CertificateHelper_1.CertificateHelper.buildSuccessResponse("Badge leaderboard retrieved successfully", leaderboard));
        }
        catch (error) {
            next(error);
        }
    }
    // Get badge statistics
    static async getBadgeStats(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            CertificateHelper_1.CertificateHelper.validateUserId(userId);
            const stats = await badgeCore_service_1.BadgeCoreService.getUserBadgeStats(userId);
            res.status(200).json(CertificateHelper_1.CertificateHelper.buildSuccessResponse("Badge statistics retrieved successfully", stats));
        }
        catch (error) {
            next(error);
        }
    }
    // Get all available badges
    static async getAllBadges(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category;
            // Mock implementation for all badges
            const badges = { badges: [], pagination: { page, limit, total: 0 } };
            res.status(200).json(CertificateHelper_1.CertificateHelper.buildSuccessResponse("All badges retrieved successfully", badges));
        }
        catch (error) {
            next(error);
        }
    }
    // Award badge to user (Internal use)
    static async awardBadge(req, res, next) {
        try {
            const { userId, badgeTemplateId, assessmentResultId } = req.body;
            CertificateHelper_1.CertificateHelper.validateUserId(userId);
            if (!badgeTemplateId || badgeTemplateId <= 0) {
                throw new customError_1.CustomError("Valid badge template ID is required", 400);
            }
            const badge = await badgeCore_service_1.BadgeCoreService.awardBadge(userId);
            res.status(201).json(CertificateHelper_1.CertificateHelper.buildSuccessResponse("Badge awarded successfully", badge));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CertificateBadgeController = CertificateBadgeController;
//# sourceMappingURL=certificateBadge.controller.js.map