"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentSubmissionService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
const certificate_service_1 = require("./certificate.service");
const assessmentExecution_service_1 = require("./assessmentExecution.service");
const scoringCalculation_service_1 = require("./scoringCalculation.service");
class AssessmentSubmissionService {
    static async submitAssessment(data) {
        await AssessmentSubmissionService.validateSubmission(data);
        const assessment = await assessmentExecution_service_1.AssessmentExecutionService.validateAssessmentExists(data.assessmentId);
        const { score, correctAnswers, totalQuestions } = scoringCalculation_service_1.ScoringCalculationService.calculateScore(assessment.questions, data.answers);
        const result = await AssessmentSubmissionService.saveAssessmentResult({
            userId: data.userId, assessmentId: data.assessmentId, score,
        });
        const isPassed = scoringCalculation_service_1.ScoringCalculationService.isPassed(score);
        const certificateData = isPassed ? await AssessmentSubmissionService.generateCertificate(data.userId, assessment, score, totalQuestions) : null;
        return {
            result: {
                id: result.id, score, correctAnswers, totalQuestions,
                passed: isPassed, timeSpent: data.timeSpent, completedAt: result.createdAt
            },
            certificate: certificateData,
        };
    }
    static async validateSubmission(data) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
        if (existingResult) {
            throw new customError_1.CustomError("You have already completed this assessment", 400);
        }
    }
    static async generateCertificate(userId, assessment, score, totalQuestions) {
        const user = await assessmentExecution_service_1.AssessmentExecutionService.getUserInfo(userId);
        return await certificate_service_1.CertificateService.generateCertificate({
            userName: user.name || 'User', userEmail: user.email, assessmentTitle: assessment.title,
            assessmentDescription: assessment.description || '', score, totalQuestions, completedAt: new Date(), userId,
        });
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
    static async getAssessmentResult(userId, assessmentId) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (!result) {
            throw new customError_1.CustomError("Assessment result not found", 404);
        }
        return result;
    }
    static async getAllAssessmentResults(assessmentId) {
        // Get real results from database
        const results = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId);
        // Calculate summary statistics
        const totalAttempts = results.length;
        const passedCount = results.filter(r => r.isPassed).length;
        const averageScore = totalAttempts > 0
            ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts)
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
    static isAssessmentPassed(score) {
        return score >= 75;
    }
}
exports.AssessmentSubmissionService = AssessmentSubmissionService;
//# sourceMappingURL=assessmentSubmission.service.js.map