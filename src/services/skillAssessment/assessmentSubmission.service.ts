import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { CertificateService } from "./certificate.service";
import { BadgeManagementService } from "./badgeManagement.service";
import { AssessmentExecutionService } from "./assessmentExecution.service";
import { AssessmentScoringService } from "./assessmentScoring.service";

export class AssessmentSubmissionService {
  private static readonly PASSING_SCORE = 75;

  // Submit assessment answers
  public static async submitAssessment(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    timeSpent: number;
  }) {
    // Validate submission
    AssessmentExecutionService.validateSubmission(data);

    // Check if user already completed this assessment
    const existingResult = await SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
    if (existingResult) {
      throw new CustomError("You have already completed this assessment", 400);
    }

    // Get assessment with correct answers
    const assessment = await AssessmentExecutionService.validateAssessmentExists(data.assessmentId);

    // Calculate score
    const { score, correctAnswers, totalQuestions } = AssessmentExecutionService.calculateScore(
      assessment.questions,
      data.answers
    );

    // Save result
    const result = await this.saveAssessmentResult({
      userId: data.userId,
      assessmentId: data.assessmentId,
      score,
    });

    // Check if passed (75% or higher)
    const isPassed = score >= this.PASSING_SCORE;
    let certificateData = null;
    let badgeData = null;

    // Generate certificate and badge if passed
    if (isPassed) {
      const user = await AssessmentExecutionService.getUserInfo(data.userId);
      
      // Generate certificate
      certificateData = await CertificateService.generateCertificate({
        userName: user.name || 'User',
        userEmail: user.email,
        assessmentTitle: assessment.title,
        assessmentDescription: assessment.description || '',
        score,
        totalQuestions,
        completedAt: new Date(),
        userId: data.userId,
      });

      // Generate badge if badge template exists
      if (assessment.badgeTemplateId) {
        badgeData = await this.awardBadge({
          userId: data.userId,
          badgeTemplateId: assessment.badgeTemplateId,
          assessmentId: data.assessmentId,
          score,
        });
      }
    }

    return {
      result: {
        id: result.id,
        score,
        correctAnswers,
        totalQuestions,
        passed: isPassed,
        timeSpent: data.timeSpent,
        completedAt: result.createdAt,
      },
      certificate: certificateData,
      badge: badgeData,
    };
  }

  // Save assessment result to database
  private static async saveAssessmentResult(data: {
    userId: number;
    assessmentId: number;
    score: number;
  }) {
    // Use the actual repository
    return await SkillAssessmentModularRepository.saveAssessmentResult(data);
  }

  // Award badge to user
  private static async awardBadge(data: {
    userId: number;
    badgeTemplateId: number;
    assessmentId: number;
    score: number;
  }) {
    // This would typically use BadgeService.awardBadge
    // For now, return mock badge
    return {
      id: Date.now(),
      userId: data.userId,
      badgeTemplateId: data.badgeTemplateId,
      assessmentId: data.assessmentId,
      score: data.score,
      earnedAt: new Date(),
    };
  }

  // Get user's assessment results
  public static async getUserResults(userId: number, page: number = 1, limit: number = 10) {
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // This would typically call repository method
    // For now, return mock results
    return {
      results: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Get specific assessment result
  public static async getAssessmentResult(userId: number, assessmentId: number) {
    const result = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (!result) {
      throw new CustomError("Assessment result not found", 404);
    }

    return result;
  }

  // Check if assessment is passed
  public static isAssessmentPassed(score: number): boolean {
    return score >= this.PASSING_SCORE;
  }

  // Get achievement level based on score
  public static getAchievementLevel(score: number): {
    level: string;
    color: string;
    description: string;
  } {
    if (score >= 95) {
      return {
        level: "EXCELLENT",
        color: "#dc2626",
        description: "Outstanding performance! You've mastered this skill.",
      };
    } else if (score >= 85) {
      return {
        level: "VERY GOOD",
        color: "#ea580c",
        description: "Great job! You have strong knowledge in this area.",
      };
    } else if (score >= 75) {
      return {
        level: "GOOD",
        color: "#059669",
        description: "Well done! You've successfully passed this assessment.",
      };
    } else {
      return {
        level: "NEEDS IMPROVEMENT",
        color: "#6b7280",
        description: "Keep practicing! You can retake this assessment.",
      };
    }
  }

  // Calculate time efficiency score
  public static calculateTimeEfficiency(timeSpent: number, timeLimit: number): number {
    const efficiency = ((timeLimit - timeSpent) / timeLimit) * 100;
    return Math.max(0, Math.min(100, efficiency));
  }

  // Get detailed result analysis
  public static getResultAnalysis(data: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
  }) {
    const achievement = this.getAchievementLevel(data.score);
    const timeEfficiency = this.calculateTimeEfficiency(data.timeSpent, 30);
    const accuracy = (data.correctAnswers / data.totalQuestions) * 100;

    return {
      score: data.score,
      accuracy: Math.round(accuracy),
      timeEfficiency: Math.round(timeEfficiency),
      achievement,
      passed: this.isAssessmentPassed(data.score),
      correctAnswers: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      timeSpent: data.timeSpent,
      recommendations: this.getRecommendations(data.score),
    };
  }

  // Get recommendations based on score
  private static getRecommendations(score: number): string[] {
    if (score >= 95) {
      return [
        "Excellent work! Consider taking advanced assessments.",
        "Share your achievement on professional networks.",
        "Mentor others who are learning this skill.",
      ];
    } else if (score >= 85) {
      return [
        "Great performance! Review the areas you missed.",
        "Practice with real-world projects.",
        "Consider taking related skill assessments.",
      ];
    } else if (score >= 75) {
      return [
        "Good job on passing! Focus on strengthening weak areas.",
        "Practice more challenging problems.",
        "Review the questions you got wrong.",
      ];
    } else {
      return [
        "Don't give up! Review the study materials.",
        "Practice with easier problems first.",
        "Consider taking a preparatory course.",
        "You can retake this assessment when ready.",
      ];
    }
  }
}
