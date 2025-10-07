import { PreselectionRepository } from "../../repositories/preselection/preselection.repository";
import { UserRole } from "../../generated/prisma";

export class PreselectionService {
  static async createOrUpdateTest(params: {
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
    questions: Array<{ question: string; options: string[]; answer: string }>;
    passingScore?: number;
    isActive?: boolean;
  }) {
    const { jobId, requesterId, requesterRole, questions, passingScore, isActive = true } = params;

    this.validateAdminAccess(requesterRole);
    await this.validateJobOwnership(jobId, requesterId);
    // Allow disabling test without providing 25 questions
    if (isActive) {
      this.validateQuestions(questions);
      this.validatePassingScore(passingScore, questions.length);
    }

    const created = await PreselectionRepository.upsertTest(jobId, questions, passingScore, isActive);
    return created;
  }

  private static validateAdminAccess(requesterRole: UserRole): void {
    if (requesterRole !== UserRole.ADMIN) {
      throw { status: 401, message: "Only company admin can create tests" };
    }
  }

  private static async validateJobOwnership(jobId: string | number, requesterId: number): Promise<void> {
    const job = await PreselectionRepository.getJob(jobId);
    if (!job) throw { status: 404, message: "Job not found" };
    if (!(job as any).company || (job as any).company?.ownerAdminId !== requesterId) {
      throw { status: 403, message: "You don't own this job" };
    }
  }

  private static validateQuestions(questions: Array<{ question: string; options: string[]; answer: string }>): void {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw { status: 400, message: "Questions are required" };
    }
    if (questions.length !== 25) {
      throw { status: 400, message: "Preselection test must contain exactly 25 questions" };
    }

    for (const [idx, q] of questions.entries()) {
      this.validateQuestion(q, idx + 1);
    }
  }

  private static validateQuestion(q: { question: string; options: string[]; answer: string }, questionNumber: number): void {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
      throw { status: 400, message: `Question #${questionNumber} must have text and exactly 4 options` };
    }
    if (typeof q.answer !== "string" || !q.options.includes(q.answer)) {
      throw { status: 400, message: `Question #${questionNumber} answer must match one of the options` };
    }
  }

  private static validatePassingScore(passingScore: number | undefined, questionCount: number): void {
    if (passingScore !== undefined) {
      if (passingScore < 0 || passingScore > questionCount) {
        throw { status: 400, message: "Invalid passingScore" };
      }
    }
  }

  static async getTestForJob(jobId: string | number, requesterRole?: UserRole) {
    const test = await PreselectionRepository.getTestByJobId(jobId);
    if (!test) throw { status: 404, message: "Test not found" };
    // Hide answers for non-admins
    const hideAnswers = requesterRole !== UserRole.ADMIN;
    return {
      id: test.id,
      jobId: test.jobId,
      isActive: test.isActive,
      passingScore: test.passingScore,
      createdAt: test.createdAt,
      questions: test.questions.map((q) => {
        // Ensure options is always an array
        let options: string[] = [];
        if (Array.isArray(q.options)) {
          options = q.options as string[];
        } else if (typeof q.options === 'string') {
          try {
            options = JSON.parse(q.options);
          } catch {
            options = [];
          }
        } else if (q.options && typeof q.options === 'object') {
          // Handle Prisma Json type
          options = q.options as any;
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

  static async submitAnswers(params: {
    applicantId: number;
    pathApplicantId: number;
    testId: number;
    requesterRole: UserRole;
    answers: Array<{ questionId: number; selected: string }>;
  }) {
    const { applicantId, pathApplicantId, testId, requesterRole, answers } = params;

    if (requesterRole !== UserRole.USER) throw { status: 401, message: "Only applicant can submit" };
    if (applicantId !== pathApplicantId) throw { status: 403, message: "Cannot submit for another user" };

    const prismaTest = await PreselectionRepository.getTestById(testId);
    if (!prismaTest) throw { status: 404, message: "Test not found" };
    if (!prismaTest.isActive) throw { status: 400, message: "Test is not active" };

    // Prevent double submit
    const existing = await PreselectionRepository.getResult(applicantId, testId);
    if (existing) throw { status: 400, message: "You have already submitted this test" };

    if (!Array.isArray(answers) || answers.length === 0) throw { status: 400, message: "Answers are required" };

    // Map questions for quick lookup
    const qMap = new Map(prismaTest.questions.map((q) => [q.id, q]));

    let score = 0;
    const answerRecords: Array<{ questionId: number; selected: string; isCorrect: boolean }> = [];

    for (const a of answers) {
      const q = qMap.get(a.questionId);
      if (!q) throw { status: 400, message: `Invalid questionId ${a.questionId}` };
      
      // Ensure options is always an array
      let options: string[] = [];
      if (Array.isArray(q.options)) {
        options = q.options as string[];
      } else if (typeof q.options === 'string') {
        try {
          options = JSON.parse(q.options);
        } catch {
          options = [];
        }
      } else if (q.options && typeof q.options === 'object') {
        // Handle Prisma Json type
        options = q.options as any;
      }
      
      if (!options.includes(a.selected)) throw { status: 400, message: `Selected answer is not a valid option for question ${a.questionId}` };
      const isCorrect = a.selected === q.answer;
      if (isCorrect) score += 1;
      answerRecords.push({ questionId: a.questionId, selected: a.selected, isCorrect });
    }

    // Optional: validate that all questions were answered
    if (answers.length !== prismaTest.questions.length) {
      // Allow partial submissions? We'll require complete submissions to avoid ambiguity
      throw { status: 400, message: "All questions must be answered" };
    }

    const result = await PreselectionRepository.createResult(applicantId, testId, score, answerRecords);

    return {
      resultId: result.id,
      score,
      totalQuestions: prismaTest.questions.length,
      isPassed: prismaTest.passingScore != null ? score >= prismaTest.passingScore! : undefined,
    };
  }

  static async getJobResults(params: { jobId: string | number; requesterId: number; requesterRole: UserRole }) {
    const { jobId, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can view results" };

    const job = await PreselectionRepository.getJob(jobId);
    if (!job) throw { status: 404, message: "Job not found" };
    if (!(job as any).company || (job as any).company?.ownerAdminId !== requesterId) {
      throw { status: 403, message: "You don't own this job" };
    }

    const data = await PreselectionRepository.getTestResultsByJob(jobId);
    if (!data) return { jobId, results: [] };
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

  static async statusForUser(params: { jobId: string | number; userId: number }) {
    const { jobId, userId } = params;
    const test = await PreselectionRepository.getTestByJobId(jobId);
    if (!test || !test.isActive) {
      return { required: false };
    }
    const result = await PreselectionRepository.getResult(userId, test.id);
    const submitted = !!result;
    const score = result?.score ?? null;
    const passingScore = test.passingScore ?? null;
    const isPassed = submitted ? (passingScore != null ? (score! >= passingScore) : true) : false;
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
