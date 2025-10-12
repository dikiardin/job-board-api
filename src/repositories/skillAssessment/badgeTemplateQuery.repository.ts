import { prisma } from "../../config/prisma";

export class BadgeTemplateQueryRepository {
  // Get all badge templates
  public static async getAllBadgeTemplates(
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [templates, total] = await Promise.all([
      prisma.badgeTemplate.findMany({
        skip,
        take: limit,
        include: {
          creator: {
            select: { id: true, name: true },
          },
          _count: {
            select: { assessments: true, userBadges: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.badgeTemplate.count(),
    ]);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get badge template by ID
  public static async getBadgeTemplateById(id: number) {
    return await prisma.badgeTemplate.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assessments: {
          select: { id: true, title: true },
        },
        _count: {
          select: { assessments: true, userBadges: true },
        },
      },
    });
  }

  // Get developer's badge templates
  public static async getDeveloperBadgeTemplates(createdBy: number) {
    return await prisma.badgeTemplate.findMany({
      where: { createdBy },
      include: {
        _count: {
          select: { assessments: true, userBadges: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Search badge templates by category or name
  public static async searchBadgeTemplates(query: string) {
    return await prisma.badgeTemplate.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        _count: {
          select: { assessments: true, userBadges: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get badge template by name (for assessment creation)
  public static async getBadgeTemplateByName(name: string) {
    return await prisma.badgeTemplate.findUnique({
      where: { name },
    });
  }

  // Get popular badge templates (most used)
  public static async getPopularBadgeTemplates(limit: number = 10) {
    return await prisma.badgeTemplate.findMany({
      include: {
        creator: {
          select: { id: true, name: true },
        },
        _count: {
          select: { assessments: true, userBadges: true },
        },
      },
      orderBy: {
        userBadges: {
          _count: "desc",
        },
      },
      take: limit,
    });
  }

  // Get badge templates by category
  public static async getBadgeTemplatesByCategory(category: string) {
    return await prisma.badgeTemplate.findMany({
      where: { category },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        _count: {
          select: { assessments: true, userBadges: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Find badge template by name
  public static async findByName(name: string) {
    return await prisma.badgeTemplate.findFirst({
      where: { name },
    });
  }

  // Find badge template by name excluding specific ID
  public static async findByNameExcluding(name: string, excludeId: number) {
    return await prisma.badgeTemplate.findFirst({
      where: {
        name,
        id: { not: excludeId },
      },
    });
  }
}
