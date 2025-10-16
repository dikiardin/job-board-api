"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentResultsStatsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class SkillAssessmentResultsStatsRepository {
    // Get assessment statistics
    static async getAssessmentStats(assessmentId) {
        const results = await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            select: {
                score: true,
                isPassed: true,
                startedAt: true,
                finishedAt: true,
            },
        });
        if (results.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                passRate: 0,
                averageTimeSpent: 0,
            };
        }
        const totalAttempts = results.length;
        const passedAttempts = results.filter((r) => r.isPassed).length;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        // Calculate time spent from startedAt and finishedAt
        const totalTime = results.reduce((sum, r) => {
            if (r.startedAt && r.finishedAt) {
                const timeSpent = Math.round((r.finishedAt.getTime() - r.startedAt.getTime()) / 1000 / 60); // in minutes
                return sum + timeSpent;
            }
            return sum + 30; // default 30 minutes if no time data
        }, 0);
        return {
            totalAttempts,
            averageScore: Math.round(totalScore / totalAttempts),
            passRate: Math.round((passedAttempts / totalAttempts) * 100),
            averageTimeSpent: Math.round(totalTime / totalAttempts),
        };
    }
}
exports.SkillAssessmentResultsStatsRepository = SkillAssessmentResultsStatsRepository;
