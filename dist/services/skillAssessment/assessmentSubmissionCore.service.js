"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentSubmissionCoreService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
const certificate_service_1 = require("./certificate.service");
const assessmentExecution_service_1 = require("./assessmentExecution.service");
const scoringCalculation_service_1 = require("./scoringCalculation.service");
const assessmentValidation_service_1 = require("./assessmentValidation.service");
class AssessmentSubmissionCoreService {
    static async submitAssessment(data) {
        await AssessmentSubmissionCoreService.validateSubmission(data);
        const assessment = await assessmentExecution_service_1.AssessmentExecutionService.validateAssessmentExists(data.assessmentId);
        // Calculate time spent from startedAt
        const startTime = new Date(data.startedAt);
        const finishTime = new Date();
        const timeSpentMinutes = Math.round((finishTime.getTime() - startTime.getTime()) / (1000 * 60));
        const { score, correctAnswers, totalQuestions } = scoringCalculation_service_1.ScoringCalculationService.calculateScore(assessment.questions, data.answers);
        const isPassed = scoringCalculation_service_1.ScoringCalculationService.isPassed(score, assessment.passScore);
        // Generate certificate immediately if user passed
        const certificateData = isPassed
            ? await AssessmentSubmissionCoreService.generateCertificate(data.userId, assessment, score, totalQuestions)
            : null;
        // Save result with certificate data
        const resultData = {
            userId: data.userId,
            assessmentId: data.assessmentId,
            score,
            isPassed,
        };
        if (certificateData) {
            resultData.certificateUrl = certificateData.certificateUrl;
            resultData.certificateCode = certificateData.certificateCode;
        }
        const result = await AssessmentSubmissionCoreService.saveAssessmentResult(resultData);
        return {
            result: {
                id: result.id,
                slug: result.slug,
                score,
                correctAnswers,
                totalQuestions,
                passed: isPassed,
                timeSpent: timeSpentMinutes,
                completedAt: result.createdAt,
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
            userName: user.name || "User",
            userEmail: user.email,
            assessmentTitle: assessment.title,
            assessmentDescription: assessment.description || "",
            score,
            totalQuestions,
            completedAt: new Date(),
            userId,
            badgeName: assessment.badgeTemplate?.name,
        });
    }
    static async saveAssessmentResult(data) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.saveAssessmentResult(data);
    }
}
exports.AssessmentSubmissionCoreService = AssessmentSubmissionCoreService;
//# sourceMappingURL=assessmentSubmissionCore.service.js.map