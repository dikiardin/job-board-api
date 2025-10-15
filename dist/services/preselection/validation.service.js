"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionValidationService = void 0;
const prisma_1 = require("../../generated/prisma");
class PreselectionValidationService {
    static validateAdminAccess(requesterRole) {
        if (requesterRole !== prisma_1.UserRole.ADMIN) {
            throw { status: 401, message: "Only company admin can create tests" };
        }
    }
    static async validateJobOwnership(jobId, requesterId, getJob) {
        const job = await getJob(jobId);
        if (!job)
            throw { status: 404, message: "Job not found" };
        if (!job.company || job.company?.ownerAdminId !== requesterId) {
            throw { status: 403, message: "You don't own this job" };
        }
    }
    static validateQuestions(questions) {
        if (!Array.isArray(questions) || questions.length === 0) {
            throw { status: 400, message: "Questions are required" };
        }
        if (questions.length !== 25) {
            throw { status: 400, message: "Preselection test must contain exactly 25 questions" };
        }
        for (const [idx, q] of questions.entries()) {
            PreselectionValidationService.validateQuestion(q, idx + 1);
        }
    }
    static validateQuestion(q, questionNumber) {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
            throw { status: 400, message: `Question #${questionNumber} must have text and exactly 4 options` };
        }
        if (typeof q.answer !== "string" || !q.options.includes(q.answer)) {
            throw { status: 400, message: `Question #${questionNumber} answer must match one of the options` };
        }
    }
    static validatePassingScore(passingScore, questionCount) {
        if (passingScore !== undefined) {
            if (passingScore < 0 || passingScore > questionCount) {
                throw { status: 400, message: "Invalid passingScore" };
            }
        }
    }
    static validateSubmissionAccess(requesterRole, applicantId, pathApplicantId) {
        if (requesterRole !== prisma_1.UserRole.USER)
            throw { status: 401, message: "Only applicant can submit" };
        if (applicantId !== pathApplicantId)
            throw { status: 403, message: "Cannot submit for another user" };
    }
    static validateTestForSubmission(test) {
        if (!test)
            throw { status: 404, message: "Test not found" };
        if (!test.isActive)
            throw { status: 400, message: "Test is not active" };
    }
    static validateAnswers(answers, testQuestions) {
        if (!Array.isArray(answers) || answers.length === 0)
            throw { status: 400, message: "Answers are required" };
        if (answers.length !== testQuestions.length) {
            throw { status: 400, message: "All questions must be answered" };
        }
    }
    static validateAnswerOption(selected, options, questionId) {
        if (!options.includes(selected))
            throw { status: 400, message: `Selected answer is not a valid option for question ${questionId}` };
    }
}
exports.PreselectionValidationService = PreselectionValidationService;
//# sourceMappingURL=validation.service.js.map