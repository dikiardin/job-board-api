"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionTestService = void 0;
const prisma_1 = require("../../generated/prisma");
class PreselectionTestService {
    static async createOrUpdateTest(params, dependencies) {
        const { jobId, requesterId, requesterRole, questions, passingScore, isActive = true } = params;
        dependencies.validateAdminAccess(requesterRole);
        await dependencies.validateJobOwnership(jobId, requesterId);
        // Allow disabling test without providing 25 questions
        if (isActive) {
            dependencies.validateQuestions(questions);
            dependencies.validatePassingScore(passingScore, questions.length);
        }
        const created = await dependencies.upsertTest(jobId, questions, passingScore, isActive);
        return created;
    }
    static async getTestForJob(jobId, requesterRole, dependencies) {
        const test = await dependencies.getTestByJobId(jobId);
        if (!test)
            throw { status: 404, message: "Test not found" };
        // Hide answers for non-admins
        const hideAnswers = requesterRole !== prisma_1.UserRole.ADMIN;
        return {
            id: test.id,
            jobId: test.jobId,
            isActive: test.isActive,
            passingScore: test.passingScore,
            createdAt: test.createdAt,
            questions: test.questions.map((q) => {
                // Ensure options is always an array
                let options = [];
                if (Array.isArray(q.options)) {
                    options = q.options;
                }
                else if (typeof q.options === 'string') {
                    try {
                        options = JSON.parse(q.options);
                    }
                    catch {
                        options = [];
                    }
                }
                else if (q.options && typeof q.options === 'object') {
                    // Handle Prisma Json type
                    options = q.options;
                }
                return {
                    id: q.id,
                    question: q.question,
                    options,
                    ...(hideAnswers ? {} : { answer: q.answer }),
                };
            }),
        };
    }
    static async statusForUser(params, dependencies) {
        const { jobId, userId } = params;
        const test = await dependencies.getTestByJobId(jobId);
        if (!test || !test.isActive) {
            return { required: false };
        }
        const result = await dependencies.getResult(userId, test.id);
        const submitted = !!result;
        const score = result?.score ?? null;
        const passingScore = test.passingScore ?? null;
        const isPassed = submitted ? (passingScore != null ? (score >= passingScore) : true) : false;
        return {
            required: true,
            testId: test.id,
            submitted,
            score,
            passingScore,
            isPassed,
        };
    }
}
exports.PreselectionTestService = PreselectionTestService;
