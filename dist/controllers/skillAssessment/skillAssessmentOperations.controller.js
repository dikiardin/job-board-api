"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentOperationsController = void 0;
const skillAssessment_service_1 = require("../../services/skillAssessment/skillAssessment.service");
const customError_1 = require("../../utils/customError");
class SkillAssessmentOperationsController {
    // Create assessment (Developer only)
    static async createAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const { title, description, questions, badgeTemplateId } = req.body;
            if (!title || !questions) {
                throw new customError_1.CustomError("Title and questions are required", 400);
            }
            const assessment = await skillAssessment_service_1.SkillAssessmentService.createAssessment({
                title,
                description,
                badgeTemplateId,
                createdBy: userId,
                userRole: role,
                questions,
            });
            res.status(201).json({
                success: true,
                message: "Assessment created successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all assessments (for discovery)
    static async getAssessments(req, res, next) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const result = await skillAssessment_service_1.SkillAssessmentService.getAssessments(page, limit);
            res.status(200).json({
                success: true,
                message: "Assessments retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get assessment for taking (User with subscription)
    static async getAssessmentForTaking(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.getAssessmentForTaking(assessmentId, userId);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved for taking",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Submit assessment
    static async submitAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const { assessmentId, answers, timeSpent } = req.body;
            if (!assessmentId || !answers || timeSpent === undefined) {
                throw new customError_1.CustomError("Assessment ID, answers, and time spent are required", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.submitAssessment({
                assessmentId: parseInt(assessmentId),
                userId,
                answers,
            });
            res.status(200).json({
                success: true,
                message: "Assessment submitted successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get user's assessment results
    static async getUserResults(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const result = await skillAssessment_service_1.SkillAssessmentService.getUserResults(userId);
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
    // Get specific assessment result
    static async getAssessmentResult(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            // Use getUserResults to get specific result (mock implementation)
            const resultsData = await skillAssessment_service_1.SkillAssessmentService.getUserResults(userId);
            const result = resultsData.results?.find((r) => r.assessmentId === assessmentId) || null;
            res.status(200).json({
                success: true,
                message: "Assessment result retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(req, res, next) {
        try {
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const limit = parseInt(req.query.limit || '10');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.getAssessmentLeaderboard(assessmentId, limit);
            res.status(200).json({
                success: true,
                message: "Assessment leaderboard retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get assessment statistics
    static async getAssessmentStats(req, res, next) {
        try {
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.getAssessmentStats(assessmentId);
            res.status(200).json({
                success: true,
                message: "Assessment statistics retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SkillAssessmentOperationsController = SkillAssessmentOperationsController;
//# sourceMappingURL=skillAssessmentOperations.controller.js.map