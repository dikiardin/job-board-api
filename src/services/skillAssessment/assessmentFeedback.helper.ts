export const getAssessmentFeedback = (
  score: number,
  correctAnswers: number,
  totalQuestions: number,
  assessmentPassScore?: number
) => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  let feedback = {
    overall: "",
    strengths: [] as string[],
    improvements: [] as string[],
    nextSteps: [] as string[],
  };

  if (score >= 95) {
    feedback.overall =
      "Exceptional performance! You have mastered this skill area.";
    feedback.strengths = [
      "Outstanding knowledge",
      "Excellent problem-solving",
      "Strong fundamentals",
    ];
    feedback.nextSteps = [
      "Consider advanced topics",
      "Mentor others",
      "Take leadership roles",
    ];
  } else if (score >= 85) {
    feedback.overall = "Great job! You have strong knowledge in this area.";
    feedback.strengths = [
      "Good understanding",
      "Solid foundation",
      "Above average performance",
    ];
    feedback.improvements = ["Review missed concepts", "Practice edge cases"];
    feedback.nextSteps = [
      "Explore advanced topics",
      "Apply knowledge in projects",
    ];
  } else if (score >= (assessmentPassScore || 75)) {
    feedback.overall = "Well done! You've successfully passed this assessment.";
    feedback.strengths = [
      "Basic understanding achieved",
      "Met minimum requirements",
    ];
    feedback.improvements = ["Strengthen weak areas", "Practice more problems"];
    feedback.nextSteps = ["Continue practicing", "Review study materials"];
  } else {
    feedback.overall =
      "Keep practicing! You can retake this assessment when ready.";
    feedback.improvements = [
      "Review fundamental concepts",
      "Practice basic problems",
      "Study recommended materials",
    ];
    feedback.nextSteps = [
      "Take preparatory courses",
      "Practice with easier problems",
      "Retake when confident",
    ];
  }

  return feedback;
};

export const calculateScoreBreakdown = (
  answers: Array<{
    questionId: number;
    answer: string;
    isCorrect: boolean;
    topic?: string;
  }>
) => {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const topicBreakdown = answers.reduce((acc, answer) => {
    const topic = answer.topic || "General";
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0 };
    }
    acc[topic].total++;
    if (answer.isCorrect) {
      acc[topic].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  return {
    overallScore: score,
    correctAnswers,
    totalQuestions,
    accuracy: (correctAnswers / totalQuestions) * 100,
    topicBreakdown: Object.entries(topicBreakdown).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: (stats.correct / stats.total) * 100,
    })),
  };
};

export const getPassingScore = (assessmentPassScore?: number): number => {
  return assessmentPassScore || 75;
};

export const isPassingScore = (
  score: number,
  assessmentPassScore?: number
): boolean => {
  const passScore = assessmentPassScore || 75;
  return score >= passScore;
};
