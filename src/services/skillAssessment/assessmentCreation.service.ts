import { AssessmentCrudRepository } from "../../repositories/skillAssessment/assessmentCrud.repository";
import { AssessmentValidationService } from "./assessmentValidation.service";
import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";
import { prisma } from "../../config/prisma";
import {
  validateQuestions,
  validatePassScore,
} from "./assessmentValidation.helper";

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
    validateQuestions(data.questions);
    validatePassScore(data.passScore);

    const { userRole, ...assessmentData } = data;
    return await AssessmentCrudRepository.createAssessment(assessmentData);
  }

  // Get all assessments for management (Developer only)
  public static async getAssessments(page: number = 1, limit: number = 10) {
    return await AssessmentCrudRepository.getAllAssessments(page, limit);
  }

  // Get assessment details for editing (Developer only)
  public static async getAssessmentById(
    assessmentId: number,
    userRole: UserRole
  ) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError(
        "Only developers can access assessment details",
        403
      );
    }

    // Use direct repository method to get assessment by ID
    const assessment = await AssessmentCrudRepository.getAssessmentById(
      assessmentId
    );
    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    return assessment;
  }

  // Get assessment by slug (Developer only, mirrors getAssessmentById)
  public static async getAssessmentBySlug(slug: string, userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError(
        "Only developers can access assessment details",
        403
      );
    }

    const assessment = await AssessmentCrudRepository.getAssessmentBySlug(slug);
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
      validateQuestions(data.questions);
    }

    if (data.passScore !== undefined) {
      validatePassScore(data.passScore);
    }

    return await AssessmentCrudRepository.updateAssessment(
      assessmentId,
      userId,
      data
    );
  }

  // Delete assessment (Developer only)
  public static async deleteAssessment(assessmentId: number, userId: number) {
    // Check if assessment exists
    const assessment = await AssessmentCrudRepository.getAssessmentById(
      assessmentId
    );

    if (!assessment) {
      throw new CustomError("Assessment not found", 404);
    }

    // Verify ownership
    if (assessment.createdBy !== userId) {
      throw new CustomError("Unauthorized to delete this assessment", 403);
    }

    return await AssessmentCrudRepository.deleteAssessment(
      assessmentId,
      userId
    );
  }

  // Get assessment statistics (Developer only)
  public static async getAssessmentStats(
    assessmentId: number,
    userRole: UserRole
  ) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError(
        "Only developers can access assessment statistics",
        403
      );
    }

    const [questionCount, resultCount] = await Promise.all([
      prisma.skillQuestion.count({
        where: { assessmentId },
      }),
      prisma.skillResult.count({
        where: { assessmentId },
      }),
    ]);

    return {
      totalQuestions: questionCount,
      totalResults: resultCount,
    };
  }
}
