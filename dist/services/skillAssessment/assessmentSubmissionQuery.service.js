"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentSubmissionQueryService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
const scoringCalculation_service_1 = require("./scoringCalculation.service");
class AssessmentSubmissionQueryService {
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserAssessmentAttempts(userId, assessmentId);
    }
    static async getUserResults(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return {
            results: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
        };
    }
    // Check if assessment exists
    static async checkAssessmentExists(assessmentId) {
        try {
            const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
            return !!assessment;
        }
        catch (error) {
            return false;
        }
    }
    // Get assessment for taking (without answers)
    static async getAssessmentForTaking(assessmentId) {
        try {
            const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
            if (!assessment) {
                throw new customError_1.CustomError("Assessment not found", 404);
            }
            // Return assessment without answers for security
            return {
                id: assessment.id,
                slug: assessment.slug,
                title: assessment.title,
                description: assessment.description,
                passScore: assessment.passScore,
                questions: assessment.questions?.map((q) => ({
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    // Don't include the correct answer
                })) || [],
                badgeTemplate: assessment.badgeTemplate,
                creator: assessment.creator,
            };
        }
        catch (error) {
            throw error;
        }
    }
    static async getAssessmentResult(userId, assessmentId) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (!result) {
            throw new customError_1.CustomError("Assessment result not found", 404);
        }
        // Get assessment to check current pass score
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        if (assessment) {
            // Recalculate isPassed based on current pass score
            const isPassed = this.isAssessmentPassed(result.score, assessment.passScore);
            // Update result with recalculated pass status
            result.isPassed = isPassed;
        }
        return result;
    }
    static async getAllAssessmentResults(assessmentId, createdBy) {
        // Get real results from database
        const results = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
        // Handle null results
        if (!results || !Array.isArray(results)) {
            return {
                results: [],
                summary: {
                    totalAttempts: 0,
                    passedCount: 0,
                    averageScore: 0,
                    passRate: 0,
                },
            };
        }
        // Get assessment to check pass score
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        const passScore = assessment?.passScore || 75;
        // Calculate summary statistics with dynamic pass score
        const totalAttempts = results.length;
        const passedCount = results.filter((r) => this.isAssessmentPassed(r.score, passScore)).length;
        const averageScore = totalAttempts > 0
            ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) /
                totalAttempts)
            : 0;
        const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
        return {
            results,
            summary: {
                totalAttempts,
                averageScore,
                passRate,
                completionRate: 100, // All submitted results are complete
            },
            assessment: {
                id: assessmentId,
                title: "Assessment Results",
                totalQuestions: 25,
            },
        };
    }
    static isAssessmentPassed(score, passScore) {
        return scoringCalculation_service_1.ScoringCalculationService.isPassed(score, passScore);
    }
}
exports.AssessmentSubmissionQueryService = AssessmentSubmissionQueryService;
