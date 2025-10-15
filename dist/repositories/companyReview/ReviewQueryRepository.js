"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewQueryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ReviewQueryRepository {
    // Get existing review for an employment
    static async getExistingReview(employmentId) {
        return await prisma_1.prisma.companyReview.findUnique({
            where: { employmentId },
            select: {
                id: true,
                positionTitle: true,
                salaryEstimateMin: true,
                salaryEstimateMax: true,
                ratingCulture: true,
                ratingWorkLife: true,
                ratingFacilities: true,
                ratingCareer: true,
                companyRating: true,
                body: true,
                createdAt: true,
            },
        });
    }
    // Get existing review by user and company
    static async getExistingReviewByUserAndCompany(userId, companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        return await prisma_1.prisma.companyReview.findFirst({
            where: {
                reviewerUserId: userId,
                companyId: cid,
            },
            select: {
                id: true,
                positionTitle: true,
                salaryEstimateMin: true,
                salaryEstimateMax: true,
                ratingCulture: true,
                ratingWorkLife: true,
                ratingFacilities: true,
                ratingCareer: true,
                companyRating: true,
                body: true,
                createdAt: true,
            },
        });
    }
    // Get company reviews with pagination
    static async getCompanyReviews(params) {
        const { companyId, limit, offset, sortBy, sortOrder } = params;
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        if (isNaN(cid)) {
            return [];
        }
        const orderBy = {};
        if (sortBy === "createdAt") {
            orderBy.createdAt = sortOrder;
        }
        else if (sortBy === "rating") {
            orderBy.cultureRating = sortOrder;
        }
        return await prisma_1.prisma.companyReview.findMany({
            where: {
                companyId: cid,
            },
            select: {
                id: true,
                positionTitle: true,
                isAnonymous: true,
                reviewerSnapshot: true,
                salaryEstimateMin: true,
                salaryEstimateMax: true,
                ratingCulture: true,
                ratingWorkLife: true,
                ratingFacilities: true,
                ratingCareer: true,
                companyRating: true,
                body: true,
                createdAt: true,
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: orderBy,
            take: limit,
            skip: offset,
        });
    }
    // Get total count of reviews for a company
    static async getCompanyReviewsCount(companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        if (isNaN(cid)) {
            return 0;
        }
        return await prisma_1.prisma.companyReview.count({
            where: {
                companyId: cid,
            },
        });
    }
    // Get company reviewers (shows who reviewed the company)
    static async getCompanyReviewers(companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        if (isNaN(cid)) {
            return [];
        }
        return await prisma_1.prisma.companyReview.findMany({
            where: {
                companyId: cid,
            },
            select: {
                id: true,
                positionTitle: true,
                isAnonymous: true,
                reviewerSnapshot: true,
                createdAt: true,
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
exports.ReviewQueryRepository = ReviewQueryRepository;
//# sourceMappingURL=ReviewQueryRepository.js.map