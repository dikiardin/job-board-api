"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionRetakeService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
class AssessmentExecutionRetakeService {
    // Check if retake is allowed
    static async canRetakeAssessment(userId, assessmentId) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (!existingResult) {
            return true; // Can retake if no previous attempt
        }
        // Get assessment to check dynamic pass score
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        const passScore = assessment?.passScore || 75;
        // Can retake if failed (score below pass score)
        return existingResult.score < passScore;
    }
    // Reset assessment for retake
    static async resetAssessmentForRetake(userId, assessmentId) {
        const canRetake = await this.canRetakeAssessment(userId, assessmentId);
        if (!canRetake) {
            throw new customError_1.CustomError("Cannot retake a passed assessment", 400);
        }
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (existingResult) {
            // Delete previous attempt
            return {
                message: "Previous attempt reset. You can now retake the assessment.",
            };
        }
        return { message: "Assessment is ready to be taken." };
    }
}
exports.AssessmentExecutionRetakeService = AssessmentExecutionRetakeService;
//# sourceMappingURL=assessmentExecutionRetake.service.js.map