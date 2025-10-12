import { AssessmentResultsQueryRepository } from "./assessmentResultsQuery.repository";
import { AssessmentResultsMutationRepository } from "./assessmentResultsMutation.repository";
import { AssessmentResultsCertificateRepository } from "./assessmentResultsCertificate.repository";
import { AssessmentResultsStatsRepository } from "./assessmentResultsStats.repository";

export class AssessmentResultsRepository {
  // Save assessment result
  public static async saveAssessmentResult(data: {
    userId: number;
    assessmentId: number;
    score: number;
    isPassed: boolean;
    certificateUrl?: string;
    certificateCode?: string;
  }) {
    return AssessmentResultsMutationRepository.saveAssessmentResult(data);
  }

  // Get user's result for specific assessment
  public static async getUserResult(userId: number, assessmentId: number) {
    return AssessmentResultsQueryRepository.getUserResult(userId, assessmentId);
  }

  // Get all results for an assessment
  public static async getAssessmentResults(assessmentId: number) {
    return AssessmentResultsQueryRepository.getAssessmentResults(assessmentId);
  }

  // Get user's all results with pagination
  public static async getUserResults(
    userId: number,
    page?: number,
    limit?: number
  ) {
    return AssessmentResultsQueryRepository.getUserResults(userId, page, limit);
  }

  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return AssessmentResultsCertificateRepository.verifyCertificate(
      certificateCode
    );
  }

  // Get user's certificates
  public static async getUserCertificates(
    userId: number,
    page?: number,
    limit?: number
  ) {
    return AssessmentResultsCertificateRepository.getUserCertificates(
      userId,
      page,
      limit
    );
  }

  // Get certificate by code
  public static async getCertificateByCode(certificateCode: string) {
    return AssessmentResultsCertificateRepository.getCertificateByCode(
      certificateCode
    );
  }

  // Get assessment leaderboard
  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit?: number
  ) {
    return AssessmentResultsQueryRepository.getAssessmentLeaderboard(
      assessmentId,
      limit
    );
  }

  // Get assessment statistics
  public static async getAssessmentStatistics(assessmentId: number) {
    return AssessmentResultsStatsRepository.getAssessmentStatistics(
      assessmentId
    );
  }

  // Delete assessment result
  public static async deleteAssessmentResult(resultId: number) {
    return AssessmentResultsMutationRepository.deleteAssessmentResult(resultId);
  }

  // Update certificate info
  public static async updateCertificateInfo(
    resultId: number,
    certificateUrl: string,
    certificateCode: string
  ) {
    return AssessmentResultsMutationRepository.updateCertificateInfo(
      resultId,
      certificateUrl,
      certificateCode
    );
  }

  // Get user assessment history
  public static async getUserAssessmentHistory(userId: number) {
    return AssessmentResultsQueryRepository.getUserAssessmentHistory(userId);
  }

  // Get global assessment statistics
  public static async getGlobalAssessmentStats() {
    return AssessmentResultsStatsRepository.getGlobalAssessmentStats();
  }
}
