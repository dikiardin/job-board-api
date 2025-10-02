import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CertificateService } from "./certificate.service";
import { BadgeService } from "./badge.service";
import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { prisma } from "../../config/prisma";

export class SkillAssessmentService {
  // Create assessment (Developer only)
  public static async createAssessment(data: {
    title: string;
    description?: string;
    badgeTemplateId?: number;
    createdBy: number;
    userRole: UserRole;
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
    }>;
  }) {
    // Validate developer role
    if (data.userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can create assessments", 403);
    }

    // Validate questions if provided
    if (data.questions.length > 0) {
      // Validate each question
      data.questions.forEach((q, index) => {
        if (!q.question || q.options.length !== 4 || !q.answer) {
          throw new CustomError(`Question ${index + 1} is invalid`, 400);
        }
        if (!q.options.includes(q.answer)) {
          throw new CustomError(`Question ${index + 1} answer must be one of the options`, 400);
        }
      });
    }

    return await SkillAssessmentModularRepository.createAssessment(data);
  }

  // Get all assessments for discovery
  public static async getAssessments(page: number = 1, limit: number = 10) {
    return await SkillAssessmentModularRepository.getAllAssessments(page, limit);
  }

  // Get assessment for taking (hide answers)
  public static async getAssessmentForUser(assessmentId: number, userId: number) {
    // Check if user already took this assessment
    const existingResult = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (existingResult) {
      throw new CustomError("You have already taken this assessment", 400);
    }

    const assessment = await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    return assessment;
  }

  // Submit assessment answers
  public static async submitAssessment(data: {
    userId: number;
    assessmentId: number;
    startedAt: string;
    answers: Array<{ questionId: number; selectedAnswer: string }>;
  }) {
    try {
    // Check if user already took this assessment
    const existingResult = await SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
    if (existingResult) {
      throw new CustomError("You have already taken this assessment", 400);
    }

    // Get assessment with correct answers
    const assessment = await SkillAssessmentModularRepository.getAssessmentById(data.assessmentId);
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    // Get start and finish times
    const startedAt = new Date(data.startedAt);
    const finishedAt = new Date();
    
    // Validate 30-minute time limit
    const timeDiff = finishedAt.getTime() - startedAt.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff > 32) {
      throw new CustomError(`Assessment submission time exceeded maximum allowed duration of 30 minutes. Time taken: ${Math.round(minutesDiff * 100) / 100} minutes`, 400);
    }

    // Basic answer validation - just check for valid structure
    const totalQuestions = assessment.questions.length;
    
    // Allow any number of answers (0 to totalQuestions)
    if (data.answers.length > totalQuestions) {
      throw new CustomError(`Too many answers provided. Expected max ${totalQuestions}, got ${data.answers.length}`, 400);
    }

    // Calculate score
    let correctAnswers = 0;
    const questionMap = new Map(assessment.questions.map((q: any) => [q.id, q.answer]));

    for (const answer of data.answers) {
      const correctAnswer = questionMap.get(answer.questionId);
      if (correctAnswer === answer.selectedAnswer) {
        correctAnswers++;
      }
    }

    // Convert to 100-point scale
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= 75; // 75% passing grade

    let certificateUrl: string | undefined;
    let certificateCode: string | undefined;

    // Generate certificate if passed
    if (isPassed) {
      const user = await this.getUserInfo(data.userId);
      const certificateData: any = {
        userName: user.name,
        userEmail: user.email,
        assessmentTitle: assessment.title,
        score,
        totalQuestions: totalQuestions,
        completedAt: finishedAt,
        userId: data.userId,
      };
      
      if (assessment.description) {
        certificateData.assessmentDescription = assessment.description;
      }
      
      // Add badge icon if assessment has badge template
      if (assessment.badgeTemplate && assessment.badgeTemplate.icon) {
        certificateData.badgeIcon = assessment.badgeTemplate.icon;
      }
      
      const certificate = await CertificateService.generateCertificate(certificateData);
      
      certificateUrl = certificate.certificateUrl;
      certificateCode = certificate.certificateCode;
    }

    // Create result record
    const resultData: any = {
      userId: data.userId,
      assessmentId: data.assessmentId,
      score,
      isPassed,
      startedAt,
      finishedAt,
    };

    if (certificateUrl) resultData.certificateUrl = certificateUrl;
    const result = await SkillAssessmentModularRepository.saveAssessmentResult(resultData);

    // Award badge if passed
    if (isPassed) {
      try {
        await BadgeService.awardBadgeFromAssessment(data.userId, data.assessmentId, correctAnswers, totalQuestions);
        await BadgeService.checkMilestoneBadges(data.userId);
      } catch (error) {
        // Badge awarding failed, but assessment submission should still succeed
      }
    }

    return {
      ...result,
      percentage: score, // Score is already in 100-point scale
    };
    } catch (error) {
      throw error;
    }
  }

  // Get user's assessment results
  public static async getUserResults(userId: number) {
    return await SkillAssessmentModularRepository.getUserResults(userId);
  }

  // Get developer's assessments
  public static async getDeveloperAssessments(userId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can view their assessments", 403);
    }

    return await SkillAssessmentModularRepository.getDeveloperAssessments(userId);
  }

  // Get single assessment by ID for developer (includes questions)
  public static async getAssessmentByIdForDeveloper(assessmentId: number, userId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can view assessment details", 403);
    }

    const assessment = await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
    
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    // Check if developer owns this assessment
    if (assessment.createdBy !== userId) {
      throw new CustomError("You can only view your own assessments", 403);
    }

    return assessment;
  }

  // Get assessment results (Developer only)
  public static async getAssessmentResults(assessmentId: number, userId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can view assessment results", 403);
    }

    return await SkillAssessmentModularRepository.getAssessmentResults(assessmentId);
  }

  // Verify certificate
  public static async verifyCertificate(certificateCode: string) {
    const result = await SkillAssessmentModularRepository.verifyCertificate(certificateCode);
    if (!result) {
      throw new CustomError("Certificate not found", 404);
    }

    return {
      isValid: true,
      certificate: result,
      verificationUrl: CertificateService.generateQRCodeData(certificateCode),
    };
  }

  // Update assessment (Developer only)
  public static async updateAssessment(
    assessmentId: number,
    userId: number,
    userRole: UserRole,
    data: { 
      title?: string; 
      description?: string; 
      badgeTemplateId?: number | null;
      questions?: Array<{
        question: string;
        options: string[];
        answer: string;
      }>;
    }
  ) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can update assessments", 403);
    }

    // Validate questions if provided
    if (data.questions) {
      if (data.questions.length < 1) {
        throw new CustomError("Assessment must have at least 1 question", 400);
      }

      // Validate each question
      data.questions.forEach((q, index) => {
        if (!q.question || q.options.length !== 4 || !q.answer) {
          throw new CustomError(`Question ${index + 1} is invalid`, 400);
        }
        if (!q.options.includes(q.answer)) {
          throw new CustomError(`Question ${index + 1} answer must be one of the options`, 400);
        }
      });
    }

    const updated = await SkillAssessmentModularRepository.updateAssessment(assessmentId, userId, data);
    if (!updated) {
      throw new CustomError("Assessment not found or you don't have permission", 404);
    }

    return { message: "Assessment updated successfully" };
  }

  // Save individual question (Developer only)
  public static async saveQuestion(data: {
    assessmentId: number;
    question: string;
    options: string[];
    answer: string;
    userId: number;
    userRole: UserRole;
  }) {
    if (data.userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can save questions", 403);
    }

    // Validate question data
    if (!data.question.trim()) {
      throw new CustomError("Question text is required", 400);
    }

    if (data.options.length !== 4) {
      throw new CustomError("Exactly 4 options are required", 400);
    }

    if (data.options.some(opt => !opt.trim())) {
      throw new CustomError("All options must be filled", 400);
    }

    if (!data.answer.trim()) {
      throw new CustomError("Correct answer is required", 400);
    }

    if (!data.options.includes(data.answer)) {
      throw new CustomError("Answer must match one of the options", 400);
    }

    // Check if assessment exists and belongs to the developer
    const assessment = await SkillAssessmentModularRepository.getAssessmentByIdForDeveloper(
      data.assessmentId, 
      data.userId
    );

    if (!assessment) {
      throw new CustomError("Assessment not found or you don't have permission", 404);
    }

    // Save the question
    const savedQuestion = await SkillAssessmentModularRepository.saveQuestion({
      assessmentId: data.assessmentId,
      question: data.question,
      options: data.options,
      answer: data.answer
    });

    return savedQuestion;
  }

  // Delete assessment (Developer only)
  public static async deleteAssessment(assessmentId: number, userId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can delete assessments", 403);
    }

    const deleted = await SkillAssessmentModularRepository.deleteAssessment(assessmentId, userId);
    if (!deleted) {
      throw new CustomError("Assessment not found or you don't have permission", 404);
    }

    return { message: "Assessment deleted successfully" };
  }

  // Download certificate (User only)
  public static async downloadCertificate(resultId: number, userId: number) {
    // Get result by ID and verify ownership
    const result = await prisma.skillResult.findFirst({
      where: { 
        id: resultId,
        userId: userId // Verify the result belongs to this user
      },
      include: {
        assessment: {
          select: { id: true, title: true },
        },
      },
    });
    
    if (!result) {
      throw new CustomError("Certificate not found or you don't have permission", 404);
    }

    if (!result.certificateUrl) {
      throw new CustomError("Certificate not available for this result", 400);
    }

    return {
      certificateUrl: result.certificateUrl,
      certificateCode: result.certificateCode,
      assessment: result.assessment,
    };
  }

  // Helper method to get user info
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

  // Get assessment for taking (User with subscription)
  public static async getAssessmentForTaking(assessmentId: number, userId: number) {
    return await this.getAssessmentForUser(assessmentId, userId);
  }

  // Get user certificates
  public static async getUserCertificates(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const results = await prisma.skillResult.findMany({
      where: {
        userId,
        isPassed: true,
        certificateUrl: { not: null },
      },
      skip,
      take: limit,
      include: {
        assessment: {
          select: { id: true, title: true, description: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.skillResult.count({
      where: {
        userId,
        isPassed: true,
        certificateUrl: { not: null },
      },
    });

    return {
      certificates: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Share certificate to social media
  public static async shareCertificate(code: string, platform: string, userId: number) {
    const result = await this.verifyCertificate(code);
    
    const shareUrl = `${process.env.FRONTEND_URL}/verify-certificate/${code}`;
    const shareText = `I just earned a certificate with a score of ${result.certificate.score}%! 🎓`;

    const shareLinks = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };

    if (!shareLinks[platform as keyof typeof shareLinks]) {
      throw new CustomError("Unsupported social media platform", 400);
    }

    return {
      shareUrl: shareLinks[platform as keyof typeof shareLinks],
      platform,
      certificateUrl: shareUrl,
    };
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(assessmentId: number, limit: number = 10) {
    return await SkillAssessmentModularRepository.getAssessmentLeaderboard(assessmentId, limit);
  }

  // Get assessment statistics
  public static async getAssessmentStats(assessmentId: number) {
    return await SkillAssessmentModularRepository.getAssessmentStatistics(assessmentId);
  }
}
