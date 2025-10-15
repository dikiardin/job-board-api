"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCrudQueryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentCrudQueryRepository {
    // Get all assessments with pagination
    static async getAllAssessments(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [assessments, total] = await Promise.all([
            prisma_1.prisma.skillAssessment.findMany({
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
    static async getAssessmentBySlug(slug) {
        return await prisma_1.prisma.skillAssessment.findUnique({
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
    static async getDeveloperAssessments(createdBy, page, limit) {
        const query = { where: { createdBy }, orderBy: { createdAt: "desc" } };
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
        return await prisma_1.prisma.skillAssessment.findMany(query);
    }
    // Search assessments
    static async searchAssessments(searchTerm, page, limit) {
        const query = {
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
        return await prisma_1.prisma.skillAssessment.findMany(query);
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
}
exports.AssessmentCrudQueryRepository = AssessmentCrudQueryRepository;
//# sourceMappingURL=assessmentCrudQuery.repository.js.map