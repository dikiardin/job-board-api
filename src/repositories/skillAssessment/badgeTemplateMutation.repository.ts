import { prisma } from "../../config/prisma";

export class BadgeTemplateMutationRepository {
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
    // First check if template exists and who created it
    const existingTemplate = await prisma.badgeTemplate.findUnique({
      where: { id },
      select: { id: true, createdBy: true, name: true },
    });

    if (!existingTemplate) {
      return { count: 0 };
    }

    if (existingTemplate.createdBy !== createdBy) {
      return { count: 0 };
    }

    const result = await prisma.badgeTemplate.updateMany({
      where: { id, createdBy },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.icon !== undefined && { icon: data.icon || null }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.category !== undefined && { category: data.category || null }),
      },
    });

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
      return {
        count: 0,
        error: "Cannot delete template that is being used by assessments",
      };
    }

    const result = await prisma.badgeTemplate.deleteMany({
      where: { id, createdBy },
    });

    return { count: result.count };
  }
}
