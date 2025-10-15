"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateStatsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class BadgeTemplateStatsRepository {
    // Get badge template statistics
    static async getBadgeTemplateStats() {
        const [total, totalAwarded, totalAssessments] = await Promise.all([
            prisma_1.prisma.badgeTemplate.count(),
            prisma_1.prisma.userBadge.count(),
            prisma_1.prisma.skillAssessment.count({
                where: { badgeTemplateId: { not: null } },
            }),
        ]);
        return {
            totalTemplates: total,
            totalBadgesAwarded: totalAwarded,
            totalAssessmentsWithBadges: totalAssessments,
        };
    }
}
exports.BadgeTemplateStatsRepository = BadgeTemplateStatsRepository;
//# sourceMappingURL=badgeTemplateStats.repository.js.map