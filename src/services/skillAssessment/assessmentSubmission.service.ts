import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { CertificateService } from "./certificate.service";
import { AssessmentExecutionService } from "./assessmentExecution.service";
import { ScoringCalculationService } from "./scoringCalculation.service";

export class AssessmentSubmissionService {
  public static async submitAssessment(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    timeSpent: number;
  }) {
    await AssessmentSubmissionService.validateSubmission(data);
    const assessment = await AssessmentExecutionService.validateAssessmentExists(data.assessmentId);
    const { score, correctAnswers, totalQuestions } = ScoringCalculationService.calculateScore(
      assessment.questions, data.answers
    );

    const isPassed = ScoringCalculationService.isPassed(score);
    
    // Generate certificate immediately if user passed
    const certificateData = isPassed ? await AssessmentSubmissionService.generateCertificate(
      data.userId, assessment, score, totalQuestions
    ) : null;

    // Save result with certificate data
    const resultData: any = {
      userId: data.userId, 
      assessmentId: data.assessmentId, 
      score,
    };
    
    if (certificateData) {
      resultData.certificateUrl = certificateData.certificateUrl;
      resultData.certificateCode = certificateData.certificateCode;
    }
    
    const result = await AssessmentSubmissionService.saveAssessmentResult(resultData);

    return {
      result: { 
        id: result.id, score, correctAnswers, totalQuestions, 
        passed: isPassed, timeSpent: data.timeSpent, completedAt: result.createdAt,
        certificateUrl: certificateData?.certificateUrl,
        certificateCode: certificateData?.certificateCode,
      },
      certificate: certificateData,
    };
  }

  private static async validateSubmission(data: any) {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
    if (existingResult) {
      throw new CustomError("You have already completed this assessment", 400);
    }
  }

  private static async generateCertificate(userId: number, assessment: any, score: number, totalQuestions: number) {
    const user = await AssessmentExecutionService.getUserInfo(userId);
    return await CertificateService.generateCertificate({
      userName: user.name || 'User', userEmail: user.email, assessmentTitle: assessment.title,
      assessmentDescription: assessment.description || '', score, totalQuestions, completedAt: new Date(), userId,
    });
  }

  private static async saveAssessmentResult(data: {
    userId: number;
    assessmentId: number;
    score: number;
    certificateUrl?: string;
    certificateCode?: string;
  }) {
    return await SkillAssessmentModularRepository.saveAssessmentResult(data);
  }

  public static async getUserResults(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    
    return {
      results: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  // Check if assessment exists
  public static async checkAssessmentExists(assessmentId: number): Promise<boolean> {
    try {
      const assessment = await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
      return !!assessment;
    } catch (error) {
      console.error("Error checking assessment exists:", error);
      return false;
    }
  }

  // Get assessment for taking (without answers)
  public static async getAssessmentForTaking(assessmentId: number) {
    try {
      const assessment = await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new CustomError("Assessment not found", 404);
      }
      
      // Return assessment without answers for security
      return {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        questions: assessment.questions?.map((q: any) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          // Don't include the correct answer
        })) || [],
        badgeTemplate: assessment.badgeTemplate,
        creator: assessment.creator,
      };
    } catch (error) {
      console.error("Error getting assessment for taking:", error);
      throw error;
    }
  }

  public static async getAssessmentResult(userId: number, assessmentId: number) {
    const result = await SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
    if (!result) {
      throw new CustomError("Assessment result not found", 404);
    }
    return result;
  }

  public static async getAllAssessmentResults(assessmentId: number) {
    // Get real results from database
    const results = await SkillAssessmentModularRepository.getAssessmentResults(assessmentId);
    
    // Calculate summary statistics
    const totalAttempts = results.length;
    const passedCount = results.filter(r => r.isPassed).length;
    const averageScore = totalAttempts > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts)
      : 0;
    const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
    
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
      }
    };
  }

  public static isAssessmentPassed(score: number): boolean {
    return score >= 75;
  }
}
