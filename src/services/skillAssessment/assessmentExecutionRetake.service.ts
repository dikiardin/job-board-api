import { SkillAssessmentModularRepository } from "../../repositories/skillAssessment/skillAssessmentModular.repository";
import { CustomError } from "../../utils/customError";

export class AssessmentExecutionRetakeService {
  // Check if retake is allowed
  public static async canRetakeAssessment(
    userId: number,
    assessmentId: number
  ): Promise<boolean> {
    const existingResult = await SkillAssessmentModularRepository.getUserResult(
      userId,
      assessmentId
    );

    if (!existingResult) {
      return true; // Can retake if no previous attempt
    }

    // Get assessment to check dynamic pass score
    const assessment = await SkillAssessmentModularRepository.getAssessmentById(assessmentId);
    const passScore = assessment?.passScore || 75;

    // Can retake if failed (score below pass score)
    return existingResult.score < passScore;
  }

  // Reset assessment for retake
  public static async resetAssessmentForRetake(
    userId: number,
    assessmentId: number
  ) {
    const canRetake = await this.canRetakeAssessment(userId, assessmentId);
    if (!canRetake) {
      throw new CustomError("Cannot retake a passed assessment", 400);
    }

    const existingResult = await SkillAssessmentModularRepository.getUserResult(
      userId,
      assessmentId
    );
    if (existingResult) {
      // Delete previous attempt
      return {
        message: "Previous attempt reset. You can now retake the assessment.",
      };
    }

    return { message: "Assessment is ready to be taken." };
  }
}
