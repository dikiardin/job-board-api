import { UserRole } from "../../generated/prisma";

export class PreselectionResultService {
  static async submitAnswers(params: {
    applicantId: number;
    pathApplicantId: number;
    testId: number;
    requesterRole: UserRole;
    answers: Array<{ questionId: number; selected: string }>;
  }, dependencies: {
    validateSubmissionAccess: (requesterRole: UserRole, applicantId: number, pathApplicantId: number) => void;
    getTestById: (testId: number) => Promise<any>;
    validateTestForSubmission: (test: any) => void;
    getResult: (applicantId: number, testId: number) => Promise<any>;
    validateAnswers: (answers: Array<{ questionId: number; selected: string }>, testQuestions: any[]) => void;
    validateAnswerOption: (selected: string, options: string[], questionId: number) => void;
    createResult: (applicantId: number, testId: number, score: number, answers: Array<{ questionId: number; selected: string; isCorrect: boolean }>) => Promise<any>;
  }) {
    const { applicantId, pathApplicantId, testId, requesterRole, answers } = params;

    dependencies.validateSubmissionAccess(requesterRole, applicantId, pathApplicantId);

    const prismaTest = await dependencies.getTestById(testId);
    dependencies.validateTestForSubmission(prismaTest);

    // Prevent double submit
    const existing = await dependencies.getResult(applicantId, testId);
    if (existing) throw { status: 400, message: "You have already submitted this test" };

    dependencies.validateAnswers(answers, prismaTest.questions);

    // Map questions for quick lookup
    const qMap = new Map(prismaTest.questions.map((q: any) => [q.id, q]));

    let score = 0;
    const answerRecords: Array<{ questionId: number; selected: string; isCorrect: boolean }> = [];

    for (const a of answers) {
      const q = qMap.get(a.questionId);
      if (!q) throw { status: 400, message: `Invalid questionId ${a.questionId}` };
      
      // Ensure options is always an array
      let options: string[] = [];
      if (Array.isArray((q as any).options)) {
        options = (q as any).options as string[];
      } else if (typeof (q as any).options === 'string') {
        try {
          options = JSON.parse((q as any).options);
        } catch {
          options = [];
        }
      } else if ((q as any).options && typeof (q as any).options === 'object') {
        // Handle Prisma Json type
        options = (q as any).options as any;
      }
      
      dependencies.validateAnswerOption(a.selected, options, a.questionId);
      const isCorrect = a.selected === (q as any).answer;
      if (isCorrect) score += 1;
      answerRecords.push({ questionId: a.questionId, selected: a.selected, isCorrect });
    }

    const result = await dependencies.createResult(applicantId, testId, score, answerRecords);

    return {
      resultId: result.id,
      score,
      totalQuestions: prismaTest.questions.length,
      isPassed: prismaTest.passingScore != null ? score >= prismaTest.passingScore! : undefined,
    };
  }

  static async getJobResults(params: { jobId: string | number; requesterId: number; requesterRole: UserRole }, dependencies: {
    validateAdminAccess: (role: UserRole) => void;
    validateJobOwnership: (jobId: string | number, requesterId: number) => Promise<void>;
    getTestResultsByJob: (jobId: string | number) => Promise<any>;
  }) {
    const { jobId, requesterId, requesterRole } = params;
    dependencies.validateAdminAccess(requesterRole);

    await dependencies.validateJobOwnership(jobId, requesterId);

    const data = await dependencies.getTestResultsByJob(jobId);
    if (!data) return { jobId, results: [] };
    return {
      jobId: data.jobId,
      testId: data.id,
      results: data.results.map((r: any) => ({
        resultId: r.id,
        user: { id: r.userId, name: r.user?.name, email: r.user?.email },
        score: r.score,
        submittedAt: r.createdAt,
      })),
    };
  }
}
