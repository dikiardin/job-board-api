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

    // Validate 25 questions
    if (data.questions.length !== 25) {
      throw new CustomError("Assessment must have exactly 25 questions", 400);
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
    answers: Array<{ questionId: number; selectedAnswer: string }>;
  }) {
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

    // Set finished time (no time limit validation since we removed startedAt)
    const finishedAt = new Date();

    // Validate all questions answered
    if (data.answers.length !== 25) {
      throw new CustomError("All 25 questions must be answered", 400);
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
    const score = Math.round((correctAnswers / 25) * 100);
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
        totalQuestions: 25,
        completedAt: finishedAt,
        userId: data.userId,
      };
      
      if (assessment.description) {
        certificateData.assessmentDescription = assessment.description;
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
      startedAt: finishedAt, // Use finishedAt as startedAt since we don't track start time
      finishedAt,
    };

    if (certificateUrl) resultData.certificateUrl = certificateUrl;
    if (certificateCode) resultData.certificateCode = certificateCode;

    const result = await SkillAssessmentModularRepository.saveAssessmentResult(resultData);

    // Award badge if passed
    if (isPassed) {
      await BadgeService.awardBadgeFromAssessment(data.userId, data.assessmentId, correctAnswers, 25);
      await BadgeService.checkMilestoneBadges(data.userId);
    }

    return {
      ...result,
      percentage: score, // Score is already in 100-point scale
    };
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
      if (data.questions.length !== 25) {
        throw new CustomError("Assessment must have exactly 25 questions", 400);
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
