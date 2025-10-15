"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringCalculationService = void 0;
class ScoringCalculationService {
    static calculateScore(questions, userAnswers) {
        if (!questions || !userAnswers || questions.length === 0) {
            return { score: 0, correctAnswers: 0, totalQuestions: 0 };
        }
        const correctAnswers = ScoringCalculationService.countCorrectAnswers(questions, userAnswers);
        const totalQuestions = questions.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        return { score, correctAnswers, totalQuestions };
    }
    static countCorrectAnswers(questions, userAnswers) {
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
    static isPassed(score, passScore) {
        const requiredScore = passScore ?? this.DEFAULT_PASSING_SCORE;
        return score >= requiredScore;
    }
    static getPassingScore(passScore) {
        return passScore ?? this.DEFAULT_PASSING_SCORE;
    }
    static calculateTimeEfficiency(timeSpent, timeLimit) {
        const efficiency = Math.round(((timeLimit - timeSpent) / timeLimit) * 100);
        if (efficiency >= 50) {
            return { efficiency, rating: "EXCELLENT", description: "Very efficient completion!" };
        }
        else if (efficiency >= 25) {
            return { efficiency, rating: "GOOD", description: "Good time management." };
        }
        else if (efficiency >= 0) {
            return { efficiency, rating: "ADEQUATE", description: "Used most available time." };
        }
        else {
            return { efficiency: 0, rating: "OVERTIME", description: "Completed over time limit." };
        }
    }
}
exports.ScoringCalculationService = ScoringCalculationService;
ScoringCalculationService.DEFAULT_PASSING_SCORE = 75;
//# sourceMappingURL=scoringCalculation.service.js.map