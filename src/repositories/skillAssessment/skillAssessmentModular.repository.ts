// Modular repository that delegates to specialized repositories
// This keeps the main repository under 200 lines while maintaining all functionality

import { AssessmentCrudRepository } from "./assessmentCrud.repository";
import { SkillAssessmentResultsRepository } from "./skillAssessmentResults.repository";

export class SkillAssessmentModularRepository {
  // ===== ASSESSMENT CRUD OPERATIONS =====

  // Delegate to AssessmentCrudRepository
  public static async createAssessment(data: any) {
    return await AssessmentCrudRepository.createAssessment(data);
  }

  public static async getAllAssessments(page: number = 1, limit: number = 10) {
    return await AssessmentCrudRepository.getAllAssessments(page, limit);
  }

  public static async getAssessmentById(assessmentId: number) {
    return await AssessmentCrudRepository.getAssessmentById(assessmentId);
  }

  public static async getAssessmentBySlug(slug: string) {
    return await AssessmentCrudRepository.getAssessmentBySlug(slug);
  }

  public static async updateAssessment(
    assessmentId: number,
    createdBy: number,
    data: any
  ) {
    return await AssessmentCrudRepository.updateAssessment(
      assessmentId,
      createdBy,
      data
    );
  }

  public static async deleteAssessment(
    assessmentId: number,
    createdBy: number
  ) {
    return await AssessmentCrudRepository.deleteAssessment(
      assessmentId,
      createdBy
    );
  }

  public static async getDeveloperAssessments(
    createdBy: number,
    page?: number,
    limit?: number
  ) {
    return await AssessmentCrudRepository.getDeveloperAssessments(
      createdBy,
      page,
      limit
    );
  }

  public static async searchAssessments(
    searchTerm: string,
    page?: number,
    limit?: number
  ) {
    return await AssessmentCrudRepository.searchAssessments(
      searchTerm,
      page,
      limit
    );
  }

  public static async isAssessmentTitleAvailable(
    title: string,
    excludeId?: number
  ) {
    return await AssessmentCrudRepository.isAssessmentTitleAvailable(
      title,
      excludeId
    );
  }

  public static async getAssessmentStats() {
    return await AssessmentCrudRepository.getAssessmentStats();
  }

  public static async getAssessmentByIdForDeveloper(
    assessmentId: number,
    createdBy: number
  ) {
    return await AssessmentCrudRepository.getAssessmentByIdForDeveloper(
      assessmentId,
      createdBy
    );
  }

  public static async saveQuestion(data: {
    assessmentId: number;
    question: string;
    options: string[];
    answer: string;
  }) {
    return await AssessmentCrudRepository.saveQuestion(data);
  }

  // ===== ASSESSMENT RESULTS OPERATIONS =====

  // Delegate to SkillAssessmentResultsRepository
  public static async saveAssessmentResult(data: any) {
    return await SkillAssessmentResultsRepository.saveAssessmentResult(data);
  }

  public static async getUserResult(userId: number, assessmentId: number) {
    return await SkillAssessmentResultsRepository.getUserResult(
      userId,
      assessmentId
    );
  }

  public static async getAssessmentResults(
    assessmentId: number,
    createdBy: number
  ) {
    return await SkillAssessmentResultsRepository.getAssessmentResults(
      assessmentId,
      createdBy
    );
  }

  public static async getUserResults(
    userId: number,
    page?: number,
    limit?: number
  ) {
    return await SkillAssessmentResultsRepository.getUserResults(
      userId,
      page,
      limit
    );
  }

  public static async verifyCertificate(certificateCode: string) {
    return await SkillAssessmentResultsRepository.verifyCertificate(
      certificateCode
    );
  }

  public static async getUserCertificates(
    userId: number,
    page?: number,
    limit?: number
  ) {
    return await SkillAssessmentResultsRepository.getUserCertificates(
      userId,
      page,
      limit
    );
  }

  public static async getCertificateByCode(certificateCode: string) {
    return await SkillAssessmentResultsRepository.getCertificateByCode(
      certificateCode
    );
  }

  public static async getAssessmentLeaderboard(
    assessmentId: number,
    limit?: number
  ) {
    return await SkillAssessmentResultsRepository.getAssessmentLeaderboard(
      assessmentId,
      limit
    );
  }

  public static async getAssessmentStatistics(assessmentId: number) {
    return await SkillAssessmentResultsRepository.getAssessmentStats(
      assessmentId
    );
  }

  public static async updateCertificateInfo(
    resultId: number,
    certificateUrl: string,
    certificateCode: string
  ) {
    return await SkillAssessmentResultsRepository.updateCertificateInfo(
      resultId,
      certificateUrl,
      certificateCode
    );
  }

  // ===== CONVENIENCE METHODS =====

  /**
   * Get user assessment attempts for a specific assessment
   */
  public static async getUserAssessmentAttempts(
    userId: number,
    assessmentId: number
  ) {
    return await SkillAssessmentResultsRepository.getUserAssessmentAttempts(
      userId,
      assessmentId
    );
  }
}
// For backward compatibility, also export as default
export default SkillAssessmentModularRepository;

// Re-export specialized repositories
export { AssessmentCrudRepository, SkillAssessmentResultsRepository };

