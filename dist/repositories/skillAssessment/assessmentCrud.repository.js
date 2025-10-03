"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCrudRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentCrudRepository {
    // Create new assessment
    static async createAssessment(data) {
        return await prisma_1.prisma.skillAssessment.create({
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
    static async getAllAssessments(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [assessments, total] = await Promise.all([
            prisma_1.prisma.skillAssessment.findMany({
                skip,
                take: limit,
                include: {
                    creator: { select: { id: true, name: true } },
                    badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
                    _count: { select: { results: true, questions: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.skillAssessment.count(),
        ]);
        return {
            assessments,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    // Get assessment by ID
    static async getAssessmentById(assessmentId) {
        return await prisma_1.prisma.skillAssessment.findUnique({
            where: { id: assessmentId },
            include: {
                questions: true,
                creator: { select: { id: true, name: true } },
                badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
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
                        badgeTemplateId: data.badgeTemplateId,
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
                        badgeTemplate: { select: { id: true, name: true, icon: true, description: true, category: true } },
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
            if (data.badgeTemplateId !== undefined)
                updateData.badgeTemplateId = data.badgeTemplateId;
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
    // Get developer's assessments
    static async getDeveloperAssessments(createdBy, page, limit) {
        const query = { where: { createdBy }, orderBy: { createdAt: "desc" } };
        if (page && limit) {
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        query.include = {
            _count: { select: { results: true, questions: true } },
            badgeTemplate: { select: { id: true, name: true, icon: true, category: true } },
        };
        return await prisma_1.prisma.skillAssessment.findMany(query);
    }
    // Search assessments
    static async searchAssessments(searchTerm, page, limit) {
        const query = {
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
        return await prisma_1.prisma.skillAssessment.findMany(query);
    }
    // Check if assessment title is available
    static async isAssessmentTitleAvailable(title, excludeId) {
        const where = { title };
        if (excludeId)
            where.id = { not: excludeId };
        const existing = await prisma_1.prisma.skillAssessment.findFirst({ where });
        return !existing;
    }
    // Get assessment statistics
    static async getAssessmentStats() {
        const [totalAssessments, totalQuestions, totalResults] = await Promise.all([
            prisma_1.prisma.skillAssessment.count(),
            prisma_1.prisma.skillQuestion.count(),
            prisma_1.prisma.skillResult.count(),
        ]);
        return { totalAssessments, totalQuestions, totalResults };
    }
    // Get assessment by ID for developer (includes questions)
    static async getAssessmentByIdForDeveloper(assessmentId, createdBy) {
        return await prisma_1.prisma.skillAssessment.findFirst({
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
exports.AssessmentCrudRepository = AssessmentCrudRepository;
//# sourceMappingURL=assessmentCrud.repository.js.map