import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";
import { CertificateService } from "./certificate.service";
import { AssessmentExecutionService } from "./assessmentExecution.service";
import { ScoringCalculationService } from "./scoringCalculation.service";
import { AssessmentValidationService } from "./assessmentValidation.service";

export class AssessmentSubmissionCoreService {
  public static async submitAssessment(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    startedAt: string;
  }) {
    await AssessmentSubmissionCoreService.validateSubmission(data);
    const assessment =
      await AssessmentExecutionService.validateAssessmentExists(
        data.assessmentId
      );

    // Calculate time spent from startedAt
    const startTime = new Date(data.startedAt);
    const finishTime = new Date();
    const timeSpentMinutes = Math.round(
      (finishTime.getTime() - startTime.getTime()) / (1000 * 60)
    );

    const { score, correctAnswers, totalQuestions } =
      ScoringCalculationService.calculateScore(
        assessment.questions,
        data.answers
      );

    const isPassed = ScoringCalculationService.isPassed(
      score,
      assessment.passScore
    );

    // Generate certificate immediately if user passed
    const certificateData = isPassed
      ? await AssessmentSubmissionCoreService.generateCertificate(
          data.userId,
          assessment,
          score,
          totalQuestions
        )
      : null;

    // Save result with certificate data
    const resultData: any = {
      userId: data.userId,
      assessmentId: data.assessmentId,
      score,
      isPassed,
    };

    if (certificateData) {
      resultData.certificateUrl = certificateData.certificateUrl;
      resultData.certificateCode = certificateData.certificateCode;
    }

    const result = await AssessmentSubmissionCoreService.saveAssessmentResult(
      resultData
    );

    return {
      result: {
        id: result.id,
        score,
        correctAnswers,
        totalQuestions,
        passed: isPassed,
        timeSpent: timeSpentMinutes,
        completedAt: result.createdAt,
        certificateUrl: certificateData?.certificateUrl,
        certificateCode: certificateData?.certificateCode,
      },
      certificate: certificateData,
    };
  }

  private static async validateSubmission(data: any) {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(
      data.userId,
      data.assessmentId
    );
    if (existingResult) {
      throw new CustomError("You have already completed this assessment", 400);
    }

    // Validate time limit using AssessmentValidationService
    const startTime = new Date(data.startedAt);
    const finishTime = new Date();
    AssessmentValidationService.validateTimeLimit(startTime, finishTime);
  }

  private static async generateCertificate(
    userId: number,
    assessment: any,
    score: number,
    totalQuestions: number
  ) {
    const user = await AssessmentExecutionService.getUserInfo(userId);
    return await CertificateService.generateCertificate({
      userName: user.name || "User",
      userEmail: user.email,
      assessmentTitle: assessment.title,
      assessmentDescription: assessment.description || "",
      score,
      totalQuestions,
      completedAt: new Date(),
      userId,
      badgeName: assessment.badgeTemplate?.name,
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
}
