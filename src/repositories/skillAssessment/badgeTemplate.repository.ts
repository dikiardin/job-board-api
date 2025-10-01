import { prisma } from "../../config/prisma";

export class BadgeTemplateRepository {
  // Create badge template (Developer only)
  public static async createBadgeTemplate(data: {
    name: string;
    icon?: string;
    description?: string;
    category?: string;
    createdBy: number;
  }) {
    return await prisma.badgeTemplate.create({
      data: {
        name: data.name,
        icon: data.icon || null,
        description: data.description || null,
        category: data.category || null,
        createdBy: data.createdBy,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { assessments: true, userBadges: true },
        },
      },
    });
  }

  // Get all badge templates
  public static async getAllBadgeTemplates(page: number = 1, limit: number = 10) {
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

  // Update badge template
  public static async updateBadgeTemplate(
    id: number,
    createdBy: number,
    data: {
      name?: string;
      icon?: string;
      description?: string;
      category?: string;
    }
  ) {
    console.log('Repository update - ID:', id, 'CreatedBy:', createdBy, 'Data:', data);
    
    // First check if template exists and who created it
    const existingTemplate = await prisma.badgeTemplate.findUnique({
      where: { id },
      select: { id: true, createdBy: true, name: true }
    });
    
    console.log('Existing template:', existingTemplate);
    
    if (!existingTemplate) {
      console.log('Template not found');
      return { count: 0 };
    }
    
    if (existingTemplate.createdBy !== createdBy) {
      console.log('Permission denied - different creator');
      return { count: 0 };
    }
    
    const result = await prisma.badgeTemplate.updateMany({
      where: { id, createdBy },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.icon !== undefined && { icon: data.icon || null }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.category !== undefined && { category: data.category || null }),
      },
    });
    
    console.log('Update result from Prisma:', result);
    return result;
  }

  // Delete badge template
  public static async deleteBadgeTemplate(id: number, createdBy: number) {
    // Check if template is being used by assessments
    const template = await prisma.badgeTemplate.findFirst({
      where: { id, createdBy },
      include: {
        _count: { select: { assessments: true } },
      },
    });

    if (!template) {
      return { count: 0, error: "Template not found or no permission" };
    }

    if (template._count.assessments > 0) {
      return { count: 0, error: "Cannot delete template that is being used by assessments" };
    }

    const result = await prisma.badgeTemplate.deleteMany({
      where: { id, createdBy },
    });

    return { count: result.count };
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

  // Check if badge template name exists
  public static async checkBadgeTemplateNameExists(name: string, excludeId?: number) {
    const where: any = { name };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await prisma.badgeTemplate.findFirst({ where });
    return !!existing;
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

  // Check if badge template is in use
  public static async isBadgeTemplateInUse(id: number): Promise<boolean> {
    const [assessmentCount, badgeCount] = await Promise.all([
      prisma.skillAssessment.count({ where: { badgeTemplateId: id } }),
      prisma.userBadge.count({ where: { badgeTemplateId: id } }),
    ]);
    return assessmentCount > 0 || badgeCount > 0;
  }

  // Get badge template statistics
  public static async getBadgeTemplateStats() {
    const [total, totalAwarded, totalAssessments] = await Promise.all([
      prisma.badgeTemplate.count(),
      prisma.userBadge.count(),
      prisma.skillAssessment.count({ where: { badgeTemplateId: { not: null } } }),
    ]);

    return {
      totalTemplates: total,
      totalBadgesAwarded: totalAwarded,
      totalAssessmentsWithBadges: totalAssessments,
    };
  }
}
