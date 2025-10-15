"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCreationService = void 0;
const assessmentCrud_repository_1 = require("../../repositories/skillAssessment/assessmentCrud.repository");
const assessmentValidation_service_1 = require("./assessmentValidation.service");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
class AssessmentCreationService {
    static async createAssessment(data) {
        assessmentValidation_service_1.AssessmentValidationService.validateDeveloperRole(data.userRole);
        assessmentValidation_service_1.AssessmentValidationService.validateQuestions(data.questions);
        this.validatePassScore(data.passScore);
        const { userRole, ...assessmentData } = data;
        return await assessmentCrud_repository_1.AssessmentCrudRepository.createAssessment(assessmentData);
    }
    static async getAssessments(page = 1, limit = 10) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAllAssessments(page, limit);
    }
    static async getAssessmentById(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER)
            throw new customError_1.CustomError("Only developers can access assessment details", 403);
        const assessment = await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentById(assessmentId);
        if (!assessment)
            throw new customError_1.CustomError("Assessment not found", 404);
        return assessment;
    }
    static async getAssessmentBySlug(slug, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER)
            throw new customError_1.CustomError("Only developers can access assessment details", 403);
        const assessment = await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentBySlug(slug);
        if (!assessment)
            throw new customError_1.CustomError("Assessment not found", 404);
        return assessment;
    }
    static async updateAssessment(assessmentId, userId, data) {
        if (data.questions)
            this.validateUpdateQuestions(data.questions);
        if (data.passScore !== undefined)
            this.validatePassScore(data.passScore);
        return await assessmentCrud_repository_1.AssessmentCrudRepository.updateAssessment(assessmentId, userId, data);
    }
    static validateUpdateQuestions(questions) {
        if (questions.length < 1)
            throw new customError_1.CustomError("Assessment must have at least 1 question", 400);
        questions.forEach((q, index) => {
            if (!q.question || q.options.length !== 4 || !q.answer)
                throw new customError_1.CustomError(`Question ${index + 1} is invalid`, 400);
            if (!q.options.includes(q.answer))
                throw new customError_1.CustomError(`Question ${index + 1} answer must be one of the options`, 400);
        });
    }
    static async deleteAssessment(assessmentId, userId) {
        const assessments = await assessmentCrud_repository_1.AssessmentCrudRepository.getAllAssessments(1, 1000);
        const assessment = assessments.assessments.find((a) => a.id === assessmentId);
        if (!assessment)
            throw new customError_1.CustomError("Assessment not found", 404);
        return await assessmentCrud_repository_1.AssessmentCrudRepository.deleteAssessment(assessmentId, userId);
    }
    static async getAssessmentStats(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER)
            throw new customError_1.CustomError("Only developers can access assessment statistics", 403);
        return { totalAssessments: 0, totalQuestions: 0, totalResults: 0 };
    }
    static validateQuestionStructure(questions) {
        if (questions.length < 1)
            throw new customError_1.CustomError("Assessment must have at least 1 question", 400);
        questions.forEach((q, index) => {
            if (!q.question?.trim())
                throw new customError_1.CustomError(`Question ${index + 1} text is required`, 400);
            if (!Array.isArray(q.options) || q.options.length !== 4)
                throw new customError_1.CustomError(`Question ${index + 1} must have exactly 4 options`, 400);
            if (q.options.some((option) => !option?.trim()))
                throw new customError_1.CustomError(`Question ${index + 1} options cannot be empty`, 400);
            if (!q.answer?.trim())
                throw new customError_1.CustomError(`Question ${index + 1} answer is required`, 400);
            if (!q.options.includes(q.answer))
                throw new customError_1.CustomError(`Question ${index + 1} answer must be one of the provided options`, 400);
        });
    }
    static async importQuestions(assessmentId, questions, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER)
            throw new customError_1.CustomError("Only developers can import questions", 403);
        this.validateQuestionStructure(questions);
        return await assessmentCrud_repository_1.AssessmentCrudRepository.updateAssessment(assessmentId, 0, { questions });
    }
    static async exportQuestions(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER)
            throw new customError_1.CustomError("Only developers can export questions", 403);
        const assessments = await assessmentCrud_repository_1.AssessmentCrudRepository.getAllAssessments(1, 1000);
        const assessment = assessments.assessments.find((a) => a.id === assessmentId);
        if (!assessment)
            throw new customError_1.CustomError("Assessment not found", 404);
        return {
            assessmentId, title: assessment.title, description: assessment.description,
            questions: assessment.questions || [], exportedAt: new Date().toISOString(),
        };
    }
    static validatePassScore(passScore) {
        if (passScore !== undefined && passScore !== null) {
            if (typeof passScore !== "number")
                throw new customError_1.CustomError("Pass score must be a number", 400);
            if (passScore < 1 || passScore > 100)
                throw new customError_1.CustomError("Pass score must be between 1% and 100%", 400);
            if (!Number.isInteger(passScore))
                throw new customError_1.CustomError("Pass score must be a whole number", 400);
        }
    }
}
exports.AssessmentCreationService = AssessmentCreationService;
//# sourceMappingURL=assessmentCreation.service.js.map