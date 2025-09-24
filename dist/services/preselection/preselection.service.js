"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionService = void 0;
const preselection_repository_1 = require("../../repositories/preselection/preselection.repository");
const prisma_1 = require("../../generated/prisma");
class PreselectionService {
    static async createOrUpdateTest(params) {
        const { jobId, requesterId, requesterRole, questions, passingScore, isActive = true } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can create tests" };
        const job = await preselection_repository_1.PreselectionRepository.getJob(jobId);
        if (!job)
            throw { status: 404, message: "Job not found" };
        if (!job.company || job.company.adminId !== requesterId) {
            throw { status: 403, message: "You don't own this job" };
        }
        if (!Array.isArray(questions) || questions.length === 0)
            throw { status: 400, message: "Questions are required" };
        if (questions.length !== 25)
            throw { status: 400, message: "Preselection test must contain exactly 25 questions" };
        for (const [idx, q] of questions.entries()) {
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
                throw { status: 400, message: `Question #${idx + 1} must have text and exactly 4 options` };
            }
            if (typeof q.answer !== "string" || !q.options.includes(q.answer)) {
                throw { status: 400, message: `Question #${idx + 1} answer must match one of the options` };
            }
        }
        if (passingScore !== undefined) {
            if (passingScore < 0 || passingScore > questions.length)
                throw { status: 400, message: "Invalid passingScore" };
        }
        const created = await preselection_repository_1.PreselectionRepository.upsertTest(jobId, questions, passingScore, isActive);
        return created;
    }
    static async getTestForJob(jobId, requesterRole) {
        const test = await preselection_repository_1.PreselectionRepository.getTestByJobId(jobId);
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
            questions: test.questions.map((q) => ({
                id: q.id,
                question: q.question,
                options: q.options,
                ...(hideAnswers ? {} : { answer: q.answer }),
            })),
        };
    }
    static async submitAnswers(params) {
        const { applicantId, pathApplicantId, testId, requesterRole, answers } = params;
        if (requesterRole !== prisma_1.UserRole.USER)
            throw { status: 401, message: "Only applicant can submit" };
        if (applicantId !== pathApplicantId)
            throw { status: 403, message: "Cannot submit for another user" };
        const prismaTest = await preselection_repository_1.PreselectionRepository.getTestById(testId);
        if (!prismaTest)
            throw { status: 404, message: "Test not found" };
        if (!prismaTest.isActive)
            throw { status: 400, message: "Test is not active" };
        // Prevent double submit
        const existing = await preselection_repository_1.PreselectionRepository.getResult(applicantId, testId);
        if (existing)
            throw { status: 400, message: "You have already submitted this test" };
        if (!Array.isArray(answers) || answers.length === 0)
            throw { status: 400, message: "Answers are required" };
        // Map questions for quick lookup
        const qMap = new Map(prismaTest.questions.map((q) => [q.id, q]));
        let score = 0;
        const answerRecords = [];
        for (const a of answers) {
            const q = qMap.get(a.questionId);
            if (!q)
                throw { status: 400, message: `Invalid questionId ${a.questionId}` };
            const options = q.options;
            if (!options.includes(a.selected))
                throw { status: 400, message: `Selected answer is not a valid option for question ${a.questionId}` };
            const isCorrect = a.selected === q.answer;
            if (isCorrect)
                score += 1;
            answerRecords.push({ questionId: a.questionId, selected: a.selected, isCorrect });
        }
        // Optional: validate that all questions were answered
        if (answers.length !== prismaTest.questions.length) {
            // Allow partial submissions? We'll require complete submissions to avoid ambiguity
            throw { status: 400, message: "All questions must be answered" };
        }
        const result = await preselection_repository_1.PreselectionRepository.createResult(applicantId, testId, score, answerRecords);
        return {
            resultId: result.id,
            score,
            totalQuestions: prismaTest.questions.length,
            isPassed: prismaTest.passingScore != null ? score >= prismaTest.passingScore : undefined,
        };
    }
    static async getJobResults(params) {
        const { jobId, requesterId, requesterRole } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can view results" };
        const job = await preselection_repository_1.PreselectionRepository.getJob(jobId);
        if (!job)
            throw { status: 404, message: "Job not found" };
        if (!job.company || job.company.adminId !== requesterId) {
            throw { status: 403, message: "You don't own this job" };
        }
        const data = await preselection_repository_1.PreselectionRepository.getTestResultsByJob(jobId);
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
exports.PreselectionService = PreselectionService;
//# sourceMappingURL=preselection.service.js.map