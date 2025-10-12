import { prisma } from "../../config/prisma";

export class AssessmentCrudMutationRepository {
  // Create new assessment
  public static async createAssessment(data: {
    title: string;
    description?: string;
    category: string;
    badgeTemplateId?: number;
    passScore?: number;
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
        category: data.category,
        badgeTemplateId: data.badgeTemplateId || null,
        passScore: data.passScore || 75,
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
        badgeTemplate: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
            category: true,
          },
        },
      },
    });
  }

  // Update assessment
  public static async updateAssessment(
    assessmentId: number,
    createdBy: number,
    data: any
  ) {
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
            category: data.category,
            badgeTemplateId: data.badgeTemplateId,
            passScore: data.passScore,
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
            badgeTemplate: {
              select: {
                id: true,
                name: true,
                icon: true,
                description: true,
                category: true,
              },
            },
          },
        });
      });
    } else {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.badgeTemplateId !== undefined)
        updateData.badgeTemplateId = data.badgeTemplateId;
      if (data.passScore !== undefined) updateData.passScore = data.passScore;

      return await prisma.skillAssessment.updateMany({
        where: { id: assessmentId, createdBy },
        data: updateData,
      });
    }
  }

  // Delete assessment
  public static async deleteAssessment(
    assessmentId: number,
    createdBy: number
  ) {
    const existingAssessment = await prisma.skillAssessment.findFirst({
      where: { id: assessmentId, createdBy },
    });

    if (!existingAssessment) return null;

    return await prisma.skillAssessment.delete({
      where: { id: assessmentId },
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
