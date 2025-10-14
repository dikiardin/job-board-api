import { prisma } from "../../config/prisma";

export class AssessmentCrudQueryRepository {
  // Get all assessments with pagination
  public static async getAllAssessments(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [assessments, total] = await Promise.all([
      prisma.skillAssessment.findMany({
        skip,
        take: limit,
        include: {
          creator: { select: { id: true, name: true } },
          badgeTemplate: {
            select: {
              id: true,
              name: true,
              icon: true,
              description: true,
              category: true,
            },
          },
          _count: { select: { results: true, questions: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillAssessment.count(),
    ]);

    return {
      assessments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // Get assessment by ID
  public static async getAssessmentById(assessmentId: number) {
    return await prisma.skillAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
        creator: { select: { id: true, name: true } },
        badgeTemplate: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
            category: true,
          },
        },
        _count: { select: { results: true, questions: true } },
      },
    });
  }

  // Get assessment by slug
  public static async getAssessmentBySlug(slug: string) {
    return await prisma.skillAssessment.findUnique({
      where: { slug },
      include: {
        questions: true,
        creator: { select: { id: true, name: true } },
        badgeTemplate: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
            category: true,
          },
        },
        _count: { select: { results: true, questions: true } },
      },
    });
  }

  // Get developer's assessments
  public static async getDeveloperAssessments(
    createdBy: number,
    page?: number,
    limit?: number
  ) {
    const query: any = { where: { createdBy }, orderBy: { createdAt: "desc" } };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    query.include = {
      _count: { select: { results: true, questions: true } },
      badgeTemplate: {
        select: { id: true, name: true, icon: true, category: true },
      },
    };

    return await prisma.skillAssessment.findMany(query);
  }

  // Search assessments
  public static async searchAssessments(
    searchTerm: string,
    page?: number,
    limit?: number
  ) {
    const query: any = {
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    query.include = {
      creator: { select: { id: true, name: true } },
      _count: { select: { results: true } },
    };

    return await prisma.skillAssessment.findMany(query);
  }

  // Get assessment by ID for developer (includes questions)
  public static async getAssessmentByIdForDeveloper(
    assessmentId: number,
    createdBy: number
  ) {
    return await prisma.skillAssessment.findFirst({
      where: {
        id: assessmentId,
        createdBy: createdBy,
      },
      include: {
        questions: true,
        badgeTemplate: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });
  }
}
