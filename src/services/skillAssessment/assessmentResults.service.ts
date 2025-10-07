import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { SkillAssessmentResultsRepository } from "../../repositories/skillAssessment/skillAssessmentResults.repository";
import { CustomError } from "../../utils/customError";

export class AssessmentResultsService {
  private static readonly PASSING_SCORE = 75;

  // Get user's assessment results
  public static async getUserResults(userId: number, page: number = 1, limit: number = 10) {
    try {
      // Repository already handles pagination
      const result = await SkillAssessmentResultsRepository.getUserResults(userId, page, limit);
      return result;
    } catch (error) {
      console.error("Error getting user results:", error);
      throw new CustomError("Failed to retrieve assessment results", 500);
    }
  }

  // Get specific assessment result
  public static async getAssessmentResult(userId: number, assessmentId: number) {
    const result = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (!result) {
      throw new CustomError("Assessment result not found", 404);
    }
    return result;
  }

  // Get assessment statistics
  public static async getAssessmentStatistics(assessmentId: number, createdBy: number) {
    // Get assessment results
    return await SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
  }

  public static async getAssessmentSummary(assessmentId: number, createdBy: number) {
    const stats = await SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
    
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
      averageScore: stats.reduce((sum: number, result: any) => sum + (result.score || 0), 0) / stats.length,
      passRate: (stats.filter((result: any) => (result.score || 0) >= this.PASSING_SCORE).length / stats.length) * 100,
    };
  }

  // Reset assessment for retake
  public static async resetAssessment(userId: number, assessmentId: number) {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (existingResult && existingResult.score >= this.PASSING_SCORE) {
      throw new CustomError("Cannot retake a passed assessment", 400);
    }

    // Mock delete previous attempt
    if (existingResult) {
      // await SkillAssessmentModularRepository.deleteAssessmentResult(existingResult.id);
    }

    return { message: "Assessment reset successfully. You can now retake it." };
  }

  // Check if user can retake assessment
  public static async canRetakeAssessment(userId: number, assessmentId: number): Promise<boolean> {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    
    // Can retake if no previous attempt or if failed
    return !existingResult || existingResult.score < this.PASSING_SCORE;
  }

  // Get user's assessment history
  public static async getUserAssessmentHistory(userId: number) {
    // Mock implementation
    return {
      totalAssessments: 0,
      passedAssessments: 0,
      failedAssessments: 0,
      averageScore: 0,
      recentResults: [],
    };
  }

  // Get assessment performance analytics
  public static async getPerformanceAnalytics(userId: number) {
    // Mock analytics
    return {
      totalAttempts: 0,
      passRate: 0,
      averageScore: 0,
      strongAreas: [],
      improvementAreas: [],
      monthlyProgress: [],
    };
  }

  // Get assessment completion certificate info
  public static async getCertificateInfo(userId: number, assessmentId: number) {
    const result = await this.getAssessmentResult(userId, assessmentId);
    
    if (!result) {
      throw new CustomError("Assessment result not found", 404);
    }
    
    if (result.score < this.PASSING_SCORE) {
      throw new CustomError("Certificate only available for passed assessments", 400);
    }

    return {
      certificateCode: result.certificateCode,
      certificateUrl: result.certificateUrl,
      issuedAt: result.createdAt,
      score: result.score,
    };
  }

  // Get assessment feedback
  public static getAssessmentFeedback(score: number, correctAnswers: number, totalQuestions: number) {
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    let feedback = {
      overall: "",
      strengths: [] as string[],
      improvements: [] as string[],
      nextSteps: [] as string[],
    };

    if (score >= 95) {
      feedback.overall = "Exceptional performance! You have mastered this skill area.";
      feedback.strengths = ["Outstanding knowledge", "Excellent problem-solving", "Strong fundamentals"];
      feedback.nextSteps = ["Consider advanced topics", "Mentor others", "Take leadership roles"];
    } else if (score >= 85) {
      feedback.overall = "Great job! You have strong knowledge in this area.";
      feedback.strengths = ["Good understanding", "Solid foundation", "Above average performance"];
      feedback.improvements = ["Review missed concepts", "Practice edge cases"];
      feedback.nextSteps = ["Explore advanced topics", "Apply knowledge in projects"];
    } else if (score >= 75) {
      feedback.overall = "Well done! You've successfully passed this assessment.";
      feedback.strengths = ["Basic understanding achieved", "Met minimum requirements"];
      feedback.improvements = ["Strengthen weak areas", "Practice more problems"];
      feedback.nextSteps = ["Continue practicing", "Review study materials"];
    } else {
      feedback.overall = "Keep practicing! You can retake this assessment when ready.";
      feedback.improvements = ["Review fundamental concepts", "Practice basic problems", "Study recommended materials"];
      feedback.nextSteps = ["Take preparatory courses", "Practice with easier problems", "Retake when confident"];
    }

    return feedback;
  }

  // Calculate detailed score breakdown
  public static calculateScoreBreakdown(
    answers: Array<{ questionId: number; answer: string; isCorrect: boolean; topic?: string }>
  ) {
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Group by topic if available
    const topicBreakdown = answers.reduce((acc, answer) => {
      const topic = answer.topic || "General";
      if (!acc[topic]) {
        acc[topic] = { correct: 0, total: 0 };
      }
      acc[topic].total++;
      if (answer.isCorrect) {
        acc[topic].correct++;
      }
      return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    return {
      overallScore: score,
      correctAnswers,
      totalQuestions,
      accuracy: (correctAnswers / totalQuestions) * 100,
      topicBreakdown: Object.entries(topicBreakdown).map(([topic, stats]) => ({
        topic,
        correct: stats.correct,
        total: stats.total,
        percentage: (stats.correct / stats.total) * 100,
      })),
    };
  }

  // Get passing score threshold
  public static getPassingScore(): number {
    return this.PASSING_SCORE;
  }

  // Check if score is passing
  public static isPassingScore(score: number): boolean {
    return score >= this.PASSING_SCORE;
  }
}
