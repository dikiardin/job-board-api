"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionValidationService = void 0;
const customError_1 = require("../../utils/customError");
class AssessmentExecutionValidationService {
    // Validate assessment submission
    static validateSubmission(data) {
        // Validate time limit
        if (data.timeSpent > this.TIME_LIMIT_MINUTES) {
            throw new customError_1.CustomError(`Assessment submission time exceeded maximum allowed duration of ${this.TIME_LIMIT_MINUTES} minutes. Time taken: ${data.timeSpent} minutes`, 400);
        }
        // Validate all questions are answered
        if (data.answers.length !== 25) {
            throw new customError_1.CustomError("All 25 questions must be answered", 400);
        }
        // Validate answer format
        data.answers.forEach((answer, index) => {
            if (!answer.questionId || !answer.answer) {
                throw new customError_1.CustomError(`Answer ${index + 1} is invalid`, 400);
            }
        });
    }
    // Get time remaining for assessment
    static getTimeRemaining(startTime) {
        const elapsed = (Date.now() - startTime.getTime()) / (1000 * 60); // minutes
        const remaining = Math.max(0, this.TIME_LIMIT_MINUTES - elapsed);
        return Math.floor(remaining);
    }
    // Get time limit
    static getTimeLimit() {
        return this.TIME_LIMIT_MINUTES;
    }
}
exports.AssessmentExecutionValidationService = AssessmentExecutionValidationService;
AssessmentExecutionValidationService.TIME_LIMIT_MINUTES = 30; // 30 minutes per brief
