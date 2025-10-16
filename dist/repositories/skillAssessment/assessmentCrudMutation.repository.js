"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCrudMutationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentCrudMutationRepository {
    // Create new assessment
    static async createAssessment(data) {
        return await prisma_1.prisma.skillAssessment.create({
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
    static async updateAssessment(assessmentId, createdBy, data) {
        const existingAssessment = await prisma_1.prisma.skillAssessment.findFirst({
            where: { id: assessmentId, createdBy },
        });
        if (data.questions && data.questions.length > 0) {
            return await prisma_1.prisma.$transaction(async (tx) => {
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
                            create: data.questions.map((q) => ({
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
        }
        else {
            const updateData = {};
            if (data.title !== undefined)
                updateData.title = data.title;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.category !== undefined)
                updateData.category = data.category;
            if (data.badgeTemplateId !== undefined)
                updateData.badgeTemplateId = data.badgeTemplateId;
            if (data.passScore !== undefined)
                updateData.passScore = data.passScore;
            return await prisma_1.prisma.skillAssessment.updateMany({
                where: { id: assessmentId, createdBy },
                data: updateData,
            });
        }
    }
    // Delete assessment
    static async deleteAssessment(assessmentId, createdBy) {
        const existingAssessment = await prisma_1.prisma.skillAssessment.findFirst({
            where: { id: assessmentId, createdBy },
        });
        if (!existingAssessment)
            return null;
        return await prisma_1.prisma.skillAssessment.delete({
            where: { id: assessmentId },
        });
    }
    // Save individual question
    static async saveQuestion(data) {
        return await prisma_1.prisma.skillQuestion.create({
            data: {
                assessmentId: data.assessmentId,
                question: data.question,
                options: data.options,
                answer: data.answer,
            },
        });
    }
}
exports.AssessmentCrudMutationRepository = AssessmentCrudMutationRepository;
