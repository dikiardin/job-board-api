import { SkillAssessmentResultsQueryRepository } from "./skillAssessmentResultsQuery.repository";
import { SkillAssessmentResultsMutationRepository } from "./skillAssessmentResultsMutation.repository";
import { SkillAssessmentResultsCertificateRepository } from "./skillAssessmentResultsCertificate.repository";
import { SkillAssessmentResultsStatsRepository } from "./skillAssessmentResultsStats.repository";

export class SkillAssessmentResultsRepository {
  // Save assessment result
  public static async saveAssessmentResult(data: {
    userId: number;
    assessmentId: number;
    score: number;
    isPassed: boolean;
    certificateUrl?: string;
    certificateCode?: string;
  }) {
    return SkillAssessmentResultsMutationRepository.saveAssessmentResult(data);
  }

  // Get user's assessment result for specific assessment
  public static async getUserResult(userId: number, assessmentId: number) {
    return SkillAssessmentResultsQueryRepository.getUserResult(
      userId,
      assessmentId
    );
  }

  // Get user's all assessment results
  public static async getUserResults(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    return SkillAssessmentResultsQueryRepository.getUserResults(
      userId,
      page,
      limit
    );
  }

  // Get assessment results for developer
  public static async getAssessmentResults(
    assessmentId: number,
    createdBy: number
  ) {
    return SkillAssessmentResultsQueryRepository.getAssessmentResults(
      assessmentId,
      createdBy
    );
  }

  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return SkillAssessmentResultsCertificateRepository.verifyCertificate(
      certificateCode
    );
  }

  // Get user's certificates
  public static async getUserCertificates(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    return SkillAssessmentResultsCertificateRepository.getUserCertificates(
      userId,
      page,
      limit
    );
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit: number = 10
  ) {
    return SkillAssessmentResultsQueryRepository.getAssessmentLeaderboard(
      assessmentId,
      limit
    );
  }

  // Get assessment statistics
  public static async getAssessmentStats(assessmentId: number) {
    return SkillAssessmentResultsStatsRepository.getAssessmentStats(
      assessmentId
    );
  }

  // Update certificate info
  public static async updateCertificateInfo(
    resultId: number,
    certificateUrl: string,
    certificateCode: string
  ) {
    return SkillAssessmentResultsMutationRepository.updateCertificateInfo(
      resultId,
      certificateUrl,
      certificateCode
    );
  }

  // Get certificate by code
  public static async getCertificateByCode(certificateCode: string) {
    return SkillAssessmentResultsCertificateRepository.getCertificateByCode(
      certificateCode
    );
  }

  // Get user assessment attempts for a specific assessment
  public static async getUserAssessmentAttempts(
    userId: number,
    assessmentId: number
  ) {
    return SkillAssessmentResultsQueryRepository.getUserAssessmentAttempts(
      userId,
      assessmentId
    );
  }
}
