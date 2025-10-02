"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentScoringService = void 0;
class AssessmentScoringService {
    // Calculate assessment score
    static calculateScore(questions, userAnswers) {
        if (!questions || !userAnswers || questions.length === 0) {
            return { score: 0, correctAnswers: 0, totalQuestions: 0 };
        }
        let correctAnswers = 0;
        const totalQuestions = questions.length;
        // Create a map for faster lookup
        const answerMap = new Map();
        userAnswers.forEach(ua => {
            answerMap.set(ua.questionId, ua.answer);
        });
        // Check each question
        questions.forEach((question, index) => {
            const questionId = index + 1; // Assuming 1-based indexing
            const userAnswer = answerMap.get(questionId);
            if (userAnswer && userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
                correctAnswers++;
            }
        });
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        return {
            score,
            correctAnswers,
            totalQuestions,
        };
    }
    // Check if assessment is passed
    static isPassed(score) {
        return score >= this.PASSING_SCORE;
    }
    // Get performance level based on score
    static getPerformanceLevel(score) {
        if (score >= 95) {
            return {
                level: "EXCEPTIONAL",
                color: "#10b981",
                description: "Outstanding performance! You've mastered this topic.",
            };
        }
        else if (score >= 85) {
            return {
                level: "EXCELLENT",
                color: "#059669",
                description: "Excellent work! You have a strong understanding.",
            };
        }
        else if (score >= 75) {
            return {
                level: "GOOD",
                color: "#0891b2",
                description: "Good job! You've passed the assessment.",
            };
        }
        else if (score >= 60) {
            return {
                level: "FAIR",
                color: "#ea580c",
                description: "Fair performance. Consider reviewing the material.",
            };
        }
        else {
            return {
                level: "NEEDS IMPROVEMENT",
                color: "#dc2626",
                description: "Keep practicing! Review the study materials and try again.",
            };
        }
    }
    // Get improvement recommendations based on score
    static getImprovementRecommendations(score) {
        if (score >= 95) {
            return [
                "Excellent work! You've mastered this topic.",
                "Consider helping others learn this subject.",
                "Look into advanced topics in this area.",
                "Share your knowledge with the community.",
            ];
        }
        else if (score >= 85) {
            return [
                "Great job! You have a strong understanding.",
                "Review any questions you missed for deeper learning.",
                "Consider exploring related advanced topics.",
                "You're ready for more challenging assessments.",
            ];
        }
        else if (score >= 75) {
            return [
                "Congratulations on passing!",
                "Review the questions you got wrong to improve further.",
                "Practice similar problems to strengthen your skills.",
                "Consider taking more advanced assessments.",
            ];
        }
        else if (score >= 60) {
            return [
                "You're close to passing! Keep practicing.",
                "Focus on the areas where you struggled.",
                "Review the study materials thoroughly.",
                "Practice more challenging problems.",
                "Review the questions you got wrong.",
            ];
        }
        else {
            return [
                "Don't give up! Review the study materials.",
                "Practice with easier problems first.",
                "Consider taking a preparatory course.",
                "You can retake this assessment when ready.",
            ];
        }
    }
    // Calculate detailed score breakdown
    static getDetailedScoreBreakdown(questions, userAnswers) {
        const breakdown = {
            overall: this.calculateScore(questions, userAnswers),
            categories: new Map(),
        };
        // Group by category if available
        if (questions.some(q => q.category)) {
            const answerMap = new Map();
            userAnswers.forEach(ua => {
                answerMap.set(ua.questionId, ua.answer);
            });
            questions.forEach((question, index) => {
                const category = question.category || 'General';
                const questionId = index + 1;
                const userAnswer = answerMap.get(questionId);
                const isCorrect = userAnswer &&
                    userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
                if (!breakdown.categories.has(category)) {
                    breakdown.categories.set(category, { correct: 0, total: 0, percentage: 0 });
                }
                const categoryStats = breakdown.categories.get(category);
                categoryStats.total++;
                if (isCorrect) {
                    categoryStats.correct++;
                }
                categoryStats.percentage = Math.round((categoryStats.correct / categoryStats.total) * 100);
            });
        }
        return breakdown;
    }
    // Validate user answers format
    static validateAnswers(answers, expectedQuestionCount) {
        const errors = [];
        if (!answers || !Array.isArray(answers)) {
            errors.push("Answers must be provided as an array");
            return { isValid: false, errors };
        }
        if (answers.length !== expectedQuestionCount) {
            errors.push(`Expected ${expectedQuestionCount} answers, but received ${answers.length}`);
        }
        // Check for duplicate question IDs
        const questionIds = new Set();
        answers.forEach((answer, index) => {
            if (!answer.questionId || typeof answer.questionId !== 'number') {
                errors.push(`Answer ${index + 1}: questionId must be a valid number`);
            }
            if (!answer.answer || typeof answer.answer !== 'string' || answer.answer.trim().length === 0) {
                errors.push(`Answer ${index + 1}: answer must be a non-empty string`);
            }
            if (questionIds.has(answer.questionId)) {
                errors.push(`Duplicate answer for question ${answer.questionId}`);
            }
            else {
                questionIds.add(answer.questionId);
            }
        });
        // Check for missing question IDs (should be 1 to expectedQuestionCount)
        for (let i = 1; i <= expectedQuestionCount; i++) {
            if (!questionIds.has(i)) {
                errors.push(`Missing answer for question ${i}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    // Get passing score threshold
    static getPassingScore() {
        return this.PASSING_SCORE;
    }
    // Calculate time efficiency score
    static calculateTimeEfficiency(timeSpent, timeLimit) {
        const efficiency = Math.round(((timeLimit - timeSpent) / timeLimit) * 100);
        if (efficiency >= 50) {
            return {
                efficiency,
                rating: "EXCELLENT",
                description: "You completed the assessment very efficiently!",
            };
        }
        else if (efficiency >= 25) {
            return {
                efficiency,
                rating: "GOOD",
                description: "Good time management on this assessment.",
            };
        }
        else if (efficiency >= 0) {
            return {
                efficiency,
                rating: "ADEQUATE",
                description: "You used most of the available time.",
            };
        }
        else {
            return {
                efficiency: 0,
                rating: "OVERTIME",
                description: "Assessment was completed over the time limit.",
            };
        }
    }
}
exports.AssessmentScoringService = AssessmentScoringService;
AssessmentScoringService.PASSING_SCORE = 75;
//# sourceMappingURL=assessmentScoring.service.js.map