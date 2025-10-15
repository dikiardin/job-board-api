"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionScoringService = void 0;
class AssessmentExecutionScoringService {
    // Calculate assessment score
    static calculateScore(questions, userAnswers) {
        let correctAnswers = 0;
        const totalQuestions = questions.length;
        // Create map for quick lookup
        const answerMap = new Map(userAnswers.map((ua) => [ua.questionId, ua.answer]));
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
    static getPassingScore(assessmentPassScore) {
        return assessmentPassScore || 75;
    }
}
exports.AssessmentExecutionScoringService = AssessmentExecutionScoringService;
//# sourceMappingURL=assessmentExecutionScoring.service.js.map