"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPassingScore = exports.getPassingScore = exports.calculateScoreBreakdown = exports.getAssessmentFeedback = exports.AssessmentResultsService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const skillAssessmentResults_repository_1 = require("../../repositories/skillAssessment/skillAssessmentResults.repository");
const customError_1 = require("../../utils/customError");
const assessmentFeedback_helper_1 = require("./assessmentFeedback.helper");
Object.defineProperty(exports, "getAssessmentFeedback", { enumerable: true, get: function () { return assessmentFeedback_helper_1.getAssessmentFeedback; } });
Object.defineProperty(exports, "calculateScoreBreakdown", { enumerable: true, get: function () { return assessmentFeedback_helper_1.calculateScoreBreakdown; } });
Object.defineProperty(exports, "getPassingScore", { enumerable: true, get: function () { return assessmentFeedback_helper_1.getPassingScore; } });
Object.defineProperty(exports, "isPassingScore", { enumerable: true, get: function () { return assessmentFeedback_helper_1.isPassingScore; } });
class AssessmentResultsService {
    // Get user's assessment results
    static async getUserResults(userId, page = 1, limit = 10) {
        try {
            // Repository already handles pagination
            const result = await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserResults(userId, page, limit);
            return result;
        }
        catch (error) {
            console.error("Error getting user results:", error);
            throw new customError_1.CustomError("Failed to retrieve assessment results", 500);
        }
    }
    // Get specific assessment result
    static async getAssessmentResult(userId, assessmentId) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (!result) {
            throw new customError_1.CustomError("Assessment result not found", 404);
        }
        return result;
    }
    // Get assessment statistics
    static async getAssessmentStatistics(assessmentId, createdBy) {
        // Get assessment results
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
    }
    static async getAssessmentSummary(assessmentId, createdBy) {
        const stats = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
        // Handle null/empty stats
        if (!stats || !Array.isArray(stats) || stats.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                passRate: 0,
            };
        }
        return {
            totalAttempts: stats.length,
            averageScore: stats.reduce((sum, result) => sum + (result.score || 0), 0) / stats.length,
            passRate: (stats.filter((result) => result.isPassed).length / stats.length) *
                100,
        };
    }
    // Reset assessment for retake
    static async resetAssessment(userId, assessmentId) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (existingResult && existingResult.isPassed) {
            throw new customError_1.CustomError("Cannot retake a passed assessment", 400);
        }
        return { message: "Assessment reset successfully. You can now retake it." };
    }
    // Check if user can retake assessment
    static async canRetakeAssessment(userId, assessmentId) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        // Can retake if no previous attempt or if failed
        return !existingResult || !existingResult.isPassed;
    }
    // Get assessment completion certificate info
    static async getCertificateInfo(userId, assessmentId) {
        const result = await this.getAssessmentResult(userId, assessmentId);
        if (!result) {
            throw new customError_1.CustomError("Assessment result not found", 404);
        }
        if (!result.isPassed) {
            throw new customError_1.CustomError("Certificate only available for passed assessments", 400);
        }
        return {
            certificateCode: result.certificateCode,
            certificateUrl: result.certificateUrl,
            issuedAt: result.createdAt,
            score: result.score,
        };
    }
}
exports.AssessmentResultsService = AssessmentResultsService;
