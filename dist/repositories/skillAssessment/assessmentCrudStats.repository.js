"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCrudStatsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentCrudStatsRepository {
    // Get assessment statistics
    static async getAssessmentStats() {
        const [totalAssessments, totalQuestions, totalResults] = await Promise.all([
            prisma_1.prisma.skillAssessment.count(),
            prisma_1.prisma.skillQuestion.count(),
            prisma_1.prisma.skillResult.count(),
        ]);
        return { totalAssessments, totalQuestions, totalResults };
    }
}
exports.AssessmentCrudStatsRepository = AssessmentCrudStatsRepository;
