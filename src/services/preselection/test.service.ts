import { UserRole } from "../../generated/prisma";

export class PreselectionTestService {
  static async createOrUpdateTest(params: {
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
    questions: Array<{ question: string; options: string[]; answer: string }>;
    passingScore?: number;
    isActive?: boolean;
  }, dependencies: {
    validateAdminAccess: (role: UserRole) => void;
    validateJobOwnership: (jobId: string | number, requesterId: number) => Promise<void>;
    validateQuestions: (questions: Array<{ question: string; options: string[]; answer: string }>) => void;
    validatePassingScore: (passingScore: number | undefined, questionCount: number) => void;
    upsertTest: (jobId: string | number, questions: Array<{ question: string; options: string[]; answer: string }>, passingScore?: number, isActive?: boolean) => Promise<any>;
  }) {
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

  static async getTestForJob(jobId: string | number, requesterRole: UserRole | undefined, dependencies: {
    getTestByJobId: (jobId: string | number) => Promise<any>;
  }) {
    const test = await dependencies.getTestByJobId(jobId);
    if (!test) throw { status: 404, message: "Test not found" };
    
    // Hide answers for non-admins
    const hideAnswers = requesterRole !== UserRole.ADMIN;
    return {
      id: test.id,
      jobId: test.jobId,
      isActive: test.isActive,
      passingScore: test.passingScore,
      createdAt: test.createdAt,
      questions: test.questions.map((q: any) => {
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

  static async statusForUser(params: { jobId: string | number; userId: number }, dependencies: {
    getTestByJobId: (jobId: string | number) => Promise<any>;
    getResult: (userId: number, testId: number) => Promise<any>;
  }) {
    const { jobId, userId } = params;
    const test = await dependencies.getTestByJobId(jobId);
    if (!test || !test.isActive) {
      return { required: false };
    }
    const result = await dependencies.getResult(userId, test.id);
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

  static async deleteTestByJobId(params: {
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
  }, dependencies: {
    validateAdminAccess: (role: UserRole) => void;
    validateJobOwnership: (jobId: string | number, requesterId: number) => Promise<void>;
  }) {
    const { jobId, requesterId, requesterRole } = params;

    dependencies.validateAdminAccess(requesterRole);
    await dependencies.validateJobOwnership(jobId, requesterId);

    // Import PreselectionRepository here to avoid circular dependency
    const { PreselectionRepository } = await import("../../repositories/preselection/preselection.repository");
    
    await PreselectionRepository.deleteTestByJobId(jobId);
    return { success: true };
  }
}
