"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentManagementController = void 0;
const assessmentCreation_service_1 = require("../../services/skillAssessment/assessmentCreation.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
class AssessmentManagementController {
    static async createAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const { title, description, category, questions, badgeTemplateId, passScore, } = req.body;
            controllerHelper_1.ControllerHelper.validateRequired({ title, category }, "Title and category are required");
            if (!Array.isArray(questions)) {
                return res.status(400).json({ message: "Questions must be an array" });
            }
            if (questions.length === 0) {
                return res
                    .status(400)
                    .json({ message: "At least one question is required" });
            }
            // Validate each question
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.question || !q.question.trim()) {
                    return res
                        .status(400)
                        .json({ message: `Question ${i + 1}: Question text is required` });
                }
                if (!Array.isArray(q.options) || q.options.length !== 4) {
                    return res.status(400).json({
                        message: `Question ${i + 1}: Must have exactly 4 options`,
                    });
                }
                if (!q.answer || !q.answer.trim()) {
                    return res
                        .status(400)
                        .json({ message: `Question ${i + 1}: Answer is required` });
                }
                if (!q.options.includes(q.answer)) {
                    return res.status(400).json({
                        message: `Question ${i + 1}: Answer must be one of the options`,
                    });
                }
            }
            const assessment = await assessmentCreation_service_1.AssessmentCreationService.createAssessment({
                title,
                description,
                category,
                badgeTemplateId,
                passScore,
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
    static async getAssessments(req, res, next) {
        try {
            const page = parseInt(req.query.page || "1");
            const limit = parseInt(req.query.limit || "10");
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
    static async getAssessmentById(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            const assessment = await assessmentCreation_service_1.AssessmentCreationService.getAssessmentById(assessmentId, role);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAssessmentBySlug(req, res, next) {
        try {
            const { role } = res.locals.decrypt;
            const slug = req.params.slug;
            const assessment = await assessmentCreation_service_1.AssessmentCreationService.getAssessmentBySlug(slug, role);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            const { title, description, category, badgeTemplateId, passScore, questions, } = req.body;
            const result = await assessmentCreation_service_1.AssessmentCreationService.updateAssessment(assessmentId, userId, { title, description, category, badgeTemplateId, passScore, questions });
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            const result = await assessmentCreation_service_1.AssessmentCreationService.deleteAssessment(assessmentId, userId);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getDeveloperAssessments(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const assessments = await assessmentCreation_service_1.AssessmentCreationService.getAssessments(page, limit);
            res.status(200).json({
                success: true,
                message: "Developer assessments retrieved successfully",
                data: assessments,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AssessmentManagementController = AssessmentManagementController;
