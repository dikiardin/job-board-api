import { AssessmentExecutionQueryService } from "./assessmentExecutionQuery.service";
import { AssessmentExecutionValidationService } from "./assessmentExecutionValidation.service";
import { AssessmentExecutionScoringService } from "./assessmentExecutionScoring.service";
import { AssessmentExecutionRetakeService } from "./assessmentExecutionRetake.service";

export class AssessmentExecutionService {
  // Get assessment for taking (hide answers, subscription required)
  public static async getAssessmentForTaking(
    assessmentId: number,
    userId: number
  ) {
    return AssessmentExecutionQueryService.getAssessmentForTaking(
      assessmentId,
      userId
    );
  }

  // Calculate assessment score
  public static calculateScore(
    questions: Array<{ id: number; answer: string }>,
    userAnswers: Array<{ questionId: number; answer: string }>
  ) {
    return AssessmentExecutionScoringService.calculateScore(
      questions,
      userAnswers
    );
  }

  // Check user subscription status
  public static async checkUserSubscription(userId: number): Promise<boolean> {
    return AssessmentExecutionQueryService.checkUserSubscription(userId);
  }

  // Get user information
  public static async getUserInfo(userId: number) {
    return AssessmentExecutionQueryService.getUserInfo(userId);
  }

  // Validate assessment submission
  public static validateSubmission(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    timeSpent: number;
  }) {
    return AssessmentExecutionValidationService.validateSubmission(data);
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit: number = 10
  ) {
    return AssessmentExecutionQueryService.getAssessmentLeaderboard(
      assessmentId,
      limit
    );
  }

  // Get assessment statistics for users
  public static async getAssessmentStats(assessmentId: number) {
    return AssessmentExecutionQueryService.getAssessmentStats(assessmentId);
  }

  // Check if retake is allowed
  public static async canRetakeAssessment(
    userId: number,
    assessmentId: number
  ): Promise<boolean> {
    return AssessmentExecutionRetakeService.canRetakeAssessment(
      userId,
      assessmentId
    );
  }

  // Reset assessment for retake
  public static async resetAssessmentForRetake(
    userId: number,
    assessmentId: number
  ) {
    return AssessmentExecutionRetakeService.resetAssessmentForRetake(
      userId,
      assessmentId
    );
  }

  // Get time remaining for assessment
  public static getTimeRemaining(startTime: Date): number {
    return AssessmentExecutionValidationService.getTimeRemaining(startTime);
  }

  // Validate assessment exists and is active
  public static async validateAssessmentExists(assessmentId: number) {
    return AssessmentExecutionQueryService.validateAssessmentExists(
      assessmentId
    );
  }

  // Get passing score threshold
  public static getPassingScore(assessmentPassScore?: number): number {
    return AssessmentExecutionScoringService.getPassingScore(
      assessmentPassScore
    );
  }

  // Get time limit
  public static getTimeLimit(): number {
    return AssessmentExecutionValidationService.getTimeLimit();
  }
}
