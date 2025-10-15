import { PreselectionRepository } from "../../repositories/preselection/preselection.repository";
import { UserRole } from "../../generated/prisma";
import { PreselectionValidationService } from "./validation.service";
import { PreselectionTestService } from "./test.service";
import { PreselectionResultService } from "./result.service";

export class PreselectionService {
  private static dependencies = {
    validateAdminAccess: PreselectionValidationService.validateAdminAccess,
    validateJobOwnership: PreselectionValidationService.validateJobOwnership,
    validateQuestions: PreselectionValidationService.validateQuestions,
    validatePassingScore: PreselectionValidationService.validatePassingScore,
    validateSubmissionAccess: PreselectionValidationService.validateSubmissionAccess,
    validateTestForSubmission: PreselectionValidationService.validateTestForSubmission,
    validateAnswers: PreselectionValidationService.validateAnswers,
    validateAnswerOption: PreselectionValidationService.validateAnswerOption,
    getJob: PreselectionRepository.getJob,
    getTestByJobId: PreselectionRepository.getTestByJobId,
    getTestById: PreselectionRepository.getTestById,
    getResult: PreselectionRepository.getResult,
    getTestResultsByJob: PreselectionRepository.getTestResultsByJob,
    upsertTest: PreselectionRepository.upsertTest,
    createResult: PreselectionRepository.createResult,
  };

  static async createOrUpdateTest(params: {
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
    questions: Array<{ question: string; options: string[]; answer: string }>;
    passingScore?: number;
    isActive?: boolean;
  }) {
    const validationDeps = {
      validateAdminAccess: this.dependencies.validateAdminAccess,
      validateJobOwnership: (jobId: string | number, requesterId: number) => 
        PreselectionValidationService.validateJobOwnership(jobId, requesterId, this.dependencies.getJob),
      validateQuestions: this.dependencies.validateQuestions,
      validatePassingScore: this.dependencies.validatePassingScore,
      upsertTest: this.dependencies.upsertTest,
    };

    return PreselectionTestService.createOrUpdateTest(params, validationDeps);
  }

  static async getTestForJob(jobId: string | number, requesterRole?: UserRole) {
    const testDeps = {
      getTestByJobId: this.dependencies.getTestByJobId,
    };

    return PreselectionTestService.getTestForJob(jobId, requesterRole, testDeps);
  }

  static async submitAnswers(params: {
    applicantId: number;
    pathApplicantId: number;
    testId: number;
    requesterRole: UserRole;
    answers: Array<{ questionId: number; selected: string }>;
  }) {
    const resultDeps = {
      validateSubmissionAccess: this.dependencies.validateSubmissionAccess,
      getTestById: this.dependencies.getTestById,
      validateTestForSubmission: this.dependencies.validateTestForSubmission,
      getResult: this.dependencies.getResult,
      validateAnswers: this.dependencies.validateAnswers,
      validateAnswerOption: this.dependencies.validateAnswerOption,
      createResult: this.dependencies.createResult,
    };

    return PreselectionResultService.submitAnswers(params, resultDeps);
  }

  static async getJobResults(params: { jobId: string | number; requesterId: number; requesterRole: UserRole }) {
    const resultDeps = {
      validateAdminAccess: this.dependencies.validateAdminAccess,
      validateJobOwnership: (jobId: string | number, requesterId: number) => 
        PreselectionValidationService.validateJobOwnership(jobId, requesterId, this.dependencies.getJob),
      getTestResultsByJob: this.dependencies.getTestResultsByJob,
    };

    return PreselectionResultService.getJobResults(params, resultDeps);
  }

  static async statusForUser(params: { jobId: string | number; userId: number }) {
    const testDeps = {
      getTestByJobId: this.dependencies.getTestByJobId,
      getResult: this.dependencies.getResult,
    };

    return PreselectionTestService.statusForUser(params, testDeps);
  }
}
