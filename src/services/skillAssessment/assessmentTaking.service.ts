import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { CertificateService } from "./certificate.service";
import { BadgeManagementService } from "./badgeManagement.service";
import { prisma } from "../../config/prisma";

export class AssessmentTakingService {
  private static readonly PASSING_SCORE = 75;
  private static readonly TIME_LIMIT_MINUTES = 30;

  // Get assessment for taking (hide answers, subscription required)
  public static async getAssessmentForTaking(assessmentId: number, userId: number) {
    // Check if user has active subscription
    const hasSubscription = await this.checkUserSubscription(userId);
    if (!hasSubscription) {
      throw new CustomError("Active subscription required to take assessments", 403);
    }

    // Check if user already completed this assessment
    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (existingResult) {
      throw new CustomError("You have already completed this assessment", 400);
    }

    // Mock assessment data
    const assessment = {
      id: assessmentId,
      title: "JavaScript Assessment",
      description: "Advanced JavaScript concepts",
      questions: Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        question: `Sample question ${index + 1}`,
        options: ["Option A", "Option B", "Option C", "Option D"]
      }))
    };

    // Remove answers from questions for taking
    const questionsForTaking = assessment.questions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      // Don't include the answer
    }));

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      questions: questionsForTaking,
      timeLimit: this.TIME_LIMIT_MINUTES,
      totalQuestions: questionsForTaking.length,
      passingScore: this.PASSING_SCORE,
    };
  }

  // Submit assessment answers
  public static async submitAssessment(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    timeSpent: number; // in minutes
  }) {
    // Validate time limit
    if (data.timeSpent > this.TIME_LIMIT_MINUTES) {
      throw new CustomError("Assessment time limit exceeded", 400);
    }

    // Check if user already completed this assessment
    const existingResult = await SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
    if (existingResult) {
      throw new CustomError("You have already completed this assessment", 400);
    }

    // Mock assessment with correct answers
    const assessment = {
      id: data.assessmentId,
      title: "JavaScript Assessment",
      description: "Advanced JavaScript concepts",
      badgeTemplateId: 1,
      questions: Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        question: `Sample question ${index + 1}`,
        answer: "Option A", // Mock correct answer
        options: ["Option A", "Option B", "Option C", "Option D"]
      }))
    };

    // Validate all questions are answered
    if (data.answers.length !== 25) {
      throw new CustomError("All 25 questions must be answered", 400);
    }

    // Calculate score
    const { score, correctAnswers, totalQuestions } = this.calculateScore(
      assessment.questions,
      data.answers
    );

    // Mock save result
    const result = {
      id: Date.now(),
      userId: data.userId,
      assessmentId: data.assessmentId,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: data.timeSpent,
      completedAt: new Date(),
    };

    // Check if passed (75% or higher)
    const isPassed = score >= this.PASSING_SCORE;
    let certificateData = null;
    let badgeData = null;

    // Generate certificate and badge if passed
    if (isPassed) {
      const user = await this.getUserInfo(data.userId);
      
      // Generate certificate
      certificateData = await CertificateService.generateCertificate({
        userName: user.name,
        userEmail: user.email,
        assessmentTitle: assessment.title,
        assessmentDescription: assessment.description,
        score,
        totalQuestions,
        completedAt: new Date(),
        userId: data.userId,
      });

      // Generate badge if badge template exists
      if (assessment.badgeTemplateId) {
        badgeData = await BadgeManagementService.awardBadge({
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
        completedAt: result.completedAt,
      },
      certificate: certificateData,
      badge: badgeData,
    };
  }

  // Calculate assessment score
  private static calculateScore(
    questions: Array<{ id: number; answer: string }>,
    userAnswers: Array<{ questionId: number; answer: string }>
  ) {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    // Create map for quick lookup
    const answerMap = new Map(
      userAnswers.map(ua => [ua.questionId, ua.answer])
    );

    // Check each question
    questions.forEach(question => {
      const userAnswer = answerMap.get(question.id);
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    });

    // Calculate percentage score
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      score,
      correctAnswers,
      totalQuestions,
    };
  }

  // Check user subscription status
  private static async checkUserSubscription(userId: number): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        endDate: {
          gte: new Date(),
        },
      },
    });

    return !!subscription;
  }

  // Get user information
  private static async getUserInfo(userId: number) {
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

  // Get user's assessment results
  public static async getUserResults(userId: number, page: number = 1, limit: number = 10) {
    // Mock implementation
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

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(assessmentId: number, limit: number = 10) {
    // Mock implementation
    return {
      leaderboard: [],
      assessmentId,
      limit,
    };
  }

  // Get assessment statistics for users
  public static async getAssessmentStats(assessmentId: number) {
    // Mock implementation
    return {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
      averageTimeSpent: 0,
    };
  }

  // Retake assessment (if allowed)
  public static async retakeAssessment(userId: number, assessmentId: number) {
    // Check if retakes are allowed (business logic)
    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (existingResult && existingResult.score >= this.PASSING_SCORE) {
      throw new CustomError("Cannot retake a passed assessment", 400);
    }

    // Mock delete previous attempt
    return { message: "Assessment reset successfully. You can now retake it." };
  }
}
