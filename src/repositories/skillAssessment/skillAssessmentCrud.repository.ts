import { prisma } from "../../config/prisma";

export class SkillAssessmentCrudRepository {
  // Create new assessment (Developer only)
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
        questions: {
          create: data.questions.map((q) => ({
            question: q.question,
            options: q.options,
            answer: q.answer,
          })),
        },
      },
      include: {
        questions: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
        badgeTemplate: {
          select: { id: true, name: true, icon: true, description: true, category: true },
        },
      },
    });
  }

  // Get all assessments (for discovery)
  public static async getAllAssessments(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [assessments, total] = await Promise.all([
      prisma.skillAssessment.findMany({
        skip,
        take: limit,
        include: {
          creator: {
            select: { id: true, name: true },
          },
          _count: {
            select: { results: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillAssessment.count(),
    ]);

    return {
      assessments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get assessment with questions (for taking test)
  public static async getAssessmentWithQuestions(assessmentId: number) {
    return await prisma.skillAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            // Don't include answer for security
          },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Get assessment with answers (for grading)
  public static async getAssessmentWithAnswers(assessmentId: number) {
    return await prisma.skillAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: true,
      },
    });
  }

  // Update assessment (Developer only)
  public static async updateAssessment(
    assessmentId: number,
    createdBy: number,
    data: {
      title?: string;
      description?: string;
      badgeTemplateId?: number;
      questions?: Array<{
        question: string;
        options: string[];
        answer: string;
      }>;
    }
  ) {
    // Check if assessment exists and belongs to the developer
    const existingAssessment = await prisma.skillAssessment.findFirst({
      where: { id: assessmentId, createdBy },
    });

    if (!existingAssessment) {
      return null;
    }

    // If questions are provided, update them
    if (data.questions && data.questions.length > 0) {
      return await prisma.$transaction(async (tx) => {
        // Delete existing questions
        await tx.skillQuestion.deleteMany({
          where: { assessmentId },
        });

        // Update assessment and create new questions
        const result = await tx.skillAssessment.update({
          where: { id: assessmentId },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.badgeTemplateId !== undefined && { badgeTemplateId: data.badgeTemplateId }),
            questions: {
              create: data.questions!.map((q) => ({
                assessmentId,
                question: q.question,
                options: q.options,
                answer: q.answer,
              })),
            },
          },
          include: {
            questions: true,
            creator: {
              select: { id: true, name: true },
            },
            badgeTemplate: {
              select: { id: true, name: true, icon: true, description: true, category: true },
            },
          },
        });

        return result;
      });
    } else {
      // If no questions, just update the assessment fields
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

  // Delete assessment (Developer only)
  public static async deleteAssessment(assessmentId: number, createdBy: number) {
    // Check if assessment exists and belongs to the developer
    const existingAssessment = await prisma.skillAssessment.findFirst({
      where: { id: assessmentId, createdBy },
    });

    if (!existingAssessment) {
      return null;
    }

    // Delete assessment (cascade will handle questions and results)
    return await prisma.skillAssessment.delete({
      where: { id: assessmentId },
    });
  }

  // Get developer's assessments
  public static async getDeveloperAssessments(createdBy: number) {
    return await prisma.skillAssessment.findMany({
      where: { createdBy },
      include: {
        _count: {
          select: { results: true, questions: true },
        },
        badgeTemplate: {
          select: { id: true, name: true, icon: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
