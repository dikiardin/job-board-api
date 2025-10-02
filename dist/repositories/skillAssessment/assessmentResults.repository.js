"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultsRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentResultsRepository {
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
                user: { select: { id: true, name: true, email: true } },
                assessment: { select: { id: true, title: true, description: true } },
            },
        });
    }
    // Get user's result for specific assessment
    static async getUserResult(userId, assessmentId) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { userId, assessmentId },
            include: {
                assessment: { select: { id: true, title: true, description: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get all results for an assessment
    static async getAssessmentResults(assessmentId) {
        return await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { score: "desc" },
        });
    }
    // Get user's all results with pagination
    static async getUserResults(userId, page, limit) {
        const query = {
            where: { userId },
            include: {
                assessment: { select: { id: true, title: true, description: true } },
            },
            orderBy: { createdAt: "desc" },
        };
        if (page && limit) {
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        const [results, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany(query),
            prisma_1.prisma.skillResult.count({ where: { userId } }),
        ]);
        return {
            results,
            pagination: page && limit ? { page, limit, total, totalPages: Math.ceil(total / limit) } : null,
        };
    }
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assessment: { select: { id: true, title: true, description: true } },
            },
        });
    }
    // Get user's certificates
    static async getUserCertificates(userId, page, limit) {
        const query = {
            where: { userId, certificateCode: { not: null } },
            include: {
                assessment: { select: { id: true, title: true, description: true } },
            },
            orderBy: { createdAt: "desc" },
        };
        if (page && limit) {
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        const [certificates, total] = await Promise.all([
            prisma_1.prisma.skillResult.findMany(query),
            prisma_1.prisma.skillResult.count({ where: { userId, certificateCode: { not: null } } }),
        ]);
        return {
            certificates,
            pagination: page && limit ? { page, limit, total, totalPages: Math.ceil(total / limit) } : null,
        };
    }
    // Get certificate by code
    static async getCertificateByCode(certificateCode) {
        return await prisma_1.prisma.skillResult.findFirst({
            where: { certificateCode },
            include: {
                user: { select: { id: true, name: true, email: true } },
                assessment: { select: { id: true, title: true, description: true } },
            },
        });
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit) {
        const query = {
            where: { assessmentId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: [{ score: "desc" }, { createdAt: "asc" }],
        };
        if (limit)
            query.take = limit;
        return await prisma_1.prisma.skillResult.findMany(query);
    }
    // Get assessment statistics
    static async getAssessmentStatistics(assessmentId) {
        const results = await prisma_1.prisma.skillResult.findMany({
            where: { assessmentId },
            select: { score: true, createdAt: true },
        });
        if (results.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                averageTime: 0,
                passRate: 0,
                highestScore: 0,
                lowestScore: 0,
            };
        }
        const scores = results.map(r => r.score);
        const passedCount = scores.filter(s => s >= 75).length;
        return {
            totalAttempts: results.length,
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            passRate: Math.round((passedCount / results.length) * 100),
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
        };
    }
    // Delete assessment result
    static async deleteAssessmentResult(resultId) {
        return await prisma_1.prisma.skillResult.delete({
            where: { id: resultId },
        });
    }
    // Update certificate info
    static async updateCertificateInfo(resultId, certificateUrl, certificateCode) {
        return await prisma_1.prisma.skillResult.update({
            where: { id: resultId },
            data: { certificateUrl, certificateCode },
        });
    }
    // Get user assessment history
    static async getUserAssessmentHistory(userId) {
        const results = await prisma_1.prisma.skillResult.findMany({
            where: { userId },
            include: {
                assessment: { select: { id: true, title: true } },
            },
        });
        const passedCount = results.filter(r => r.score >= 75).length;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        return {
            results,
            statistics: {
                totalAssessments: results.length,
                passedAssessments: passedCount,
                averageScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
                passRate: results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0,
            },
        };
    }
    // Get global assessment statistics
    static async getGlobalAssessmentStats() {
        const [totalResults, totalUsers, totalAssessments] = await Promise.all([
            prisma_1.prisma.skillResult.count(),
            prisma_1.prisma.skillResult.groupBy({ by: ['userId'] }),
            prisma_1.prisma.skillAssessment.count(),
        ]);
        return {
            totalResults,
            totalUsers: totalUsers.length,
            totalAssessments,
        };
    }
}
exports.AssessmentResultsRepository = AssessmentResultsRepository;
//# sourceMappingURL=assessmentResults.repository.js.map