"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeCoreService = void 0;
const prisma_1 = require("../../config/prisma");
const customError_1 = require("../../utils/customError");
class BadgeCoreService {
    static async getUserBadges(userId) {
        const badges = await prisma_1.prisma.userBadge.findMany({
            where: {
                userId,
                badgeTemplateId: { not: null },
            },
            include: {
                badgeTemplate: {
                    select: {
                        name: true,
                        icon: true,
                        description: true,
                        category: true,
                    },
                },
                assessment: {
                    select: {
                        title: true,
                        id: true,
                    },
                },
            },
            orderBy: { earnedAt: "desc" },
        });
        // Get scores from skill results
        const badgesWithScores = await Promise.all(badges.map(async (badge) => {
            let score = 0;
            if (badge.assessmentId) {
                const result = await prisma_1.prisma.skillResult.findFirst({
                    where: {
                        userId,
                        assessmentId: badge.assessmentId,
                        isPassed: true,
                    },
                    select: { score: true },
                    orderBy: { score: "desc" },
                });
                score = result?.score || 0;
            }
            return {
                id: badge.id,
                badgeTemplate: {
                    title: badge.badgeTemplate?.name || "",
                    description: badge.badgeTemplate?.description || "",
                    imageUrl: badge.badgeTemplate?.icon || "",
                },
                earnedAt: badge.earnedAt,
                score,
                assessment: badge.assessment,
            };
        }));
        return {
            badges: badgesWithScores,
            totalBadges: badgesWithScores.length,
        };
    }
    static async getBadgeDetails(badgeId) {
        const badge = await prisma_1.prisma.userBadge.findUnique({
            where: { id: badgeId },
            include: {
                badgeTemplate: true,
                assessment: {
                    select: {
                        title: true,
                        id: true,
                    },
                },
            },
        });
        if (!badge) {
            throw new customError_1.CustomError("Badge not found", 404);
        }
        // Get score from skill result
        let score = 0;
        if (badge.assessmentId) {
            const result = await prisma_1.prisma.skillResult.findFirst({
                where: {
                    userId: badge.userId,
                    assessmentId: badge.assessmentId,
                    isPassed: true,
                },
                select: { score: true },
                orderBy: { score: "desc" },
            });
            score = result?.score || 0;
        }
        return {
            id: badge.id,
            badgeTemplate: {
                title: badge.badgeTemplate?.name || "",
                description: badge.badgeTemplate?.description || "",
                imageUrl: badge.badgeTemplate?.icon || "",
            },
            userId: badge.userId,
            earnedAt: badge.earnedAt,
            score,
            assessment: badge.assessment,
        };
    }
    /**
     * Award badge to user
     */
    static async awardBadge(data) {
        const existingBadge = await this.checkExistingBadge(data.userId, data.badgeTemplateId);
        if (existingBadge) {
            throw new customError_1.CustomError("User already has this badge", 400);
        }
        const newBadge = await prisma_1.prisma.userBadge.create({
            data: {
                userId: data.userId,
                badgeTemplateId: data.badgeTemplateId,
                assessmentId: data.assessmentId,
                earnedAt: new Date(),
                badgeType: "skill",
            },
        });
        return newBadge;
    }
    static async checkExistingBadge(userId, badgeTemplateId) {
        return await prisma_1.prisma.userBadge.findFirst({
            where: {
                userId,
                badgeTemplateId,
            },
        });
    }
    static async getUserBadgeStats(userId) {
        const badges = await this.getUserBadges(userId);
        const avgScore = badges.badges.length > 0
            ? badges.badges.reduce((sum, b) => sum + b.score, 0) /
                badges.badges.length
            : 0;
        return {
            totalBadges: badges.totalBadges,
            averageScore: Math.round(avgScore),
            latestBadge: badges.badges[0] || null,
            badgesByMonth: this.getBadgesByMonth(badges.badges),
        };
    }
    static getBadgesByMonth(badges) {
        const grouped = badges.reduce((acc, badge) => {
            const month = new Date(badge.earnedAt).toISOString().substring(0, 7);
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(grouped).map(([month, count]) => ({
            month,
            count,
        }));
    }
}
exports.BadgeCoreService = BadgeCoreService;
