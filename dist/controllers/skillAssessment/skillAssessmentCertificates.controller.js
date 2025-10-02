"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentCertificatesController = void 0;
const skillAssessment_service_1 = require("../../services/skillAssessment/skillAssessment.service");
const badge_service_1 = require("../../services/skillAssessment/badge.service");
const customError_1 = require("../../utils/customError");
class SkillAssessmentCertificatesController {
    // Download certificate
    static async downloadCertificate(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const resultId = parseInt(req.params.resultId || '0');
            if (isNaN(resultId)) {
                throw new customError_1.CustomError("Invalid result ID", 400);
            }
            const certificateData = await skillAssessment_service_1.SkillAssessmentService.downloadCertificate(resultId, userId);
            // Fetch PDF from Cloudinary and stream to client
            let response = await fetch(certificateData.certificateUrl);
            if (!response.ok) {
                // Try without .pdf extension (fallback like CV)
                const urlWithoutPdf = certificateData.certificateUrl.replace('.pdf', '');
                response = await fetch(urlWithoutPdf);
                if (!response.ok) {
                    throw new customError_1.CustomError('Failed to fetch certificate from storage', 500);
                }
            }
            const buffer = await response.arrayBuffer();
            // Validate that it's actually a PDF
            const pdfHeader = new Uint8Array(buffer.slice(0, 4));
            const pdfHeaderString = String.fromCharCode(...pdfHeader);
            if (!pdfHeaderString.startsWith('%PDF')) {
                throw new customError_1.CustomError('Invalid certificate file', 500);
            }
            // Set proper headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateData.certificateCode}.pdf"`);
            res.setHeader('Content-Length', buffer.byteLength.toString());
            res.setHeader('Cache-Control', 'no-cache');
            // Send the PDF buffer
            res.send(Buffer.from(buffer));
        }
        catch (error) {
            next(error);
        }
    }
    // Verify certificate
    static async verifyCertificate(req, res, next) {
        try {
            const { code } = req.params;
            if (!code) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.verifyCertificate(code);
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
    // Get user certificates
    static async getUserCertificates(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const result = await skillAssessment_service_1.SkillAssessmentService.getUserCertificates(userId, page, limit);
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
    // Get user badges
    static async getUserBadges(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const result = await badge_service_1.BadgeService.getUserBadges(userId);
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
            if (isNaN(badgeId)) {
                throw new customError_1.CustomError("Invalid badge ID", 400);
            }
            const result = await badge_service_1.BadgeService.getBadgeDetails(badgeId);
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
            if (isNaN(badgeId)) {
                throw new customError_1.CustomError("Invalid badge ID", 400);
            }
            const result = await badge_service_1.BadgeService.verifyBadge(badgeId, userId);
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
            const result = await skillAssessment_service_1.SkillAssessmentService.shareCertificate(code, platform, userId);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SkillAssessmentCertificatesController = SkillAssessmentCertificatesController;
//# sourceMappingURL=skillAssessmentCertificates.controller.js.map