export class AssessmentExecutionScoringService {
  // Calculate assessment score
  public static calculateScore(
    questions: Array<{ id: number; answer: string }>,
    userAnswers: Array<{ questionId: number; answer: string }>
  ) {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    // Create map for quick lookup
    const answerMap = new Map(
      userAnswers.map((ua) => [ua.questionId, ua.answer])
    );

    // Check each question
    questions.forEach((question) => {
      const userAnswer = answerMap.get(question.id);
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    });

    // Calculate percentage score
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      score,
      correctAnswers,
      totalQuestions,
    };
  }

  // Get passing score threshold
  public static getPassingScore(assessmentPassScore?: number): number {
    return assessmentPassScore || 75;
  }
}
