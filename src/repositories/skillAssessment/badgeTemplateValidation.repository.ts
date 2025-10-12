import { prisma } from "../../config/prisma";

export class BadgeTemplateValidationRepository {
  // Check if badge template name exists
  public static async checkBadgeTemplateNameExists(
    name: string,
    excludeId?: number
  ) {
    const where: any = { name };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await prisma.badgeTemplate.findFirst({ where });
    return !!existing;
  }

  // Check if badge template is in use
  public static async isBadgeTemplateInUse(id: number): Promise<boolean> {
    const [assessmentCount, badgeCount] = await Promise.all([
      prisma.skillAssessment.count({ where: { badgeTemplateId: id } }),
      prisma.userBadge.count({ where: { badgeTemplateId: id } }),
    ]);
    return assessmentCount > 0 || badgeCount > 0;
  }
}
