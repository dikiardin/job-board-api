"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionController = void 0;
const assessmentExecution_service_1 = require("../../services/skillAssessment/assessmentExecution.service");
const assessmentSubmission_service_1 = require("../../services/skillAssessment/assessmentSubmission.service");
const customError_1 = require("../../utils/customError");
class AssessmentExecutionController {
    // Get all assessments for discovery (User with subscription)
    static async getAssessmentsForDiscovery(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Mock implementation
            const result = {
                assessments: [],
                pagination: { page, limit, total: 0, totalPages: 0 }
            };
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
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentForTaking(assessmentId, userId);
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
    // Submit assessment answers
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
    // Get user's assessment results (Mock implementation)
    static async getUserAssessmentResults(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Mock implementation
            const result = {
                results: [],
                pagination: { page, limit, total: 0, totalPages: 0 }
            };
            res.status(200).json({
                success: true,
                message: "User assessment results retrieved successfully",
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
            const limit = parseInt(req.query.limit) || 10;
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentLeaderboard(assessmentId, limit);
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
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentStats(assessmentId);
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
    // Check if user can retake assessment
    static async canRetakeAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const canRetake = await assessmentExecution_service_1.AssessmentExecutionService.canRetakeAssessment(userId, assessmentId);
            res.status(200).json({
                success: true,
                message: "Retake eligibility checked",
                data: { canRetake },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get time remaining for assessment
    static async getTimeRemaining(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            // Mock: Get start time (in real app, this would come from database)
            const startTime = new Date(); // This should be fetched from user's assessment session
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getTimeRemaining(startTime);
            res.status(200).json({
                success: true,
                message: "Time remaining retrieved",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AssessmentExecutionController = AssessmentExecutionController;
//# sourceMappingURL=assessmentExecution.controller.js.map