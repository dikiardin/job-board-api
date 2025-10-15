"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentValidationService = void 0;
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
class AssessmentValidationService {
    static validateDeveloperRole(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can create assessments", 403);
        }
    }
    static validateQuestions(questions) {
        if (questions.length === 0)
            return;
        questions.forEach((q, index) => {
            AssessmentValidationService.validateSingleQuestion(q, index + 1);
        });
    }
    static validateSingleQuestion(question, index) {
        if (!question.question || question.options.length !== 4) {
            throw new customError_1.CustomError(`Question ${index} is invalid`, 400);
        }
        // Allow empty answers (for auto-submit scenarios)
        if (question.answer && !question.options.includes(question.answer)) {
            throw new customError_1.CustomError(`Question ${index} answer must be one of the options`, 400);
        }
    }
    static validateTimeLimit(startedAt, finishedAt) {
        const timeDiff = finishedAt.getTime() - startedAt.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        // Allow up to 31 minutes (30 minutes + 1 minute buffer for delays and auto-submit)
        if (minutesDiff > 31) {
            throw new customError_1.CustomError(`Assessment submission time exceeded maximum allowed duration of 30 minutes. Time taken: ${Math.round(minutesDiff * 100) / 100} minutes`, 400);
        }
    }
    static validateAnswerCount(answersCount, totalQuestions) {
        if (answersCount > totalQuestions) {
            throw new customError_1.CustomError("Too many answers provided", 400);
        }
    }
}
exports.AssessmentValidationService = AssessmentValidationService;
//# sourceMappingURL=assessmentValidation.service.js.map