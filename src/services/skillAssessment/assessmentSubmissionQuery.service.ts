import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { ScoringCalculationService } from "./scoringCalculation.service";

export class AssessmentSubmissionQueryService {
  public static async getUserAssessmentAttempts(
    userId: number,
    assessmentId: number
  ) {
    return await SkillAssessmentModularRepository.getUserAssessmentAttempts(
      userId,
      assessmentId
    );
  }

  public static async getUserResults(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    return {
      results: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  // Check if assessment exists
  public static async checkAssessmentExists(
    assessmentId: number
  ): Promise<boolean> {
    try {
      const assessment =
        await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
      return !!assessment;
    } catch (error) {
      return false;
    }
  }

  // Get assessment for taking (without answers)
  public static async getAssessmentForTaking(assessmentId: number) {
    try {
      const assessment =
        await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new CustomError("Assessment not found", 404);
      }

      // Return assessment without answers for security
      return {
        id: assessment.id,
        slug: (assessment as any).slug,
        title: assessment.title,
        description: assessment.description,
        passScore: assessment.passScore,
        questions:
          assessment.questions?.map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            // Don't include the correct answer
          })) || [],
        badgeTemplate: assessment.badgeTemplate,
        creator: assessment.creator,
      };
    } catch (error) {
      throw error;
    }
  }

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

    // Get assessment to check current pass score
    const assessment = await SkillAssessmentModularRepository.getAssessmentById(
      assessmentId
    );
    if (assessment) {
      // Recalculate isPassed based on current pass score
      const isPassed = this.isAssessmentPassed(
        result.score,
        assessment.passScore
      );

      // Update result with recalculated pass status
      result.isPassed = isPassed;
    }

    return result;
  }

  public static async getAllAssessmentResults(
    assessmentId: number,
    createdBy: number
  ) {
    // Get real results from database
    const results = await SkillAssessmentModularRepository.getAssessmentResults(
      assessmentId,
      createdBy
    );

    // Handle null results
    if (!results || !Array.isArray(results)) {
      return {
        results: [],
        summary: {
          totalAttempts: 0,
          passedCount: 0,
          averageScore: 0,
          passRate: 0,
        },
      };
    }

    // Get assessment to check pass score
    const assessment = await SkillAssessmentModularRepository.getAssessmentById(
      assessmentId
    );
    const passScore = assessment?.passScore || 75;

    // Calculate summary statistics with dynamic pass score
    const totalAttempts = results.length;
    const passedCount = results.filter((r: any) =>
      this.isAssessmentPassed(r.score, passScore)
    ).length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            results.reduce((sum: number, r: any) => sum + (r.score || 0), 0) /
              totalAttempts
          )
        : 0;
    const passRate =
      totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

    return {
      results,
      summary: {
        totalAttempts,
        averageScore,
        passRate,
        completionRate: 100, // All submitted results are complete
      },
      assessment: {
        id: assessmentId,
        title: "Assessment Results",
        totalQuestions: 25,
      },
    };
  }

  public static isAssessmentPassed(score: number, passScore?: number): boolean {
    return ScoringCalculationService.isPassed(score, passScore);
  }
}
