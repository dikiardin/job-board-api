"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const skillAssessmentResults_repository_1 = require("../../repositories/skillAssessment/skillAssessmentResults.repository");
const customError_1 = require("../../utils/customError");
class AssessmentResultsService {
    static async getUserResults(userId, page = 1, limit = 10) {
        try {
            const result = await skillAssessmentResults_repository_1.SkillAssessmentResultsRepository.getUserResults(userId, page, limit);
            return result;
        }
        catch (error) {
            if (process.env.NODE_ENV !== "production")
                console.error("Error getting user results:", error);
            throw new customError_1.CustomError("Failed to retrieve assessment results", 500);
        }
    }
    static async getAssessmentResult(userId, assessmentId) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (!result)
            throw new customError_1.CustomError("Assessment result not found", 404);
        return result;
    }
    static async getAssessmentStatistics(assessmentId, createdBy) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
    }
    static async getAssessmentSummary(assessmentId, createdBy) {
        const stats = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId, createdBy);
        if (!stats || !Array.isArray(stats) || stats.length === 0) {
            return { totalAttempts: 0, averageScore: 0, passRate: 0 };
        }
        return {
            totalAttempts: stats.length,
            averageScore: stats.reduce((sum, result) => sum + (result.score || 0), 0) / stats.length,
            passRate: (stats.filter((result) => result.isPassed).length / stats.length) * 100,
        };
    }
    static async resetAssessment(userId, assessmentId) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (existingResult && existingResult.isPassed) {
            throw new customError_1.CustomError("Cannot retake a passed assessment", 400);
        }
        return { message: "Assessment reset successfully. You can now retake it." };
    }
    static async canRetakeAssessment(userId, assessmentId) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        return !existingResult || !existingResult.isPassed;
    }
    static async getUserAssessmentHistory(userId) {
        return { totalAssessments: 0, passedAssessments: 0, failedAssessments: 0, averageScore: 0, recentResults: [] };
    }
    static async getPerformanceAnalytics(userId) {
        return { totalAttempts: 0, passRate: 0, averageScore: 0, strongAreas: [], improvementAreas: [], monthlyProgress: [] };
    }
    static async getCertificateInfo(userId, assessmentId) {
        const result = await this.getAssessmentResult(userId, assessmentId);
        if (!result)
            throw new customError_1.CustomError("Assessment result not found", 404);
        if (!result.isPassed)
            throw new customError_1.CustomError("Certificate only available for passed assessments", 400);
        return { certificateCode: result.certificateCode, certificateUrl: result.certificateUrl, issuedAt: result.createdAt, score: result.score };
    }
    static getAssessmentFeedback(score, correctAnswers, totalQuestions, assessmentPassScore) {
        const percentage = (correctAnswers / totalQuestions) * 100;
        let feedback = { overall: "", strengths: [], improvements: [], nextSteps: [] };
        if (score >= 95) {
            feedback.overall = "Exceptional performance! You have mastered this skill area.";
            feedback.strengths = ["Outstanding knowledge", "Excellent problem-solving", "Strong fundamentals"];
            feedback.nextSteps = ["Consider advanced topics", "Mentor others", "Take leadership roles"];
        }
        else if (score >= 85) {
            feedback.overall = "Great job! You have strong knowledge in this area.";
            feedback.strengths = ["Good understanding", "Solid foundation", "Above average performance"];
            feedback.improvements = ["Review missed concepts", "Practice edge cases"];
            feedback.nextSteps = ["Explore advanced topics", "Apply knowledge in projects"];
        }
        else if (score >= (assessmentPassScore || 75)) {
            feedback.overall = "Well done! You've successfully passed this assessment.";
            feedback.strengths = ["Basic understanding achieved", "Met minimum requirements"];
            feedback.improvements = ["Strengthen weak areas", "Practice more problems"];
            feedback.nextSteps = ["Continue practicing", "Review study materials"];
        }
        else {
            feedback.overall = "Keep practicing! You can retake this assessment when ready.";
            feedback.improvements = ["Review fundamental concepts", "Practice basic problems", "Study recommended materials"];
            feedback.nextSteps = ["Take preparatory courses", "Practice with easier problems", "Retake when confident"];
        }
        return feedback;
    }
    static calculateScoreBreakdown(answers) {
        const totalQuestions = answers.length;
        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const topicBreakdown = answers.reduce((acc, answer) => {
            const topic = answer.topic || "General";
            if (!acc[topic])
                acc[topic] = { correct: 0, total: 0 };
            acc[topic].total++;
            if (answer.isCorrect)
                acc[topic].correct++;
            return acc;
        }, {});
        return {
            overallScore: score, correctAnswers, totalQuestions, accuracy: (correctAnswers / totalQuestions) * 100,
            topicBreakdown: Object.entries(topicBreakdown).map(([topic, stats]) => ({
                topic, correct: stats.correct, total: stats.total, percentage: (stats.correct / stats.total) * 100,
            })),
        };
    }
    static getPassingScore(assessmentPassScore) {
        return assessmentPassScore || 75;
    }
    static isPassingScore(score, assessmentPassScore) {
        const passScore = assessmentPassScore || 75;
        return score >= passScore;
    }
}
exports.AssessmentResultsService = AssessmentResultsService;
//# sourceMappingURL=assessmentResults.service.js.map