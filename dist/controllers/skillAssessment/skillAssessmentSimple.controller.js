"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentSimpleController = void 0;
const assessmentCreation_service_1 = require("../../services/skillAssessment/assessmentCreation.service");
const assessmentExecution_service_1 = require("../../services/skillAssessment/assessmentExecution.service");
const assessmentSubmission_service_1 = require("../../services/skillAssessment/assessmentSubmission.service");
const certificateVerification_service_1 = require("../../services/skillAssessment/certificateVerification.service");
const badgeManagement_service_1 = require("../../services/skillAssessment/badgeManagement.service");
const customError_1 = require("../../utils/customError");
class SkillAssessmentSimpleController {
    // ===== ASSESSMENT CREATION (Developer Only) =====
    static async createAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const result = await assessmentCreation_service_1.AssessmentCreationService.createAssessment({
                ...req.body,
                createdBy: userId,
                userRole: role,
            });
            res.status(201).json({ success: true, message: "Assessment created successfully", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAssessments(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await assessmentCreation_service_1.AssessmentCreationService.getAssessments(page, limit);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAssessmentById(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const result = await assessmentCreation_service_1.AssessmentCreationService.getAssessmentById(assessmentId, role);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const result = await assessmentCreation_service_1.AssessmentCreationService.updateAssessment(assessmentId, userId, req.body);
            res.status(200).json({ success: true, message: "Assessment updated successfully", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const result = await assessmentCreation_service_1.AssessmentCreationService.deleteAssessment(assessmentId, userId);
            res.status(200).json({ success: true, message: "Assessment deleted successfully", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== ASSESSMENT EXECUTION (User with Subscription) =====
    static async getAssessmentForTaking(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentForTaking(assessmentId, userId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async submitAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const { assessmentId, answers, timeSpent } = req.body;
            if (!assessmentId || !answers || timeSpent === undefined) {
                throw new customError_1.CustomError("Assessment ID, answers, and time spent are required", 400);
            }
            const result = await assessmentSubmission_service_1.AssessmentSubmissionService.submitAssessment({
                assessmentId: parseInt(assessmentId),
                userId,
                answers,
                timeSpent: parseInt(timeSpent),
            });
            res.status(200).json({ success: true, message: "Assessment submitted successfully", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== CERTIFICATE MANAGEMENT =====
    static async verifyCertificate(req, res, next) {
        try {
            const { code } = req.params;
            if (!code)
                throw new customError_1.CustomError("Certificate code is required", 400);
            const result = await certificateVerification_service_1.CertificateVerificationService.verifyCertificate(code);
            res.status(200).json({ success: true, message: "Certificate verification completed", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async downloadCertificate(req, res, next) {
        try {
            const { code } = req.params;
            const userId = res.locals.decrypt?.userId;
            if (!code)
                throw new customError_1.CustomError("Certificate code is required", 400);
            const result = await certificateVerification_service_1.CertificateVerificationService.downloadCertificate(code, userId);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${code}.pdf"`);
            res.send(Buffer.from('Mock PDF content')); // Mock buffer
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserCertificates(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await certificateVerification_service_1.CertificateVerificationService.getUserCertificates(userId, page, limit);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== BADGE MANAGEMENT =====
    static async getUserBadges(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const result = await badgeManagement_service_1.BadgeManagementService.getUserBadges(userId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getBadgeDetails(req, res, next) {
        try {
            const badgeId = parseInt(req.params.badgeId || '0');
            const result = await badgeManagement_service_1.BadgeManagementService.getBadgeDetails(badgeId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== ANALYTICS & STATISTICS =====
    static async getAssessmentStats(req, res, next) {
        try {
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentStats(assessmentId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAssessmentLeaderboard(req, res, next) {
        try {
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const limit = parseInt(req.query.limit) || 10;
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentLeaderboard(assessmentId, limit);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== UTILITY METHODS =====
    static async shareCertificate(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const { code } = req.params;
            const { platform } = req.body;
            if (!code || !platform) {
                throw new customError_1.CustomError("Certificate code and platform are required", 400);
            }
            const result = await certificateVerification_service_1.CertificateVerificationService.shareCertificate(code, platform, userId);
            res.status(200).json({ success: true, message: "Certificate share link generated", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async canRetakeAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const canRetake = await assessmentExecution_service_1.AssessmentExecutionService.canRetakeAssessment(userId, assessmentId);
            res.status(200).json({ success: true, data: { canRetake } });
        }
        catch (error) {
            next(error);
        }
    }
    // Mock methods for missing functionality
    static async getUserResults(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Mock implementation
            const result = {
                results: [],
                pagination: { page, limit, total: 0, totalPages: 0 }
            };
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async retakeAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            // Mock implementation
            const result = { message: "Assessment reset for retake", assessmentId, userId };
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SkillAssessmentSimpleController = SkillAssessmentSimpleController;
//# sourceMappingURL=skillAssessmentSimple.controller.js.map