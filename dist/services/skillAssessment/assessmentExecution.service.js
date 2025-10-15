"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionService = void 0;
const assessmentExecutionQuery_service_1 = require("./assessmentExecutionQuery.service");
const assessmentExecutionValidation_service_1 = require("./assessmentExecutionValidation.service");
const assessmentExecutionScoring_service_1 = require("./assessmentExecutionScoring.service");
const assessmentExecutionRetake_service_1 = require("./assessmentExecutionRetake.service");
class AssessmentExecutionService {
    // Get assessment for taking (hide answers, subscription required)
    static async getAssessmentForTaking(assessmentId, userId) {
        return assessmentExecutionQuery_service_1.AssessmentExecutionQueryService.getAssessmentForTaking(assessmentId, userId);
    }
    // Calculate assessment score
    static calculateScore(questions, userAnswers) {
        return assessmentExecutionScoring_service_1.AssessmentExecutionScoringService.calculateScore(questions, userAnswers);
    }
    // Check user subscription status
    static async checkUserSubscription(userId) {
        return assessmentExecutionQuery_service_1.AssessmentExecutionQueryService.checkUserSubscription(userId);
    }
    // Get user information
    static async getUserInfo(userId) {
        return assessmentExecutionQuery_service_1.AssessmentExecutionQueryService.getUserInfo(userId);
    }
    // Validate assessment submission
    static validateSubmission(data) {
        return assessmentExecutionValidation_service_1.AssessmentExecutionValidationService.validateSubmission(data);
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit = 10) {
        return assessmentExecutionQuery_service_1.AssessmentExecutionQueryService.getAssessmentLeaderboard(assessmentId, limit);
    }
    // Get assessment statistics for users
    static async getAssessmentStats(assessmentId) {
        return assessmentExecutionQuery_service_1.AssessmentExecutionQueryService.getAssessmentStats(assessmentId);
    }
    // Check if retake is allowed
    static async canRetakeAssessment(userId, assessmentId) {
        return assessmentExecutionRetake_service_1.AssessmentExecutionRetakeService.canRetakeAssessment(userId, assessmentId);
    }
    // Reset assessment for retake
    static async resetAssessmentForRetake(userId, assessmentId) {
        return assessmentExecutionRetake_service_1.AssessmentExecutionRetakeService.resetAssessmentForRetake(userId, assessmentId);
    }
    // Get time remaining for assessment
    static getTimeRemaining(startTime) {
        return assessmentExecutionValidation_service_1.AssessmentExecutionValidationService.getTimeRemaining(startTime);
    }
    // Validate assessment exists and is active
    static async validateAssessmentExists(assessmentId) {
        return assessmentExecutionQuery_service_1.AssessmentExecutionQueryService.validateAssessmentExists(assessmentId);
    }
    // Get passing score threshold
    static getPassingScore(assessmentPassScore) {
        return assessmentExecutionScoring_service_1.AssessmentExecutionScoringService.getPassingScore(assessmentPassScore);
    }
    // Get time limit
    static getTimeLimit() {
        return assessmentExecutionValidation_service_1.AssessmentExecutionValidationService.getTimeLimit();
    }
}
exports.AssessmentExecutionService = AssessmentExecutionService;
//# sourceMappingURL=assessmentExecution.service.js.map