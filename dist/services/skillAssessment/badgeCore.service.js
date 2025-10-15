"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeCoreService = void 0;
const customError_1 = require("../../utils/customError");
class BadgeCoreService {
    static async getUserBadges(userId) {
        return {
            badges: [{
                    id: 1,
                    badgeTemplate: {
                        title: "JavaScript Expert",
                        description: "Mastered JavaScript fundamentals",
                        imageUrl: "/badges/javascript.png",
                    },
                    earnedAt: new Date(),
                    score: 95,
                }],
            totalBadges: 1,
        };
    }
    static async getBadgeDetails(badgeId) {
        return {
            id: badgeId,
            badgeTemplate: {
                title: "JavaScript Expert",
                description: "Mastered JavaScript fundamentals",
                imageUrl: "/badges/javascript.png",
            },
            userId: 1,
            earnedAt: new Date(),
            score: 95,
            assessment: {
                title: "JavaScript Assessment",
            },
        };
    }
    static async awardBadge(data) {
        const existingBadge = await BadgeCoreService.checkExistingBadge(data.userId, data.badgeTemplateId);
        if (existingBadge) {
            throw new customError_1.CustomError("User already has this badge", 400);
        }
        return {
            id: Date.now(),
            userId: data.userId,
            badgeTemplateId: data.badgeTemplateId,
            assessmentId: data.assessmentId,
            score: data.score,
            earnedAt: new Date(),
        };
    }
    static async checkExistingBadge(userId, badgeTemplateId) {
        return null; // Mock check - would typically query database
    }
    static async getUserBadgeStats(userId) {
        const badges = await BadgeCoreService.getUserBadges(userId);
        return {
            totalBadges: badges.totalBadges,
            averageScore: badges.badges.reduce((sum, badge) => sum + badge.score, 0) / badges.badges.length || 0,
            latestBadge: badges.badges[0] || null,
            badgesByMonth: BadgeCoreService.getBadgesByMonth(badges.badges),
        };
    }
    static getBadgesByMonth(badges) {
        const grouped = badges.reduce((acc, badge) => {
            const month = badge.earnedAt.toISOString().substring(0, 7);
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(grouped).map(([month, count]) => ({ month, count }));
    }
}
exports.BadgeCoreService = BadgeCoreService;
//# sourceMappingURL=badgeCore.service.js.map