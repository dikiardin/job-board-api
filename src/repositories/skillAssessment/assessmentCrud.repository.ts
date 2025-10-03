import { prisma } from "../../config/prisma";

export class AssessmentCrudRepository {
  // Create new assessment
  public static async createAssessment(data: {
    title: string;
    description?: string;
    badgeTemplateId?: number;
    createdBy: number;
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
    }>;
  }) {
    return await prisma.skillAssessment.create({
      data: {
        title: data.title,
        description: data.description || null,
        badgeTemplateId: data.badgeTemplateId || null,
        createdBy: data.createdBy,
        ...(data.questions.length > 0 && {
          questions: {
            create: data.questions.map((q) => ({
              question: q.question,
              options: q.options,
              answer: q.answer,
            })),
          },
        }),
      },
      include: {
        questions: true,
        creator: { select: { id: true, name: true, email: true } },
        badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
      },
    });
  }

  // Get all assessments with pagination
  public static async getAllAssessments(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [assessments, total] = await Promise.all([
      prisma.skillAssessment.findMany({
        skip,
        take: limit,
        include: {
          creator: { select: { id: true, name: true } },
          badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
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
        badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
        _count: { select: { results: true, questions: true } },
      },
    });
  }

  // Update assessment
  public static async updateAssessment(assessmentId: number, createdBy: number, data: any) {
    const existingAssessment = await prisma.skillAssessment.findFirst({
      where: { id: assessmentId, createdBy },
    });

    if (data.questions && data.questions.length > 0) {
      return await prisma.$transaction(async (tx) => {
        await tx.skillQuestion.deleteMany({ where: { assessmentId } });
        return await tx.skillAssessment.update({
          where: { id: assessmentId },
          data: {
            title: data.title,
            description: data.description,
            badgeTemplateId: data.badgeTemplateId,
            questions: {
              create: data.questions!.map((q: any) => ({
                question: q.question,
                options: q.options,
                answer: q.answer,
              })),
            },
          },
          include: {
            questions: true,
            creator: { select: { id: true, name: true } },
            badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
          },
        });
      });
    } else {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.badgeTemplateId !== undefined) updateData.badgeTemplateId = data.badgeTemplateId;

      return await prisma.skillAssessment.updateMany({
        where: { id: assessmentId, createdBy },
        data: updateData,
      });
    }
  }

  // Delete assessment
  public static async deleteAssessment(assessmentId: number, createdBy: number) {
    const existingAssessment = await prisma.skillAssessment.findFirst({
      where: { id: assessmentId, createdBy },
    });

    if (!existingAssessment) return null;

    return await prisma.skillAssessment.delete({
      where: { id: assessmentId },
    });
  }

  // Get developer's assessments
  public static async getDeveloperAssessments(createdBy: number, page?: number, limit?: number) {
    const query: any = { where: { createdBy }, orderBy: { createdAt: "desc" } };
    
    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    query.include = {
      _count: { select: { results: true, questions: true } },
      badgeTemplate: { select: { id: true, name: true, icon: true, category: true } },
    };

    return await prisma.skillAssessment.findMany(query);
  }

  // Search assessments
  public static async searchAssessments(searchTerm: string, page?: number, limit?: number) {
    const query: any = {
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
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

  // Check if assessment title is available
  public static async isAssessmentTitleAvailable(title: string, excludeId?: number) {
    const where: any = { title };
    if (excludeId) where.id = { not: excludeId };

    const existing = await prisma.skillAssessment.findFirst({ where });
    return !existing;
  }

  // Get assessment statistics
  public static async getAssessmentStats() {
    const [totalAssessments, totalQuestions, totalResults] = await Promise.all([
      prisma.skillAssessment.count(),
      prisma.skillQuestion.count(),
      prisma.skillResult.count(),
    ]);

    return { totalAssessments, totalQuestions, totalResults };
  }

  // Get assessment by ID for developer (includes questions)
  public static async getAssessmentByIdForDeveloper(assessmentId: number, createdBy: number) {
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

  // Save individual question
  public static async saveQuestion(data: {
    assessmentId: number;
    question: string;
    options: string[];
    answer: string;
  }) {
    return await prisma.skillQuestion.create({
      data: {
        assessmentId: data.assessmentId,
        question: data.question,
        options: data.options,
        answer: data.answer,
      },
    });
  }
}
