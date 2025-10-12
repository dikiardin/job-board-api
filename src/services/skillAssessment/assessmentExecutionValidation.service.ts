import { CustomError } from "../../utils/customError";

export class AssessmentExecutionValidationService {
  private static readonly TIME_LIMIT_MINUTES = 3; // Changed from 30 to 3 minutes to match frontend

  // Validate assessment submission
  public static validateSubmission(data: {
    assessmentId: number;
    userId: number;
    answers: Array<{ questionId: number; answer: string }>;
    timeSpent: number;
  }) {
    // Validate time limit
    if (data.timeSpent > this.TIME_LIMIT_MINUTES) {
      throw new CustomError(
        `Assessment submission time exceeded maximum allowed duration of ${this.TIME_LIMIT_MINUTES} minutes. Time taken: ${data.timeSpent} minutes`,
        400
      );
    }

    // Validate all questions are answered
    if (data.answers.length !== 25) {
      throw new CustomError("All 25 questions must be answered", 400);
    }

    // Validate answer format
    data.answers.forEach((answer, index) => {
      if (!answer.questionId || !answer.answer) {
        throw new CustomError(`Answer ${index + 1} is invalid`, 400);
      }
    });
  }

  // Get time remaining for assessment
  public static getTimeRemaining(startTime: Date): number {
    const elapsed = (Date.now() - startTime.getTime()) / (1000 * 60); // minutes
    const remaining = Math.max(0, this.TIME_LIMIT_MINUTES - elapsed);
    return Math.floor(remaining);
  }

  // Get time limit
  public static getTimeLimit(): number {
    return this.TIME_LIMIT_MINUTES;
  }
}
