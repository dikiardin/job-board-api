"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeProgressService = void 0;
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
class BadgeProgressService {
    static async getBadgeAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access badge analytics", 403);
        }
        return {
            totalBadgesAwarded: 120,
            badgesThisMonth: 18,
            topBadges: [
                { title: "JavaScript Expert", awarded: 35 },
                { title: "Python Master", awarded: 28 },
                { title: "React Specialist", awarded: 22 },
            ],
            badgesByCategory: {
                programming: 85,
                frameworks: 25,
                databases: 10,
            },
        };
    }
    static async getBadgeLeaderboard(badgeTemplateId, limit = 10) {
        return {
            leaderboard: [
                { userId: 1, userName: "John Doe", score: 98, earnedAt: new Date() },
                { userId: 2, userName: "Jane Smith", score: 95, earnedAt: new Date() },
            ],
            badgeTemplate: {
                title: "JavaScript Expert",
                description: "Mastered JavaScript fundamentals",
            },
        };
    }
    static async getUserBadgeProgress(userId) {
        return {
            earnedBadges: 3,
            availableBadges: 12,
            progressPercentage: 25,
            nextBadges: [
                {
                    badgeTemplate: {
                        title: "React Specialist",
                        description: "Master React development",
                        imageUrl: "/badges/react.png",
                    },
                    requirements: {
                        assessmentTitle: "React Assessment",
                        minimumScore: 75,
                    },
                    progress: 0,
                },
                {
                    badgeTemplate: {
                        title: "Node.js Expert",
                        description: "Backend development with Node.js",
                        imageUrl: "/badges/nodejs.png",
                    },
                    requirements: {
                        assessmentTitle: "Node.js Assessment",
                        minimumScore: 75,
                    },
                    progress: 0,
                },
            ],
        };
    }
}
exports.BadgeProgressService = BadgeProgressService;
