"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateValidationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class BadgeTemplateValidationRepository {
    // Check if badge template name exists
    static async checkBadgeTemplateNameExists(name, excludeId) {
        const where = { name };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const existing = await prisma_1.prisma.badgeTemplate.findFirst({ where });
        return !!existing;
    }
    // Check if badge template is in use
    static async isBadgeTemplateInUse(id) {
        const [assessmentCount, badgeCount] = await Promise.all([
            prisma_1.prisma.skillAssessment.count({ where: { badgeTemplateId: id } }),
            prisma_1.prisma.userBadge.count({ where: { badgeTemplateId: id } }),
        ]);
        return assessmentCount > 0 || badgeCount > 0;
    }
}
exports.BadgeTemplateValidationRepository = BadgeTemplateValidationRepository;
