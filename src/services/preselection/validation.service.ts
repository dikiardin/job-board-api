import { UserRole } from "../../generated/prisma";

export class PreselectionValidationService {
  static validateAdminAccess(requesterRole: UserRole): void {
    if (requesterRole !== UserRole.ADMIN) {
      throw { status: 401, message: "Only company admin can create tests" };
    }
  }

  static async validateJobOwnership(jobId: string | number, requesterId: number, getJob: (jobId: string | number) => Promise<any>): Promise<void> {
    const job = await getJob(jobId);
    if (!job) throw { status: 404, message: "Job not found" };
    if (!(job as any).company || (job as any).company?.ownerAdminId !== requesterId) {
      throw { status: 403, message: "You don't own this job" };
    }
  }

  static validateQuestions(questions: Array<{ question: string; options: string[]; answer: string }>): void {
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

  static validateQuestion(q: { question: string; options: string[]; answer: string }, questionNumber: number): void {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
      throw { status: 400, message: `Question #${questionNumber} must have text and exactly 4 options` };
    }
    if (typeof q.answer !== "string" || !q.options.includes(q.answer)) {
      throw { status: 400, message: `Question #${questionNumber} answer must match one of the options` };
    }
  }

  static validatePassingScore(passingScore: number | undefined, questionCount: number): void {
    if (passingScore !== undefined) {
      if (passingScore < 0 || passingScore > questionCount) {
        throw { status: 400, message: "Invalid passingScore" };
      }
    }
  }

  static validateSubmissionAccess(requesterRole: UserRole, applicantId: number, pathApplicantId: number): void {
    if (requesterRole !== UserRole.USER) throw { status: 401, message: "Only applicant can submit" };
    if (applicantId !== pathApplicantId) throw { status: 403, message: "Cannot submit for another user" };
  }

  static validateTestForSubmission(test: any): void {
    if (!test) throw { status: 404, message: "Test not found" };
    if (!test.isActive) throw { status: 400, message: "Test is not active" };
  }

  static validateAnswers(answers: Array<{ questionId: number; selected: string }>, testQuestions: any[]): void {
    if (!Array.isArray(answers) || answers.length === 0) throw { status: 400, message: "Answers are required" };
    if (answers.length !== testQuestions.length) {
      throw { status: 400, message: "All questions must be answered" };
    }
  }

  static validateAnswerOption(selected: string, options: string[], questionId: number): void {
    if (!options.includes(selected)) throw { status: 400, message: `Selected answer is not a valid option for question ${questionId}` };
  }
}
