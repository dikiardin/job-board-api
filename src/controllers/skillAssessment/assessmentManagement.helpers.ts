interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuestionValidationResult {
  valid: boolean;
  error?: string;
}

export const validateSingleQuestion = (
  q: Question,
  index: number
): QuestionValidationResult => {
  if (!q.question || !q.question.trim()) {
    return {
      valid: false,
      error: `Question ${index + 1}: Question text is required`,
    };
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return {
      valid: false,
      error: `Question ${index + 1}: Must have exactly 4 options`,
    };
  }

  if (!q.answer || !q.answer.trim()) {
    return {
      valid: false,
      error: `Question ${index + 1}: Answer is required`,
    };
  }

  if (!q.options.includes(q.answer)) {
    return {
      valid: false,
      error: `Question ${index + 1}: Answer must be one of the options`,
    };
  }

  return { valid: true };
};

export const validateQuestionsArray = (
  questions: Question[]
): QuestionValidationResult => {
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (!question) continue; // Type guard

    const result = validateSingleQuestion(question, i);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
};
