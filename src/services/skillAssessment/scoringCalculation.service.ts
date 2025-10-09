export class ScoringCalculationService {
  private static readonly DEFAULT_PASSING_SCORE = 75;

  public static calculateScore(
    questions: Array<{ id: number; answer: string }>,
    userAnswers: Array<{ questionId: number; answer: string }>
  ) {
    if (!questions || !userAnswers || questions.length === 0) {
      return { score: 0, correctAnswers: 0, totalQuestions: 0 };
    }

    const correctAnswers = ScoringCalculationService.countCorrectAnswers(questions, userAnswers);
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return { score, correctAnswers, totalQuestions };
  }

  private static countCorrectAnswers(
    questions: Array<{ id: number; answer: string }>,
    userAnswers: Array<{ questionId: number; answer: string }>
  ): number {
    const answerMap = new Map();
    userAnswers.forEach(ua => answerMap.set(ua.questionId, ua.answer));

    let correctAnswers = 0;
    questions.forEach((question) => {
      const userAnswer = answerMap.get(question.id);
      
      if (userAnswer && userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
        correctAnswers++;
      }
    });

    return correctAnswers;
  }

  public static isPassed(score: number, passScore?: number): boolean {
    const requiredScore = passScore ?? this.DEFAULT_PASSING_SCORE;
    return score >= requiredScore;
  }

  public static getPassingScore(passScore?: number): number {
    return passScore ?? this.DEFAULT_PASSING_SCORE;
  }

  public static calculateTimeEfficiency(timeSpent: number, timeLimit: number) {
    const efficiency = Math.round(((timeLimit - timeSpent) / timeLimit) * 100);
    
    if (efficiency >= 50) {
      return { efficiency, rating: "EXCELLENT", description: "Very efficient completion!" };
    } else if (efficiency >= 25) {
      return { efficiency, rating: "GOOD", description: "Good time management." };
    } else if (efficiency >= 0) {
      return { efficiency, rating: "ADEQUATE", description: "Used most available time." };
    } else {
      return { efficiency: 0, rating: "OVERTIME", description: "Completed over time limit." };
    }
  }
}
