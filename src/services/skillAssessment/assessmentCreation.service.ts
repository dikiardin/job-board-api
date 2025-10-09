import { AssessmentCrudRepository } from "../../repositories/skillAssessment/assessmentCrud.repository";
import { AssessmentValidationService } from "./assessmentValidation.service";
import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";

export class AssessmentCreationService {
  public static async createAssessment(data: {
    title: string;
    description?: string;
    category: string;
    badgeTemplateId?: number;
    passScore?: number;
    createdBy: number;
    userRole: UserRole;
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
    }>;
  }) {
    AssessmentValidationService.validateDeveloperRole(data.userRole);
    AssessmentValidationService.validateQuestions(data.questions);
    this.validatePassScore(data.passScore);
    
    const { userRole, ...assessmentData } = data;
    return await AssessmentCrudRepository.createAssessment(assessmentData);
  }

  // Get all assessments for management (Developer only)
  public static async getAssessments(page: number = 1, limit: number = 10) {
    return await AssessmentCrudRepository.getAllAssessments(page, limit);
  }

  // Get assessment details for editing (Developer only)
  public static async getAssessmentById(assessmentId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can access assessment details", 403);
    }

    // Use direct repository method to get assessment by ID
    const assessment = await AssessmentCrudRepository.getAssessmentById(assessmentId);
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    return assessment;
  }

  // Update assessment (Developer only)
  public static async updateAssessment(
    assessmentId: number,
    userId: number,
    data: {
      title?: string;
      description?: string;
      category?: string;
      badgeTemplateId?: number;
      passScore?: number;
      questions?: Array<{
        question: string;
        options: string[];
        answer: string;
      }>;
    }
  ) {
    if (data.questions) {
      this.validateUpdateQuestions(data.questions);
    }
    
    if (data.passScore !== undefined) {
      this.validatePassScore(data.passScore);
    }

    return await AssessmentCrudRepository.updateAssessment(assessmentId, userId, data);
  }

  // Helper: Validate questions for update
  private static validateUpdateQuestions(questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>) {
    if (questions.length < 1) {
      throw new CustomError("Assessment must have at least 1 question", 400);
    }

    questions.forEach((q, index) => {
      if (!q.question || q.options.length !== 4 || !q.answer) {
        throw new CustomError(`Question ${index + 1} is invalid`, 400);
      }
      if (!q.options.includes(q.answer)) {
        throw new CustomError(`Question ${index + 1} answer must be one of the options`, 400);
      }
    });
  }

  // Delete assessment (Developer only)
  public static async deleteAssessment(assessmentId: number, userId: number) {

    // Use getAllAssessments to check if assessment exists (mock implementation)
    const assessments = await AssessmentCrudRepository.getAllAssessments(1, 1000);
    const assessment = assessments.assessments.find((a: any) => a.id === assessmentId);
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    return await AssessmentCrudRepository.deleteAssessment(assessmentId, userId);
  }

  // Get assessment statistics (Developer only)
  public static async getAssessmentStats(assessmentId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can access assessment statistics", 403);
    }

    // Mock implementation for stats
    return { totalAssessments: 0, totalQuestions: 0, totalResults: 0 };
  }
  
  // Validate assessment structure
  private static validateQuestionStructure(questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>) {
    if (questions.length < 1) {
      throw new CustomError("Assessment must have at least 1 question", 400);
    }

    questions.forEach((q, index) => {
      if (!q.question?.trim()) {
        throw new CustomError(`Question ${index + 1} text is required`, 400);
      }
      
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new CustomError(`Question ${index + 1} must have exactly 4 options`, 400);
      }
      
      if (q.options.some(option => !option?.trim())) {
        throw new CustomError(`Question ${index + 1} options cannot be empty`, 400);
      }
      
      if (!q.answer?.trim()) {
        throw new CustomError(`Question ${index + 1} answer is required`, 400);
      }
      
      if (!q.options.includes(q.answer)) {
        throw new CustomError(`Question ${index + 1} answer must be one of the provided options`, 400);
      }
    });
  }

  // Bulk import questions from JSON/CSV
  public static async importQuestions(
    assessmentId: number,
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
    }>,
    userRole: UserRole
  ) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can import questions", 403);
    }

    this.validateQuestionStructure(questions);
    
    return await AssessmentCrudRepository.updateAssessment(assessmentId, 0, { questions });
  }

  // Export questions to JSON format
  public static async exportQuestions(assessmentId: number, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can export questions", 403);
    }

    // Use getAllAssessments to get assessment for export (mock implementation)
    const assessments = await AssessmentCrudRepository.getAllAssessments(1, 1000);
    const assessment = assessments.assessments.find((a: any) => a.id === assessmentId);
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    return {
      assessmentId,
      title: assessment.title,
      description: assessment.description,
      questions: (assessment as any).questions || [],
      exportedAt: new Date().toISOString()
    };
  }

  // Helper: Validate pass score
  private static validatePassScore(passScore?: number) {
    if (passScore !== undefined && passScore !== null) {
      if (typeof passScore !== 'number') {
        throw new CustomError("Pass score must be a number", 400);
      }
      if (passScore < 1 || passScore > 100) {
        throw new CustomError("Pass score must be between 1% and 100%", 400);
      }
      if (!Number.isInteger(passScore)) {
        throw new CustomError("Pass score must be a whole number", 400);
      }
    }
  }
}
