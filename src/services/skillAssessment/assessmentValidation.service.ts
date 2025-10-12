import { CustomError } from "../../utils/customError";
import { UserRole } from "../../generated/prisma";

export class AssessmentValidationService {
  public static validateDeveloperRole(userRole: UserRole) {
    if (userRole !== UserRole.DEVELOPER) {
      throw new CustomError("Only developers can create assessments", 403);
    }
  }

  public static validateQuestions(questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>) {
    if (questions.length === 0) return;

    questions.forEach((q, index) => {
      AssessmentValidationService.validateSingleQuestion(q, index + 1);
    });
  }

  private static validateSingleQuestion(question: any, index: number) {
    if (!question.question || question.options.length !== 4) {
      throw new CustomError(`Question ${index} is invalid`, 400);
    }
    
    // Allow empty answers (for auto-submit scenarios)
    if (question.answer && !question.options.includes(question.answer)) {
      throw new CustomError(`Question ${index} answer must be one of the options`, 400);
    }
  }

  public static validateTimeLimit(startedAt: Date, finishedAt: Date) {
    const timeDiff = finishedAt.getTime() - startedAt.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Allow up to 3.5 minutes (3 minutes + 30 seconds buffer for network delays and auto-submit)
    if (minutesDiff > 3.5) {
      throw new CustomError(
        `Assessment submission time exceeded maximum allowed duration of 3 minutes. Time taken: ${Math.round(minutesDiff * 100) / 100} minutes`, 
        400
      );
    }
  }

  public static validateAnswerCount(answersCount: number, totalQuestions: number) {
    if (answersCount > totalQuestions) {
      throw new CustomError("Too many answers provided", 400);
    }
  }
}
