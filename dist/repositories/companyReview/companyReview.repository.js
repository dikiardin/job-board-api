"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewRepository = void 0;
const prisma_1 = require("../../config/prisma");
class CompanyReviewRepository {
    // Check if company exists
    static async checkCompanyExists(companyId) {
        const id = typeof companyId === 'string' ? Number(companyId) : companyId;
        const company = await prisma_1.prisma.company.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!company;
    }
    // Get user's employment record with a company
    static async getUserEmployment(userId, companyId) {
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        return await prisma_1.prisma.employment.findFirst({
            where: {
                userId,
                companyId: cid
            },
            select: {
                id: true,
                startDate: true,
                endDate: true
            }
        });
    }
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
                body: true,
                createdAt: true
            }
        });
    }
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
                body: data.body ?? null
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
                body: true,
                createdAt: true
            }
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
                body: data.body ?? null
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
                body: true,
                createdAt: true
            }
        });
    }
    // Delete a review
    static async deleteReview(reviewId) {
        return await prisma_1.prisma.companyReview.delete({
            where: { id: reviewId }
        });
    }
    // Get company reviews with pagination
    static async getCompanyReviews(params) {
        const { companyId, limit, offset, sortBy, sortOrder } = params;
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const orderBy = {};
        if (sortBy === 'createdAt') {
            orderBy.createdAt = sortOrder;
        }
        else if (sortBy === 'rating') {
            // Sort by overall rating (average of all ratings)
            orderBy.cultureRating = sortOrder;
        }
        return await prisma_1.prisma.companyReview.findMany({
            where: {
                employment: {
                    companyId: cid
                }
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
                body: true,
                createdAt: true
            },
            orderBy: orderBy,
            take: limit,
            skip: offset
        });
    }
    // Get total count of reviews for a company
    static async getCompanyReviewsCount(companyId) {
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        return await prisma_1.prisma.companyReview.count({
            where: {
                employment: {
                    companyId: cid
                }
            }
        });
    }
    // Get company review statistics
    static async getCompanyReviewStats(companyId) {
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const stats = await prisma_1.prisma.companyReview.aggregate({
            where: {
                employment: {
                    companyId: cid
                }
            },
            _avg: {
                ratingCulture: true,
                ratingWorkLife: true,
                ratingFacilities: true,
                ratingCareer: true
            }
        });
        const totalReviews = await prisma_1.prisma.companyReview.count({ where: { employment: { companyId: cid } } });
        // Calculate overall average rating
        const avgRatings = stats._avg;
        const overallRating = avgRatings?.ratingCulture && avgRatings?.ratingWorkLife &&
            avgRatings?.ratingFacilities && avgRatings?.ratingCareer
            ? (Number(avgRatings?.ratingCulture) + Number(avgRatings?.ratingWorkLife) +
                Number(avgRatings?.ratingFacilities) + Number(avgRatings?.ratingCareer)) / 4
            : 0;
        // Get rating distribution
        const ratingDistribution = await prisma_1.prisma.$queryRaw `
      SELECT 
        ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0) as rating,
        COUNT(*) as count
      FROM company_review cr
      JOIN employment e ON cr.employment_id = e.id
      WHERE e.company_id = ${cid}
      GROUP BY ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0)
      ORDER BY rating DESC
    `;
        return {
            totalReviews,
            avgCultureRating: avgRatings?.ratingCulture?.toFixed?.(1),
            avgWorklifeRating: avgRatings?.ratingWorkLife?.toFixed?.(1),
            avgFacilityRating: avgRatings?.ratingFacilities?.toFixed?.(1),
            avgCareerRating: avgRatings?.ratingCareer?.toFixed?.(1),
            avgOverallRating: overallRating.toFixed(1),
            ratingDistribution: ratingDistribution.map(item => ({
                rating: Number(item.rating),
                count: Number(item.count)
            }))
        };
    }
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
        const estimates = await prisma_1.prisma.$queryRaw `
      SELECT 
        position,
        COUNT(*) as count,
        AVG(salary_estimate) as average_salary,
        MIN(salary_estimate) as min_salary,
        MAX(salary_estimate) as max_salary
      FROM company_review cr
      JOIN employment e ON cr.employment_id = e.id
      WHERE e.company_id = ${cid} AND cr.salary_estimate IS NOT NULL
      GROUP BY position
      ORDER BY count DESC, average_salary DESC
    `;
        return estimates.map(estimate => ({
            position: estimate.position,
            count: Number(estimate.count),
            averageSalary: estimate.average_salary?.toFixed(0),
            minSalary: estimate.min_salary,
            maxSalary: estimate.max_salary
        }));
    }
}
exports.CompanyReviewRepository = CompanyReviewRepository;
//# sourceMappingURL=companyReview.repository.js.map