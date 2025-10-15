"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsQueryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentResultsQueryRepository {
    // Get user's result for specific assessment
    static async getUserResult(userId, assessmentId) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { userId, assessmentId },
            include: {
                assessment: { select: { id: true, title: true, description: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get all results for an assessment
    static async getAssessmentResults(assessmentId) {
        return await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { score: "desc" },
        });
    }
    // Get user's all results with pagination
    static async getUserResults(userId, page, limit) {
        const query = {
            where: { userId },
            include: {
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        creator: { select: { id: true, name: true } },
                        badgeTemplate: {
                            select: {
                                id: true,
                                name: true,
                                icon: true,
                                category: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        };
        if (page && limit) {
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        const [results, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany(query),
            prisma_1.prisma.skillResult.count({ where: { userId } }),
        ]);
        return {
            results,
            pagination: page && limit
                ? { page, limit, total, totalPages: Math.ceil(total / limit) }
                : null,
        };
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit) {
        const query = {
            where: { assessmentId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        };
        if (limit)
            query.take = limit;
        return await prisma_1.prisma.skillResult.findMany(query);
    }
    // Get user assessment history
    static async getUserAssessmentHistory(userId) {
        const results = await prisma_1.prisma.skillResult.findMany({
            where: { userId },
            include: {
                assessment: { select: { id: true, title: true } },
            },
        });
        const passedCount = results.filter((r) => r.isPassed).length;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        return {
            results,
            statistics: {
                totalAssessments: results.length,
                passedAssessments: passedCount,
                averageScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
                passRate: results.length > 0
                    ? Math.round((passedCount / results.length) * 100)
                    : 0,
            },
        };
    }
}
exports.AssessmentResultsQueryRepository = AssessmentResultsQueryRepository;
//# sourceMappingURL=assessmentResultsQuery.repository.js.map