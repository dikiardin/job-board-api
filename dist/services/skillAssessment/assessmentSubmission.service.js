"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentSubmissionService = void 0;
const assessmentSubmissionCore_service_1 = require("./assessmentSubmissionCore.service");
const assessmentSubmissionQuery_service_1 = require("./assessmentSubmissionQuery.service");
class AssessmentSubmissionService {
    static async submitAssessment(data) {
        return assessmentSubmissionCore_service_1.AssessmentSubmissionCoreService.submitAssessment(data);
    }
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.getUserAssessmentAttempts(userId, assessmentId);
    }
    static async getUserResults(userId, page = 1, limit = 10) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.getUserResults(userId, page, limit);
    }
    // Check if assessment exists
    static async checkAssessmentExists(assessmentId) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.checkAssessmentExists(assessmentId);
    }
    // Get assessment for taking (without answers)
    static async getAssessmentForTaking(assessmentId) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.getAssessmentForTaking(assessmentId);
    }
    static async getAssessmentResult(userId, assessmentId) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.getAssessmentResult(userId, assessmentId);
    }
    static async getAllAssessmentResults(assessmentId, createdBy) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.getAllAssessmentResults(assessmentId, createdBy);
    }
    static isAssessmentPassed(score, passScore) {
        return assessmentSubmissionQuery_service_1.AssessmentSubmissionQueryService.isAssessmentPassed(score, passScore);
    }
}
exports.AssessmentSubmissionService = AssessmentSubmissionService;
//# sourceMappingURL=assessmentSubmission.service.js.map