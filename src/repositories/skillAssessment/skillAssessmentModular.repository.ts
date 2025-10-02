// Modular repository that delegates to specialized repositories
// This keeps the main repository under 200 lines while maintaining all functionality

import { AssessmentCrudRepository } from "./assessmentCrud.repository";
import { AssessmentResultsRepository } from "./assessmentResults.repository";

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

  public static async updateAssessment(assessmentId: number, createdBy: number, data: any) {
    return await AssessmentCrudRepository.updateAssessment(assessmentId, createdBy, data);
  }

  public static async deleteAssessment(assessmentId: number, createdBy: number) {
    return await AssessmentCrudRepository.deleteAssessment(assessmentId, createdBy);
  }

  public static async getDeveloperAssessments(createdBy: number, page?: number, limit?: number) {
    return await AssessmentCrudRepository.getDeveloperAssessments(createdBy, page, limit);
  }

  public static async searchAssessments(searchTerm: string, page?: number, limit?: number) {
    return await AssessmentCrudRepository.searchAssessments(searchTerm, page, limit);
  }

  public static async isAssessmentTitleAvailable(title: string, excludeId?: number) {
    return await AssessmentCrudRepository.isAssessmentTitleAvailable(title, excludeId);
  }

  public static async getAssessmentStats() {
    return await AssessmentCrudRepository.getAssessmentStats();
  }

  public static async getAssessmentByIdForDeveloper(assessmentId: number, createdBy: number) {
    return await AssessmentCrudRepository.getAssessmentByIdForDeveloper(assessmentId, createdBy);
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
  
  // Delegate to AssessmentResultsRepository
  public static async saveAssessmentResult(data: any) {
    return await AssessmentResultsRepository.saveAssessmentResult(data);
  }

  public static async getUserResult(userId: number, assessmentId: number) {
    return await AssessmentResultsRepository.getUserResult(userId, assessmentId);
  }

  public static async getAssessmentResults(assessmentId: number) {
    return await AssessmentResultsRepository.getAssessmentResults(assessmentId);
  }

  public static async getUserResults(userId: number, page?: number, limit?: number) {
    return await AssessmentResultsRepository.getUserResults(userId, page, limit);
  }

  public static async verifyCertificate(certificateCode: string) {
    return await AssessmentResultsRepository.verifyCertificate(certificateCode);
  }

  public static async getUserCertificates(userId: number, page?: number, limit?: number) {
    return await AssessmentResultsRepository.getUserCertificates(userId, page, limit);
  }

  public static async getCertificateByCode(certificateCode: string) {
    return await AssessmentResultsRepository.getCertificateByCode(certificateCode);
  }

  public static async getAssessmentLeaderboard(assessmentId: number, limit?: number) {
    return await AssessmentResultsRepository.getAssessmentLeaderboard(assessmentId, limit);
  }

  public static async getAssessmentStatistics(assessmentId: number) {
    return await AssessmentResultsRepository.getAssessmentStatistics(assessmentId);
  }

  public static async deleteAssessmentResult(resultId: number) {
    return await AssessmentResultsRepository.deleteAssessmentResult(resultId);
  }

  public static async updateCertificateInfo(resultId: number, certificateUrl: string, certificateCode: string) {
    return await AssessmentResultsRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
  }

  public static async getUserAssessmentHistory(userId: number) {
    return await AssessmentResultsRepository.getUserAssessmentHistory(userId);
  }

  public static async getGlobalAssessmentStats() {
    return await AssessmentResultsRepository.getGlobalAssessmentStats();
  }

  // ===== CONVENIENCE METHODS =====
  
  // Combined methods that use both repositories
  public static async getAssessmentWithResults(assessmentId: number) {
    const [assessment, results, stats] = await Promise.all([
      this.getAssessmentById(assessmentId),
      this.getAssessmentResults(assessmentId),
      this.getAssessmentStatistics(assessmentId),
    ]);

    return {
      assessment,
      results,
      statistics: stats,
    };
  }

  public static async getUserAssessmentSummary(userId: number) {
    const [results, certificates, history] = await Promise.all([
      this.getUserResults(userId),
      this.getUserCertificates(userId),
      this.getUserAssessmentHistory(userId),
    ]);

    return {
      results: results.results,
      certificates: certificates.certificates,
      statistics: history.statistics,
    };
  }

  // Export specialized repositories for direct access if needed
  public static get CrudRepository() {
    return AssessmentCrudRepository;
  }

  public static get ResultsRepository() {
    return AssessmentResultsRepository;
  }
}

// For backward compatibility, also export as default
export default SkillAssessmentModularRepository;

// Re-export specialized repositories
export { AssessmentCrudRepository, AssessmentResultsRepository };
