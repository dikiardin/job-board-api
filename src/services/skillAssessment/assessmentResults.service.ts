import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { SkillAssessmentResultsRepository } from "../../repositories/skillAssessment/skillAssessmentResults.repository";
import { CustomError } from "../../utils/customError";
import {
  getAssessmentFeedback,
  calculateScoreBreakdown,
  getPassingScore,
  isPassingScore,
} from "./assessmentFeedback.helper";

export class AssessmentResultsService {
  // Get user's assessment results
  public static async getUserResults(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      // Repository already handles pagination
      const result = await SkillAssessmentResultsRepository.getUserResults(
        userId,
        page,
        limit
      );
      return result;
    } catch (error) {
      console.error("Error getting user results:", error);
      throw new CustomError("Failed to retrieve assessment results", 500);
    }
  }

  // Get specific assessment result
  public static async getAssessmentResult(
    userId: number,
    assessmentId: number
  ) {
    const result = await SkillAssessmentModularRepository.getUserResult(
      userId,
      assessmentId
    );
    if (!result) {
      throw new CustomError("Assessment result not found", 404);
    }
    return result;
  }

  // Get assessment statistics
  public static async getAssessmentStatistics(
    assessmentId: number,
    createdBy: number
  ) {
    // Get assessment results
    return await SkillAssessmentModularRepository.getAssessmentResults(
      assessmentId,
      createdBy
    );
  }

  public static async getAssessmentSummary(
    assessmentId: number,
    createdBy: number
  ) {
    const stats = await SkillAssessmentModularRepository.getAssessmentResults(
      assessmentId,
      createdBy
    );

    // Handle null/empty stats
    if (!stats || !Array.isArray(stats) || stats.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0,
      };
    }

    return {
      totalAttempts: stats.length,
      averageScore:
        stats.reduce(
          (sum: number, result: any) => sum + (result.score || 0),
          0
        ) / stats.length,
      passRate:
        (stats.filter((result: any) => result.isPassed).length / stats.length) *
        100,
    };
  }

  // Reset assessment for retake
  public static async resetAssessment(userId: number, assessmentId: number) {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(
      userId,
      assessmentId
    );
    if (existingResult && existingResult.isPassed) {
      throw new CustomError("Cannot retake a passed assessment", 400);
    }

    return { message: "Assessment reset successfully. You can now retake it." };
  }

  // Check if user can retake assessment
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

  // Get assessment completion certificate info
  public static async getCertificateInfo(userId: number, assessmentId: number) {
    const result = await this.getAssessmentResult(userId, assessmentId);

    if (!result) {
      throw new CustomError("Assessment result not found", 404);
    }

    if (!result.isPassed) {
      throw new CustomError(
        "Certificate only available for passed assessments",
        400
      );
    }

    return {
      certificateCode: result.certificateCode,
      certificateUrl: result.certificateUrl,
      issuedAt: result.createdAt,
      score: result.score,
    };
  }
}

// Re-export helper functions for backward compatibility
export {
  getAssessmentFeedback,
  calculateScoreBreakdown,
  getPassingScore,
  isPassingScore,
};
