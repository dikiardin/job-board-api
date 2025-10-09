"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentSubmissionService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
const certificate_service_1 = require("./certificate.service");
const assessmentExecution_service_1 = require("./assessmentExecution.service");
const scoringCalculation_service_1 = require("./scoringCalculation.service");
const assessmentValidation_service_1 = require("./assessmentValidation.service");
class AssessmentSubmissionService {
    static async submitAssessment(data) {
        await AssessmentSubmissionService.validateSubmission(data);
        const assessment = await assessmentExecution_service_1.AssessmentExecutionService.validateAssessmentExists(data.assessmentId);
        // Calculate time spent from startedAt
        const startTime = new Date(data.startedAt);
        const finishTime = new Date();
        const timeSpentMinutes = Math.round((finishTime.getTime() - startTime.getTime()) / (1000 * 60));
        const { score, correctAnswers, totalQuestions } = scoringCalculation_service_1.ScoringCalculationService.calculateScore(assessment.questions, data.answers);
        const isPassed = scoringCalculation_service_1.ScoringCalculationService.isPassed(score, assessment.passScore);
        // Generate certificate immediately if user passed
        const certificateData = isPassed ? await AssessmentSubmissionService.generateCertificate(data.userId, assessment, score, totalQuestions) : null;
        // Save result with certificate data
        const resultData = {
            userId: data.userId,
            assessmentId: data.assessmentId,
            score,
        };
        if (certificateData) {
            resultData.certificateUrl = certificateData.certificateUrl;
            resultData.certificateCode = certificateData.certificateCode;
        }
        const result = await AssessmentSubmissionService.saveAssessmentResult(resultData);
        return {
            result: {
                id: result.id, score, correctAnswers, totalQuestions,
                passed: isPassed, timeSpent: timeSpentMinutes, completedAt: result.createdAt,
                certificateUrl: certificateData?.certificateUrl,
                certificateCode: certificateData?.certificateCode,
            },
            certificate: certificateData,
        };
    }
    static async validateSubmission(data) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
        if (existingResult) {
            throw new customError_1.CustomError("You have already completed this assessment", 400);
        }
        // Validate time limit using AssessmentValidationService
        const startTime = new Date(data.startedAt);
        const finishTime = new Date();
        assessmentValidation_service_1.AssessmentValidationService.validateTimeLimit(startTime, finishTime);
    }
    static async generateCertificate(userId, assessment, score, totalQuestions) {
        const user = await assessmentExecution_service_1.AssessmentExecutionService.getUserInfo(userId);
        return await certificate_service_1.CertificateService.generateCertificate({
            userName: user.name || 'User', userEmail: user.email, assessmentTitle: assessment.title,
            assessmentDescription: assessment.description || '', score, totalQuestions, completedAt: new Date(), userId,
        });
    }
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserAssessmentAttempts(userId, assessmentId);
    }
    static async saveAssessmentResult(data) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.saveAssessmentResult(data);
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
            console.error("Error checking assessment exists:", error);
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
                title: assessment.title,
                description: assessment.description,
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
            console.error("Error getting assessment for taking:", error);
            throw error;
        }
    }
    static async getAssessmentResult(userId, assessmentId) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (!result) {
            throw new customError_1.CustomError("Assessment result not found", 404);
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
                }
            };
        }
        // Get assessment to check pass score
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        const passScore = assessment?.passScore || 75;
        // Calculate summary statistics with dynamic pass score
        const totalAttempts = results.length;
        const passedCount = results.filter((r) => this.isAssessmentPassed(r.score, passScore)).length;
        const averageScore = totalAttempts > 0
            ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / totalAttempts)
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
            }
        };
    }
    static isAssessmentPassed(score, passScore) {
        return scoringCalculation_service_1.ScoringCalculationService.isPassed(score, passScore);
    }
}
exports.AssessmentSubmissionService = AssessmentSubmissionService;
//# sourceMappingURL=assessmentSubmission.service.js.map