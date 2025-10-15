"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMutationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ReviewMutationRepository {
    // Create a new review
    static async createReview(data) {
        return await prisma_1.prisma.companyReview.create({
            data: {
                companyId: data.companyId,
                employmentId: data.employmentId ?? null,
                reviewerUserId: data.reviewerUserId,
                positionTitle: data.positionTitle,
                salaryEstimateMin: data.salaryEstimateMin ?? null,
                salaryEstimateMax: data.salaryEstimateMax ?? null,
                ratingCulture: data.ratingCulture,
                ratingWorkLife: data.ratingWorkLife,
                ratingFacilities: data.ratingFacilities,
                ratingCareer: data.ratingCareer,
                companyRating: data.companyRating,
                body: data.body ?? null,
                isVerifiedEmployee: data.employmentId ? true : false,
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
    // Update a review
    static async updateReview(reviewId, data) {
        return await prisma_1.prisma.companyReview.update({
            where: { id: reviewId },
            data: {
                positionTitle: data.positionTitle,
                salaryEstimateMin: data.salaryEstimateMin ?? null,
                salaryEstimateMax: data.salaryEstimateMax ?? null,
                ratingCulture: data.ratingCulture,
                ratingWorkLife: data.ratingWorkLife,
                ratingFacilities: data.ratingFacilities,
                ratingCareer: data.ratingCareer,
                companyRating: data.companyRating,
                body: data.body ?? null,
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
    // Delete a review
    static async deleteReview(reviewId) {
        return await prisma_1.prisma.companyReview.delete({
            where: { id: reviewId },
        });
    }
}
exports.ReviewMutationRepository = ReviewMutationRepository;
//# sourceMappingURL=ReviewMutationRepository.js.map