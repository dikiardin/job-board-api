import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { prisma } from "../../config/prisma";

export class AssessmentExecutionQueryService {
  private static readonly TIME_LIMIT_MINUTES = 3; // Changed from 30 to 3 minutes to match frontend

  // Get assessment for taking (hide answers, subscription required)
  public static async getAssessmentForTaking(
    assessmentId: number,
    userId: number
  ) {
    // Check if user has active subscription
    const hasSubscription = await this.checkUserSubscription(userId);
    if (!hasSubscription) {
      throw new CustomError(
        "Active subscription required to take assessments",
        403
      );
    }

    // Check if user already completed this assessment
    const existingResult = await SkillAssessmentModularRepository.getUserResult(
      userId,
      assessmentId
    );
    if (existingResult) {
      throw new CustomError("You have already completed this assessment", 400);
    }

    const assessments =
      await SkillAssessmentModularRepository.getAllAssessments(1, 1000);
    const assessment = assessments.assessments?.find(
      (a: any) => a.id === assessmentId
    );

    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    // Mock questions for taking (since we don't have real questions structure)
    const questionsForTaking = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      question: `Sample question ${index + 1} for ${assessment.title}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
    }));

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description || "",
      questions: questionsForTaking,
      timeLimit: this.TIME_LIMIT_MINUTES,
      totalQuestions: questionsForTaking.length,
      passingScore: assessment.passScore,
    };
  }

  // Get user information
  public static async getUserInfo(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return {
      name: user.name,
      email: user.email,
    };
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit: number = 10
  ) {
    // Mock implementation
    return {
      leaderboard: [],
      assessmentId,
      limit,
    };
  }

  // Get assessment statistics for users
  public static async getAssessmentStats(assessmentId: number) {
    // Mock implementation to avoid repository dependency
    return {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
    };
  }

  // Check if retake is allowed
  public static async canRetakeAssessment(
    userId: number,
    assessmentId: number
  ): Promise<boolean> {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(
      userId,
      assessmentId
    );

    // Can retake if no previous attempt or if failed
    return !existingResult || !existingResult.isPassed;
  }

  // Validate assessment exists and is active
  public static async validateAssessmentExists(assessmentId: number) {
    const assessment = await SkillAssessmentModularRepository.getAssessmentById(
      assessmentId
    );

    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    return assessment;
  }

  // Check user subscription status
  public static async checkUserSubscription(userId: number): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return !!subscription;
  }
}
