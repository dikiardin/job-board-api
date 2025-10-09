"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentResultsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class SkillAssessmentResultsRepository {
    // Save assessment result
    static async saveAssessmentResult(data) {
        return await prisma_1.prisma.skillResult.create({
            data: {
                userId: data.userId,
                assessmentId: data.assessmentId,
                score: data.score,
                isPassed: data.score >= 75,
                certificateUrl: data.certificateUrl || null,
                certificateCode: data.certificateCode || null,
                startedAt: new Date(),
                finishedAt: new Date(),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
        });
    }
    // Get user's assessment result for specific assessment
    static async getUserResult(userId, assessmentId) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { userId, assessmentId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get user's all assessment results
    static async getUserResults(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [results, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    assessment: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            creator: {
                                select: { id: true, name: true },
                            },
                            badgeTemplate: {
                                select: { id: true, name: true, icon: true, category: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.skillResult.count({ where: { userId } }),
        ]);
        return {
            results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get assessment results for developer
    static async getAssessmentResults(assessmentId, createdBy) {
        const assessment = await prisma_1.prisma.skillAssessment.findFirst({
            where: { id: assessmentId, createdBy },
        });
        if (!assessment)
            return null;
        return await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { score: "desc" },
        });
    }
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
        });
    }
    // Get user's certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [certificates, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany({
                where: {
                    userId,
                    certificateCode: { not: null },
                },
                skip,
                take: limit,
                include: {
                    assessment: {
                        select: { id: true, title: true, description: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.skillResult.count({
                where: {
                    userId,
                    certificateCode: { not: null },
                },
            }),
        ]);
        return {
            certificates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit = 10) {
        return await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            take: limit,
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
            orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        });
    }
    // Get assessment statistics
    static async getAssessmentStats(assessmentId) {
        const results = await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            select: { score: true, startedAt: true, finishedAt: true },
        });
        if (results.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                passRate: 0,
                averageTimeSpent: 0,
            };
        }
        const totalAttempts = results.length;
        const passedAttempts = results.filter((r) => r.score >= 75).length;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        // Calculate time spent from startedAt and finishedAt
        const totalTime = results.reduce((sum, r) => {
            if (r.startedAt && r.finishedAt) {
                const timeSpent = Math.round((r.finishedAt.getTime() - r.startedAt.getTime()) / 1000 / 60); // in minutes
                return sum + timeSpent;
            }
            return sum + 30; // default 30 minutes if no time data
        }, 0);
        return {
            totalAttempts,
            averageScore: Math.round(totalScore / totalAttempts),
            passRate: Math.round((passedAttempts / totalAttempts) * 100),
            averageTimeSpent: Math.round(totalTime / totalAttempts),
        };
    }
    // Update certificate info
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return await prisma_1.prisma.skillResult.update({
            where: { id: resultId },
            data: {
                certificateUrl,
                certificateCode,
            },
        });
    }
    // Get certificate by code
    static async getCertificateByCode(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
        });
    }
    // Get user assessment attempts for a specific assessment
    static async getUserAssessmentAttempts(userId, assessmentId) {
        return await prisma_1.prisma.skillResult.findMany({
            where: {
                userId,
                assessmentId,
            },
            select: {
                id: true,
                assessmentId: true,
                userId: true,
                createdAt: true,
                score: true,
                isPassed: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.SkillAssessmentResultsRepository = SkillAssessmentResultsRepository;
//# sourceMappingURL=skillAssessmentResults.repository.js.map