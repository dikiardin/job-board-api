import { AssessmentSubmissionCoreService } from "./assessmentSubmissionCore.service";
import { AssessmentSubmissionQueryService } from "./assessmentSubmissionQuery.service";

export class AssessmentSubmissionService {
  public static async submitAssessment(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    startedAt: string;
  }) {
    return AssessmentSubmissionCoreService.submitAssessment(data);
  }

  public static async getUserAssessmentAttempts(
    userId: number,
    assessmentId: number
  ) {
    return AssessmentSubmissionQueryService.getUserAssessmentAttempts(
      userId,
      assessmentId
    );
  }

  public static async getUserResults(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    return AssessmentSubmissionQueryService.getUserResults(userId, page, limit);
  }

  // Check if assessment exists
  public static async checkAssessmentExists(
    assessmentId: number
  ): Promise<boolean> {
    return AssessmentSubmissionQueryService.checkAssessmentExists(assessmentId);
  }

  // Get assessment for taking (without answers)
  public static async getAssessmentForTaking(assessmentId: number) {
    return AssessmentSubmissionQueryService.getAssessmentForTaking(
      assessmentId
    );
  }

  public static async getAssessmentResult(
    userId: number,
    assessmentId: number
  ) {
    return AssessmentSubmissionQueryService.getAssessmentResult(
      userId,
      assessmentId
    );
  }

  public static async getAllAssessmentResults(
    assessmentId: number,
    createdBy: number
  ) {
    return AssessmentSubmissionQueryService.getAllAssessmentResults(
      assessmentId,
      createdBy
    );
  }

  public static isAssessmentPassed(score: number, passScore?: number): boolean {
    return AssessmentSubmissionQueryService.isAssessmentPassed(
      score,
      passScore
    );
  }
}
