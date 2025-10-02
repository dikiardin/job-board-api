"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCreationController = void 0;
const assessmentCreation_service_1 = require("../../services/skillAssessment/assessmentCreation.service");
const customError_1 = require("../../utils/customError");
class AssessmentCreationController {
    // Create new assessment (Developer only)
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
    // Get all assessments for management (Developer only)
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
    // Get assessment by ID for editing (Developer only)
    static async getAssessmentForEditing(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const result = await assessmentCreation_service_1.AssessmentCreationService.getAssessmentById(assessmentId, role);
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
    // Update assessment (Developer only)
    static async updateAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const updateData = req.body;
            const result = await assessmentCreation_service_1.AssessmentCreationService.updateAssessment(assessmentId, userId, updateData);
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
    // Delete assessment (Developer only)
    static async deleteAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const result = await assessmentCreation_service_1.AssessmentCreationService.deleteAssessment(assessmentId, userId);
            res.status(200).json({
                success: true,
                message: "Assessment deleted successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get developer's assessments
    static async getDeveloperAssessments(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Mock implementation
            const result = {
                assessments: [],
                pagination: { page, limit, total: 0, totalPages: 0 }
            };
            res.status(200).json({
                success: true,
                message: "Developer assessments retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Search assessments (Developer only)
    static async searchAssessments(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const searchTerm = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (!searchTerm) {
                throw new customError_1.CustomError("Search term is required", 400);
            }
            // Mock implementation
            const result = {
                assessments: [],
                pagination: { page, limit, total: 0, totalPages: 0 }
            };
            res.status(200).json({
                success: true,
                message: "Assessment search completed",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get assessment statistics (Developer only)
    static async getAssessmentStatistics(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            // Mock implementation
            const result = { totalAssessments: 0, totalQuestions: 0 };
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
    // Duplicate assessment (Developer only)
    static async duplicateAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.id || '0');
            const { title } = req.body;
            // Mock implementation
            const result = { id: Date.now(), title: (title || 'Assessment') + ' (Copy)' };
            res.status(201).json({
                success: true,
                message: "Assessment duplicated successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AssessmentCreationController = AssessmentCreationController;
//# sourceMappingURL=assessmentCreation.controller.js.map