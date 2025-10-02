"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentManagementController = void 0;
const assessmentCreation_service_1 = require("../../services/skillAssessment/assessmentCreation.service");
const assessmentExecution_service_1 = require("../../services/skillAssessment/assessmentExecution.service");
const assessmentSubmission_service_1 = require("../../services/skillAssessment/assessmentSubmission.service");
const customError_1 = require("../../utils/customError");
class AssessmentManagementController {
    // ===== ASSESSMENT CREATION (Developer Only) =====
    // Create new assessment
    static async createAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentData = req.body;
            const result = await assessmentCreation_service_1.AssessmentCreationService.createAssessment({
                ...assessmentData,
                createdBy: userId,
                userRole: role,
            });
            res.status(201).json({
                success: true,
                message: "Assessment created successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all assessments for management
    static async getAssessmentsForManagement(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await assessmentCreation_service_1.AssessmentCreationService.getAssessments(page, limit);
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
    // Update assessment
    static async updateAssessment(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const updateData = req.body;
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await assessmentCreation_service_1.AssessmentCreationService.updateAssessment(assessmentId, updateData, role);
            res.status(200).json({
                success: true,
                message: "Assessment updated successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete assessment
    static async deleteAssessment(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            await assessmentCreation_service_1.AssessmentCreationService.deleteAssessment(assessmentId, role);
            res.status(200).json({
                success: true,
                message: "Assessment deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // ===== ASSESSMENT TAKING (User with Subscription) =====
    // Get assessment for taking
    static async getAssessmentForTaking(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await assessmentExecution_service_1.AssessmentExecutionService.getAssessmentForTaking(assessmentId, userId);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
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
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const { answers, timeSpent } = req.body;
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await assessmentSubmission_service_1.AssessmentSubmissionService.submitAssessment({
                assessmentId,
                userId,
                answers,
                timeSpent,
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
}
exports.AssessmentManagementController = AssessmentManagementController;
//# sourceMappingURL=skillAssessmentRefactored.controller.js.map