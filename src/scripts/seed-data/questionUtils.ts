import { PrismaClient } from "../../generated/prisma";

type OptionOverrides = Record<string, string> | undefined;

export function buildMCQ(
  prefix: string,
  count: number,
  correctOption: string = "A",
  optionOverrides: OptionOverrides = undefined
) {
  const options =
    optionOverrides ?? {
      A: "Option A",
      B: "Option B",
      C: "Option C",
      D: "Option D",
    };

  return Array.from({ length: count }, (_, index) => ({
    question: `${prefix} Question ${index + 1}`,
    options,
    answer: correctOption,
    orderIndex: index + 1,
  }));
}

function fallbackOption(correct: string) {
  const options = ["A", "B", "C", "D"];
  return options.find((option) => option !== correct) ?? "A";
}

interface RecordAnswersParams {
  prisma: PrismaClient;
  resultId: number;
  testId: number;
  correctCount: number;
}

export async function recordApplicantAnswers({
  prisma,
  resultId,
  testId,
  correctCount,
}: RecordAnswersParams) {
  const questions = await prisma.preselectionQuestion.findMany({
    where: { testId },
    orderBy: { orderIndex: "asc" },
  });

  if (!questions.length) {
    return;
  }

  const data = questions.map((question, index) => {
    const correct = question.answer;
    const selected = index < correctCount ? correct : fallbackOption(correct);

    return {
      resultId,
      questionId: question.id,
      selected,
      isCorrect: index < correctCount,
    };
  });

  await prisma.applicantAnswer.createMany({ data });
}

