"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
const prisma_1 = require("../../config/prisma");
class BadgeService {
    static async awardBadgeFromAssessment(userId, assessmentId, score, totalQuestions) {
        const percentage = (score / totalQuestions) * 100;
        // Only award badge if passed (75% or higher)
        if (percentage < 75) {
            return null;
        }
        // Get assessment with badge template
        const assessment = await prisma_1.prisma.skillAssessment.findUnique({
            where: { id: assessmentId },
            include: {
                badgeTemplate: true,
            },
        });
        if (!assessment) {
            return null;
        }
        let badgeInfo;
        let badgeTemplateId = null;
        // Use badge template if available, otherwise generate from title
        if (assessment.badgeTemplate) {
            badgeInfo = {
                name: assessment.badgeTemplate.name,
                icon: assessment.badgeTemplate.icon || "🏆",
            };
            badgeTemplateId = assessment.badgeTemplate.id;
        }
        else {
            badgeInfo = this.generateBadgeFromTitle(assessment.title);
        }
        // Check if user already has this badge for this assessment
        const existingBadge = await prisma_1.prisma.userBadge.findFirst({
            where: {
                userId,
                assessmentId,
            },
        });
        if (existingBadge) {
            return existingBadge;
        }
        // Create new badge with proper relationships
        return await prisma_1.prisma.userBadge.create({
            data: {
                userId,
                badgeName: badgeInfo.name,
                badgeIcon: badgeInfo.icon,
                assessmentId,
                badgeTemplateId,
                badgeType: "skill",
            },
        });
    }
    static generateBadgeFromTitle(assessmentTitle) {
        // Simple badge generation from assessment title
        const titleLower = assessmentTitle.toLowerCase();
        // Common skill keywords and their icons
        const skillIcons = {
            javascript: "🟨",
            react: "⚛️",
            node: "🟢",
            python: "🐍",
            java: "☕",
            database: "🗄️",
            sql: "🗄️",
            devops: "🔧",
            ui: "🎨",
            ux: "🎨",
            mobile: "📱",
            cloud: "☁️",
            aws: "☁️",
            docker: "🐳",
            kubernetes: "⚙️",
        };
        // Find matching skill
        let icon = "🏆"; // default
        for (const [skill, skillIcon] of Object.entries(skillIcons)) {
            if (titleLower.includes(skill)) {
                icon = skillIcon;
                break;
            }
        }
        return {
            name: `${assessmentTitle} Expert`,
            icon: icon,
        };
    }
    static async getUserBadges(userId) {
        return await prisma_1.prisma.userBadge.findMany({
            where: { userId },
            orderBy: { awardedAt: "desc" },
        });
    }
    static async getBadgeStats() {
        const stats = await prisma_1.prisma.userBadge.groupBy({
            by: ["badgeName"],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
        });
        return stats.map((stat) => ({
            badgeName: stat.badgeName,
            count: stat._count.id,
        }));
    }
    static async getTopBadgeHolders(limit = 10) {
        const users = await prisma_1.prisma.user.findMany({
            include: {
                userBadges: true,
                _count: {
                    select: { userBadges: true },
                },
            },
            orderBy: {
                userBadges: {
                    _count: "desc",
                },
            },
            take: limit,
        });
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            badgeCount: user._count.userBadges,
            badges: user.userBadges.map((badge) => ({
                name: badge.badgeName,
                icon: badge.badgeIcon,
                awardedAt: badge.awardedAt,
            })),
        }));
    }
    // Award milestone badges based on achievements
    static async checkMilestoneBadges(userId) {
        const userStats = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                skillResults: {
                    where: { isPassed: true },
                },
                userBadges: true,
            },
        });
        if (!userStats)
            return [];
        return [];
    }
    // Get badge details
    static async getBadgeDetails(badgeId) {
        const badge = await prisma_1.prisma.userBadge.findUnique({
            where: { id: badgeId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                badgeTemplate: true,
                assessment: {
                    select: { id: true, title: true },
                },
            },
        });
        return badge;
    }
    // Verify badge
    static async verifyBadge(badgeId, userId) {
        const badge = await this.getBadgeDetails(badgeId);
        if (!badge) {
            throw new Error("Badge not found");
        }
        if (badge.userId !== userId) {
            throw new Error("Badge does not belong to this user");
        }
        return {
            isValid: true,
            badge,
        };
    }
}
exports.BadgeService = BadgeService;
//# sourceMappingURL=badge.service.js.map