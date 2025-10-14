import { AssessmentCrudQueryRepository } from "./assessmentCrudQuery.repository";
import { AssessmentCrudMutationRepository } from "./assessmentCrudMutation.repository";
import { AssessmentCrudValidationRepository } from "./assessmentCrudValidation.repository";
import { AssessmentCrudStatsRepository } from "./assessmentCrudStats.repository";

export class AssessmentCrudRepository {
  // Create new assessment
  public static async createAssessment(data: {
    title: string;
    description?: string;
    category: string;
    badgeTemplateId?: number;
    passScore?: number;
    createdBy: number;
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
    }>;
  }) {
    return AssessmentCrudMutationRepository.createAssessment(data);
  }

  // Get all assessments with pagination
  public static async getAllAssessments(page: number = 1, limit: number = 10) {
    return AssessmentCrudQueryRepository.getAllAssessments(page, limit);
  }

  // Get assessment by ID
  public static async getAssessmentById(assessmentId: number) {
    return AssessmentCrudQueryRepository.getAssessmentById(assessmentId);
  }

  // Get assessment by slug
  public static async getAssessmentBySlug(slug: string) {
    return AssessmentCrudQueryRepository.getAssessmentBySlug(slug);
  }

  // Update assessment
  public static async updateAssessment(
    assessmentId: number,
    createdBy: number,
    data: any
  ) {
    return AssessmentCrudMutationRepository.updateAssessment(
      assessmentId,
      createdBy,
      data
    );
  }

  // Delete assessment
  public static async deleteAssessment(
    assessmentId: number,
    createdBy: number
  ) {
    return AssessmentCrudMutationRepository.deleteAssessment(
      assessmentId,
      createdBy
    );
  }

  // Get developer's assessments
  public static async getDeveloperAssessments(
    createdBy: number,
    page?: number,
    limit?: number
  ) {
    return AssessmentCrudQueryRepository.getDeveloperAssessments(
      createdBy,
      page,
      limit
    );
  }

  // Search assessments
  public static async searchAssessments(
    searchTerm: string,
    page?: number,
    limit?: number
  ) {
    return AssessmentCrudQueryRepository.searchAssessments(
      searchTerm,
      page,
      limit
    );
  }

  // Check if assessment title is available
  public static async isAssessmentTitleAvailable(
    title: string,
    excludeId?: number
  ) {
    return AssessmentCrudValidationRepository.isAssessmentTitleAvailable(
      title,
      excludeId
    );
  }

  // Get assessment statistics
  public static async getAssessmentStats() {
    return AssessmentCrudStatsRepository.getAssessmentStats();
  }

  // Get assessment by ID for developer (includes questions)
  public static async getAssessmentByIdForDeveloper(
    assessmentId: number,
    createdBy: number
  ) {
    return AssessmentCrudQueryRepository.getAssessmentByIdForDeveloper(
      assessmentId,
      createdBy
    );
  }

  // Save individual question
  public static async saveQuestion(data: {
    assessmentId: number;
    question: string;
    options: string[];
    answer: string;
  }) {
    return AssessmentCrudMutationRepository.saveQuestion(data);
  }
}
