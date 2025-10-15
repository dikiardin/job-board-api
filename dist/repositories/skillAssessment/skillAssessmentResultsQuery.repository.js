"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentResultsQueryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class SkillAssessmentResultsQueryRepository {
    // Get result by slug
    static async getResultBySlug(slug) {
        return await prisma_1.prisma.skillResult.findUnique({
            where: { slug },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assessment: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        description: true,
                        passScore: true,
                        creator: { select: { id: true, name: true } },
                        badgeTemplate: {
                            select: { id: true, name: true, icon: true, category: true },
                        },
                    },
                },
            },
        });
    }
    // Get user's assessment result for specific assessment
    static async getUserResult(userId, assessmentId) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { userId, assessmentId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true, passScore: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get user's all assessment results
    static async getUserResults(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [results, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    assessment: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            passScore: true,
                            creator: {
                                select: { id: true, name: true },
                            },
                            badgeTemplate: {
                                select: { id: true, name: true, icon: true, category: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.skillResult.count({ where: { userId } }),
        ]);
        return {
            results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get assessment results for developer
    static async getAssessmentResults(assessmentId, createdBy) {
        const assessment = await prisma_1.prisma.skillAssessment.findFirst({
            where: { id: assessmentId, createdBy },
        });
        if (!assessment)
            return null;
        return await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { score: "desc" },
        });
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit = 10) {
        return await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            take: limit,
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
            orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        });
    }
    // Get user assessment attempts for a specific assessment
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return await prisma_1.prisma.skillResult.findMany({
            where: {
                userId,
                assessmentId,
            },
            select: {
                id: true,
                assessmentId: true,
                userId: true,
                createdAt: true,
                score: true,
                isPassed: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.SkillAssessmentResultsQueryRepository = SkillAssessmentResultsQueryRepository;
//# sourceMappingURL=skillAssessmentResultsQuery.repository.js.map