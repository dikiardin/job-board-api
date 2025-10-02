"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const preselection_service_1 = require("../../preselection/preselection.service");
const prisma_1 = require("../../../generated/prisma");
jest.mock('../../../repositories/preselection/preselection.repository', () => ({
    PreselectionRepository: {
        upsertTest: jest.fn(async (jobId, questions, passingScore, isActive) => ({ jobId, questions, passingScore, isActive })),
        getJob: jest.fn(async (jobId) => ({ id: jobId, company: { adminId: 1 } })),
        getTestByJobId: jest.fn(),
        getTestById: jest.fn(),
        getResult: jest.fn(),
        createResult: jest.fn(async (userId, testId, score) => ({ id: 99, userId, testId, score })),
    }
}));
const { PreselectionRepository } = jest.requireMock('../../../repositories/preselection/preselection.repository');
function makeQuestions(n) {
    return Array.from({ length: n }).map((_, i) => ({ question: `Q${i + 1}`, options: ['A', 'B', 'C', 'D'], answer: 'A' }));
}
describe('PreselectionService.createOrUpdateTest', () => {
    it('rejects non-admin', async () => {
        await expect(preselection_service_1.PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: prisma_1.UserRole.USER, questions: makeQuestions(25), passingScore: 20, isActive: true }))
            .rejects.toMatchObject({ status: 401 });
    });
    it('validates exactly 25 questions when active', async () => {
        await expect(preselection_service_1.PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: prisma_1.UserRole.ADMIN, questions: makeQuestions(20), passingScore: 18, isActive: true }))
            .rejects.toMatchObject({ status: 400 });
    });
    it('allows disabling without 25 questions', async () => {
        const res = await preselection_service_1.PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: prisma_1.UserRole.ADMIN, questions: [], isActive: false });
        expect(res.isActive).toBe(false);
    });
    it('calls repository upsert when valid', async () => {
        const res = await preselection_service_1.PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: prisma_1.UserRole.ADMIN, questions: makeQuestions(25), passingScore: 20, isActive: true });
        expect(res.passingScore).toBe(20);
        expect(PreselectionRepository.upsertTest).toHaveBeenCalled();
    });
});
describe('PreselectionService.submitAnswers', () => {
    beforeEach(() => {
        PreselectionRepository.getTestById.mockReset();
        PreselectionRepository.getResult.mockReset();
        PreselectionRepository.createResult.mockReset();
    });
    it('rejects if requester is not USER', async () => {
        await expect(preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: prisma_1.UserRole.ADMIN, answers: [] }))
            .rejects.toMatchObject({ status: 401 });
    });
    it('rejects if applicantId mismatch', async () => {
        await expect(preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 3, testId: 1, requesterRole: prisma_1.UserRole.USER, answers: [] }))
            .rejects.toMatchObject({ status: 403 });
    });
    it('rejects when test not found or inactive', async () => {
        PreselectionRepository.getTestById.mockResolvedValue(null);
        await expect(preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: prisma_1.UserRole.USER, answers: [] }))
            .rejects.toMatchObject({ status: 404 });
        PreselectionRepository.getTestById.mockResolvedValue({ id: 1, isActive: false, questions: [] });
        await expect(preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: prisma_1.UserRole.USER, answers: [] }))
            .rejects.toMatchObject({ status: 400 });
    });
    it('rejects double submit', async () => {
        PreselectionRepository.getTestById.mockResolvedValue({ id: 1, isActive: true, passingScore: 20, questions: [{ id: 11, options: ['A', 'B', 'C', 'D'], answer: 'A' }] });
        PreselectionRepository.getResult.mockResolvedValue({ id: 5 });
        await expect(preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: prisma_1.UserRole.USER, answers: [{ questionId: 11, selected: 'A' }] }))
            .rejects.toMatchObject({ status: 400 });
    });
    it('rejects partial answers', async () => {
        PreselectionRepository.getTestById.mockResolvedValue({ id: 1, isActive: true, passingScore: 1, questions: [{ id: 11, options: ['A', 'B', 'C', 'D'], answer: 'A' }, { id: 12, options: ['A', 'B', 'C', 'D'], answer: 'B' }] });
        PreselectionRepository.getResult.mockResolvedValue(null);
        await expect(preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: prisma_1.UserRole.USER, answers: [{ questionId: 11, selected: 'A' }] }))
            .rejects.toMatchObject({ status: 400 });
    });
    it('scores and creates result', async () => {
        PreselectionRepository.getTestById.mockResolvedValue({ id: 1, isActive: true, passingScore: 2, questions: [
                { id: 11, options: ['A', 'B', 'C', 'D'], answer: 'A' },
                { id: 12, options: ['A', 'B', 'C', 'D'], answer: 'B' },
            ] });
        PreselectionRepository.getResult.mockResolvedValue(null);
        PreselectionRepository.createResult.mockResolvedValue({ id: 21 });
        const res = await preselection_service_1.PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: prisma_1.UserRole.USER, answers: [
                { questionId: 11, selected: 'A' },
                { questionId: 12, selected: 'B' },
            ] });
        expect(res.isPassed).toBe(true);
        expect(res.totalQuestions).toBe(2);
    });
});
//# sourceMappingURL=preselection.service.test.js.map