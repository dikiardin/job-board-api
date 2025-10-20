"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCreationService = void 0;
const assessmentCrud_repository_1 = require("../../repositories/skillAssessment/assessmentCrud.repository");
const assessmentValidation_service_1 = require("./assessmentValidation.service");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const prisma_2 = require("../../config/prisma");
const assessmentValidation_helper_1 = require("./assessmentValidation.helper");
class AssessmentCreationService {
    static async createAssessment(data) {
        assessmentValidation_service_1.AssessmentValidationService.validateDeveloperRole(data.userRole);
        (0, assessmentValidation_helper_1.validateQuestions)(data.questions);
        (0, assessmentValidation_helper_1.validatePassScore)(data.passScore);
        const { userRole, ...assessmentData } = data;
        return await assessmentCrud_repository_1.AssessmentCrudRepository.createAssessment(assessmentData);
    }
    // Get all assessments for management (Developer only)
    static async getAssessments(page = 1, limit = 10) {
        return await assessmentCrud_repository_1.AssessmentCrudRepository.getAllAssessments(page, limit);
    }
    // Get assessment details for editing (Developer only)
    static async getAssessmentById(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access assessment details", 403);
        }
        // Use direct repository method to get assessment by ID
        const assessment = await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        return assessment;
    }
    // Get assessment by slug (Developer only, mirrors getAssessmentById)
    static async getAssessmentBySlug(slug, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access assessment details", 403);
        }
        const assessment = await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentBySlug(slug);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        return assessment;
    }
    // Update assessment (Developer only)
    static async updateAssessment(assessmentId, userId, data) {
        if (data.questions) {
            (0, assessmentValidation_helper_1.validateQuestions)(data.questions);
        }
        if (data.passScore !== undefined) {
            (0, assessmentValidation_helper_1.validatePassScore)(data.passScore);
        }
        return await assessmentCrud_repository_1.AssessmentCrudRepository.updateAssessment(assessmentId, userId, data);
    }
    // Delete assessment (Developer only)
    static async deleteAssessment(assessmentId, userId) {
        // Check if assessment exists
        const assessment = await assessmentCrud_repository_1.AssessmentCrudRepository.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        // Verify ownership
        if (assessment.createdBy !== userId) {
            throw new customError_1.CustomError("Unauthorized to delete this assessment", 403);
        }
        return await assessmentCrud_repository_1.AssessmentCrudRepository.deleteAssessment(assessmentId, userId);
    }
    // Get assessment statistics (Developer only)
    static async getAssessmentStats(assessmentId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access assessment statistics", 403);
        }
        const [questionCount, resultCount] = await Promise.all([
            prisma_2.prisma.skillQuestion.count({
                where: { assessmentId },
            }),
            prisma_2.prisma.skillResult.count({
                where: { assessmentId },
            }),
        ]);
        return {
            totalQuestions: questionCount,
            totalResults: resultCount,
        };
    }
}
exports.AssessmentCreationService = AssessmentCreationService;
