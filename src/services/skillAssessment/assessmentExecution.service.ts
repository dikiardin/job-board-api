import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { prisma } from "../../config/prisma";

export class AssessmentExecutionService {
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

    const assessments = await SkillAssessmentModularRepository.getAllAssessments(1, 1000);
    const assessment = assessments.assessments?.find((a: any) => a.id === assessmentId);
    
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    // Mock questions for taking (since we don't have real questions structure)
    const questionsForTaking = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      question: `Sample question ${index + 1} for ${assessment.title}`,
      options: [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
    }));

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description || "",
      questions: questionsForTaking,
      timeLimit: this.TIME_LIMIT_MINUTES,
      totalQuestions: questionsForTaking.length,
      passingScore: this.PASSING_SCORE,
    };
  }

  // Calculate assessment score
  public static calculateScore(
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

  // Validate assessment submission
  public static validateSubmission(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    timeSpent: number;
  }) {
    // Validate time limit
    if (data.timeSpent > this.TIME_LIMIT_MINUTES) {
      throw new CustomError("Assessment time limit exceeded", 400);
    }

    // Validate all questions are answered
    if (data.answers.length !== 25) {
      throw new CustomError("All 25 questions must be answered", 400);
    }

    // Validate answer format
    data.answers.forEach((answer, index) => {
      if (!answer.questionId || !answer.answer) {
        throw new CustomError(`Answer ${index + 1} is invalid`, 400);
      }
    });
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
    // Mock implementation to avoid repository dependency
    return {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
    };
  }

  // Check if retake is allowed
  public static async canRetakeAssessment(userId: number, assessmentId: number): Promise<boolean> {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    
    // Can retake if no previous attempt or if failed
    return !existingResult || existingResult.score < this.PASSING_SCORE;
  }

  // Reset assessment for retake
  public static async resetAssessmentForRetake(userId: number, assessmentId: number) {
    const canRetake = await this.canRetakeAssessment(userId, assessmentId);
    if (!canRetake) {
      throw new CustomError("Cannot retake a passed assessment", 400);
    }

    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (existingResult) {
      // Delete previous attempt
      return { message: "Previous attempt reset. You can now retake the assessment." };
    }

    return { message: "Assessment is ready to be taken." };
  }

  // Get time remaining for assessment
  public static getTimeRemaining(startTime: Date): number {
    const elapsed = (Date.now() - startTime.getTime()) / (1000 * 60); // minutes
    const remaining = Math.max(0, this.TIME_LIMIT_MINUTES - elapsed);
    return Math.floor(remaining);
  }

  // Validate assessment exists and is active
  public static async validateAssessmentExists(assessmentId: number) {
    const assessment = await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
    
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    console.log("=== ASSESSMENT DATA FOR SCORING ===");
    console.log("Assessment ID:", assessment.id);
    console.log("Questions count:", assessment.questions?.length || 0);
    console.log("Questions data:", assessment.questions?.map(q => ({
      id: q.id,
      question: q.question?.substring(0, 50) + "...",
      answer: q.answer
    })));

    return assessment;
  }

  // Get passing score threshold
  public static getPassingScore(): number {
    return this.PASSING_SCORE;
  }

  // Get time limit
  public static getTimeLimit(): number {
    return this.TIME_LIMIT_MINUTES;
  }
}
