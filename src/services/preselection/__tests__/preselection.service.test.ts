import { PreselectionService } from '../../preselection/preselection.service';
import { UserRole } from '../../../generated/prisma';

jest.mock('../../../repositories/preselection/preselection.repository', () => ({
  PreselectionRepository: {
    upsertTest: jest.fn(async (jobId: number, questions: any[], passingScore?: number, isActive?: boolean) => ({ jobId, questions, passingScore, isActive })),
    getJob: jest.fn(async (jobId: number) => ({ id: jobId, company: { adminId: 1 } })),
    getTestByJobId: jest.fn(),
    getTestById: jest.fn(),
    getResult: jest.fn(),
    createResult: jest.fn(async (userId: number, testId: number, score: number) => ({ id: 99, userId, testId, score })),
  }
}));

const { PreselectionRepository } = jest.requireMock('../../../repositories/preselection/preselection.repository');

function makeQuestions(n: number) {
  return Array.from({ length: n }).map((_, i) => ({ question: `Q${i+1}`, options: ['A','B','C','D'], answer: 'A' }));
}

describe('PreselectionService.createOrUpdateTest', () => {
  it('rejects non-admin', async () => {
    await expect(PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: UserRole.USER, questions: makeQuestions(25), passingScore: 20, isActive: true }))
      .rejects.toMatchObject({ status: 401 });
  });

  it('validates exactly 25 questions when active', async () => {
    await expect(PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: UserRole.ADMIN, questions: makeQuestions(20), passingScore: 18, isActive: true }))
      .rejects.toMatchObject({ status: 400 });
  });

  it('allows disabling without 25 questions', async () => {
    const res = await PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: UserRole.ADMIN, questions: [], isActive: false });
    expect(res.isActive).toBe(false);
  });

  it('calls repository upsert when valid', async () => {
    const res = await PreselectionService.createOrUpdateTest({ jobId: 10, requesterId: 1, requesterRole: UserRole.ADMIN, questions: makeQuestions(25), passingScore: 20, isActive: true });
    expect(res.passingScore).toBe(20);
    expect(PreselectionRepository.upsertTest).toHaveBeenCalled();
  });
});

describe('PreselectionService.submitAnswers', () => {
  beforeEach(() => {
    (PreselectionRepository.getTestById as jest.Mock).mockReset();
    (PreselectionRepository.getResult as jest.Mock).mockReset();
    (PreselectionRepository.createResult as jest.Mock).mockReset();
  });

  it('rejects if requester is not USER', async () => {
    await expect(PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: UserRole.ADMIN, answers: [] }))
      .rejects.toMatchObject({ status: 401 });
  });

  it('rejects if applicantId mismatch', async () => {
    await expect(PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 3, testId: 1, requesterRole: UserRole.USER, answers: [] }))
      .rejects.toMatchObject({ status: 403 });
  });

  it('rejects when test not found or inactive', async () => {
    (PreselectionRepository.getTestById as jest.Mock).mockResolvedValue(null);
    await expect(PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: UserRole.USER, answers: [] }))
      .rejects.toMatchObject({ status: 404 });

    (PreselectionRepository.getTestById as jest.Mock).mockResolvedValue({ id: 1, isActive: false, questions: [] });
    await expect(PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: UserRole.USER, answers: [] }))
      .rejects.toMatchObject({ status: 400 });
  });

  it('rejects double submit', async () => {
    (PreselectionRepository.getTestById as jest.Mock).mockResolvedValue({ id: 1, isActive: true, passingScore: 20, questions: [{ id: 11, options: ['A','B','C','D'], answer: 'A' }] });
    (PreselectionRepository.getResult as jest.Mock).mockResolvedValue({ id: 5 });
    await expect(PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: UserRole.USER, answers: [{ questionId: 11, selected: 'A' }] }))
      .rejects.toMatchObject({ status: 400 });
  });

  it('rejects partial answers', async () => {
    (PreselectionRepository.getTestById as jest.Mock).mockResolvedValue({ id: 1, isActive: true, passingScore: 1, questions: [{ id: 11, options: ['A','B','C','D'], answer: 'A' }, { id: 12, options: ['A','B','C','D'], answer: 'B' }] });
    (PreselectionRepository.getResult as jest.Mock).mockResolvedValue(null);
    await expect(PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: UserRole.USER, answers: [{ questionId: 11, selected: 'A' }] }))
      .rejects.toMatchObject({ status: 400 });
  });

  it('scores and creates result', async () => {
    (PreselectionRepository.getTestById as jest.Mock).mockResolvedValue({ id: 1, isActive: true, passingScore: 2, questions: [
      { id: 11, options: ['A','B','C','D'], answer: 'A' },
      { id: 12, options: ['A','B','C','D'], answer: 'B' },
    ] });
    (PreselectionRepository.getResult as jest.Mock).mockResolvedValue(null);
    (PreselectionRepository.createResult as jest.Mock).mockResolvedValue({ id: 21 });

    const res = await PreselectionService.submitAnswers({ applicantId: 2, pathApplicantId: 2, testId: 1, requesterRole: UserRole.USER, answers: [
      { questionId: 11, selected: 'A' },
      { questionId: 12, selected: 'B' },
    ] });
    expect(res.isPassed).toBe(true);
    expect(res.totalQuestions).toBe(2);
  });
});

