"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionResultService = void 0;
class PreselectionResultService {
    static async submitAnswers(params, dependencies) {
        const { applicantId, pathApplicantId, testId, requesterRole, answers } = params;
        dependencies.validateSubmissionAccess(requesterRole, applicantId, pathApplicantId);
        const prismaTest = await dependencies.getTestById(testId);
        dependencies.validateTestForSubmission(prismaTest);
        // Prevent double submit
        const existing = await dependencies.getResult(applicantId, testId);
        if (existing)
            throw { status: 400, message: "You have already submitted this test" };
        dependencies.validateAnswers(answers, prismaTest.questions);
        // Map questions for quick lookup
        const qMap = new Map(prismaTest.questions.map((q) => [q.id, q]));
        let score = 0;
        const answerRecords = [];
        for (const a of answers) {
            const q = qMap.get(a.questionId);
            if (!q)
                throw { status: 400, message: `Invalid questionId ${a.questionId}` };
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
            dependencies.validateAnswerOption(a.selected, options, a.questionId);
            const isCorrect = a.selected === q.answer;
            if (isCorrect)
                score += 1;
            answerRecords.push({ questionId: a.questionId, selected: a.selected, isCorrect });
        }
        const result = await dependencies.createResult(applicantId, testId, score, answerRecords);
        return {
            resultId: result.id,
            score,
            totalQuestions: prismaTest.questions.length,
            isPassed: prismaTest.passingScore != null ? score >= prismaTest.passingScore : undefined,
        };
    }
    static async getJobResults(params, dependencies) {
        const { jobId, requesterId, requesterRole } = params;
        dependencies.validateAdminAccess(requesterRole);
        await dependencies.validateJobOwnership(jobId, requesterId);
        const data = await dependencies.getTestResultsByJob(jobId);
        if (!data)
            return { jobId, results: [] };
        return {
            jobId: data.jobId,
            testId: data.id,
            results: data.results.map((r) => ({
                resultId: r.id,
                user: { id: r.userId, name: r.user?.name, email: r.user?.email },
                score: r.score,
                submittedAt: r.createdAt,
            })),
        };
    }
}
exports.PreselectionResultService = PreselectionResultService;
//# sourceMappingURL=result.service.js.map