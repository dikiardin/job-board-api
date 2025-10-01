import { SkillAssessmentCrudRepository } from "./skillAssessmentCrud.repository";
import { SkillAssessmentResultsRepository } from "./skillAssessmentResults.repository";

export class SkillAssessmentRepository {
  // Delegate to CRUD repository
  public static async createAssessment(data: any) {
    return await SkillAssessmentCrudRepository.createAssessment(data);
  }

  public static async getAllAssessments(page?: number, limit?: number) {
    return await SkillAssessmentCrudRepository.getAllAssessments(page, limit);
  }

  public static async getAssessmentWithQuestions(assessmentId: number) {
    return await SkillAssessmentCrudRepository.getAssessmentWithQuestions(assessmentId);
  }

  public static async getAssessmentWithAnswers(assessmentId: number) {
    return await SkillAssessmentCrudRepository.getAssessmentWithAnswers(assessmentId);
  }

  public static async updateAssessment(assessmentId: number, createdBy: number, data: any) {
    return await SkillAssessmentCrudRepository.updateAssessment(assessmentId, createdBy, data);
  }

  public static async deleteAssessment(assessmentId: number, createdBy: number) {
    return await SkillAssessmentCrudRepository.deleteAssessment(assessmentId, createdBy);
  }

  public static async getDeveloperAssessments(createdBy: number) {
    return await SkillAssessmentCrudRepository.getDeveloperAssessments(createdBy);
  }

  // Delegate to Results repository
  public static async saveAssessmentResult(data: any) {
    return await SkillAssessmentResultsRepository.saveAssessmentResult(data);
  }

  public static async getUserResult(userId: number, assessmentId: number) {
    return await SkillAssessmentResultsRepository.getUserResult(userId, assessmentId);
  }

  public static async getUserResults(userId: number, page?: number, limit?: number) {
    return await SkillAssessmentResultsRepository.getUserResults(userId, page, limit);
  }

  public static async getAssessmentResults(assessmentId: number, createdBy?: number) {
    return await SkillAssessmentResultsRepository.getAssessmentResults(assessmentId, createdBy || 0);
  }

  public static async verifyCertificate(certificateCode: string) {
    return await SkillAssessmentResultsRepository.verifyCertificate(certificateCode);
  }

  public static async getUserCertificates(userId: number, page?: number, limit?: number) {
    return await SkillAssessmentResultsRepository.getUserCertificates(userId, page, limit);
  }

  public static async getAssessmentLeaderboard(assessmentId: number, limit?: number) {
    return await SkillAssessmentResultsRepository.getAssessmentLeaderboard(assessmentId, limit);
  }

  public static async getAssessmentStats(assessmentId: number) {
    return await SkillAssessmentResultsRepository.getAssessmentStats(assessmentId);
  }

  public static async updateCertificateInfo(resultId: number, certificateUrl: string, certificateCode: string) {
    return await SkillAssessmentResultsRepository.updateCertificateInfo(resultId, certificateUrl, certificateCode);
  }

  public static async getCertificateByCode(certificateCode: string) {
    return await SkillAssessmentResultsRepository.getCertificateByCode(certificateCode);
  }
}
