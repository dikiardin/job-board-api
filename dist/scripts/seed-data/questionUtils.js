"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMCQ = buildMCQ;
exports.recordApplicantAnswers = recordApplicantAnswers;
function buildMCQ(prefix, count, correctOption = "A", optionOverrides = undefined) {
    const options = optionOverrides ?? {
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
function fallbackOption(correct) {
    const options = ["A", "B", "C", "D"];
    return options.find((option) => option !== correct) ?? "A";
}
async function recordApplicantAnswers({ prisma, resultId, testId, correctCount, }) {
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
//# sourceMappingURL=questionUtils.js.map