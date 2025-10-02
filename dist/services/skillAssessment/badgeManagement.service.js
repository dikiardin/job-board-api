"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeManagementService = void 0;
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
class BadgeManagementService {
    // Get user's badges
    static async getUserBadges(userId) {
        // Mock implementation - would typically call BadgeService
        return {
            badges: [
                {
                    id: 1,
                    badgeTemplate: {
                        title: "JavaScript Expert",
                        description: "Mastered JavaScript fundamentals",
                        imageUrl: "/badges/javascript.png",
                    },
                    earnedAt: new Date(),
                    score: 95,
                },
            ],
            totalBadges: 1,
        };
    }
    // Get badge details
    static async getBadgeDetails(badgeId) {
        // Mock implementation
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
    // Verify badge authenticity
    static async verifyBadge(badgeId, userId) {
        const badge = await this.getBadgeDetails(badgeId);
        if (!badge) {
            throw new customError_1.CustomError("Badge not found", 404);
        }
        if (badge.userId !== userId) {
            throw new customError_1.CustomError("Badge does not belong to this user", 403);
        }
        return {
            isValid: true,
            badge: {
                id: badge.id,
                title: badge.badgeTemplate.title,
                description: badge.badgeTemplate.description,
                imageUrl: badge.badgeTemplate.imageUrl,
                earnedAt: badge.earnedAt,
                assessmentTitle: badge.assessment?.title,
                score: badge.score,
            },
        };
    }
    // Get badge analytics (Developer only)
    static async getBadgeAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access badge analytics", 403);
        }
        // Mock analytics
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
    // Award badge to user
    static async awardBadge(data) {
        // Check if user already has this badge
        const existingBadge = await this.checkExistingBadge(data.userId, data.badgeTemplateId);
        if (existingBadge) {
            throw new customError_1.CustomError("User already has this badge", 400);
        }
        // Award the badge
        return {
            id: Date.now(),
            userId: data.userId,
            badgeTemplateId: data.badgeTemplateId,
            assessmentId: data.assessmentId,
            score: data.score,
            earnedAt: new Date(),
        };
    }
    // Check if user already has a specific badge
    static async checkExistingBadge(userId, badgeTemplateId) {
        // Mock check - would typically query database
        return null; // No existing badge found
    }
    // Get badge leaderboard
    static async getBadgeLeaderboard(badgeTemplateId, limit = 10) {
        // Mock leaderboard
        return {
            leaderboard: [
                {
                    userId: 1,
                    userName: "John Doe",
                    score: 98,
                    earnedAt: new Date(),
                },
                {
                    userId: 2,
                    userName: "Jane Smith",
                    score: 95,
                    earnedAt: new Date(),
                },
            ],
            badgeTemplate: {
                title: "JavaScript Expert",
                description: "Mastered JavaScript fundamentals",
            },
        };
    }
    // Get badge requirements
    static async getBadgeRequirements(badgeTemplateId) {
        // Mock requirements
        return {
            badgeTemplate: {
                title: "JavaScript Expert",
                description: "Mastered JavaScript fundamentals",
                imageUrl: "/badges/javascript.png",
            },
            requirements: {
                minimumScore: 75,
                assessmentTitle: "JavaScript Assessment",
                prerequisiteBadges: [],
                validityPeriod: "2 years",
            },
            benefits: [
                "Showcase JavaScript expertise on profile",
                "Access to advanced JavaScript resources",
                "Priority consideration for JavaScript roles",
            ],
        };
    }
    // Revoke badge (Developer only)
    static async revokeBadge(badgeId, reason, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can revoke badges", 403);
        }
        return {
            success: true,
            message: "Badge revoked successfully",
            badgeId,
            reason,
            revokedAt: new Date(),
        };
    }
    // Get user's badge progress
    static async getUserBadgeProgress(userId) {
        // Mock progress data
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
    // Share badge to social media
    static async shareBadge(badgeId, platform, userId) {
        const badge = await this.getBadgeDetails(badgeId);
        if (badge.userId !== userId) {
            throw new customError_1.CustomError("You can only share your own badges", 403);
        }
        const shareUrl = `${process.env.FRONTEND_URL}/badges/${badgeId}`;
        const shareText = `I just earned the "${badge.badgeTemplate.title}" badge! 🏆`;
        const shareLinks = {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        };
        if (!shareLinks[platform]) {
            throw new customError_1.CustomError("Unsupported social media platform", 400);
        }
        return {
            shareUrl: shareLinks[platform],
            platform,
            badgeUrl: shareUrl,
        };
    }
    // Get badge statistics for user
    static async getUserBadgeStats(userId) {
        const badges = await this.getUserBadges(userId);
        return {
            totalBadges: badges.totalBadges,
            averageScore: badges.badges.reduce((sum, badge) => sum + badge.score, 0) / badges.badges.length || 0,
            latestBadge: badges.badges[0] || null,
            badgesByMonth: this.getBadgesByMonth(badges.badges),
        };
    }
    // Helper method to group badges by month
    static getBadgesByMonth(badges) {
        const grouped = badges.reduce((acc, badge) => {
            const month = badge.earnedAt.toISOString().substring(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(grouped).map(([month, count]) => ({
            month,
            count,
        }));
    }
}
exports.BadgeManagementService = BadgeManagementService;
//# sourceMappingURL=badgeManagement.service.js.map