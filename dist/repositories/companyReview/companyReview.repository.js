"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyReviewRepository = void 0;
const prisma_1 = require("../../config/prisma");
class CompanyReviewRepository {
    // Check if company exists
    static async checkCompanyExists(companyId) {
        const company = await prisma_1.prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true }
        });
        return !!company;
    }
    // Get user's employment record with a company
    static async getUserEmployment(userId, companyId) {
        return await prisma_1.prisma.employment.findFirst({
            where: {
                userId,
                companyId
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
                position: true,
                salaryEstimate: true,
                cultureRating: true,
                worklifeRating: true,
                facilityRating: true,
                careerRating: true,
                comment: true,
                createdAt: true
            }
        });
    }
    // Create a new review
    static async createReview(data) {
        return await prisma_1.prisma.companyReview.create({
            data: {
                employmentId: data.employmentId,
                position: data.position,
                salaryEstimate: data.salaryEstimate ?? null,
                cultureRating: data.cultureRating,
                worklifeRating: data.worklifeRating,
                facilityRating: data.facilityRating,
                careerRating: data.careerRating,
                comment: data.comment ?? null
            },
            select: {
                id: true,
                position: true,
                salaryEstimate: true,
                cultureRating: true,
                worklifeRating: true,
                facilityRating: true,
                careerRating: true,
                comment: true,
                createdAt: true
            }
        });
    }
    // Update a review
    static async updateReview(reviewId, data) {
        return await prisma_1.prisma.companyReview.update({
            where: { id: reviewId },
            data: {
                position: data.position,
                salaryEstimate: data.salaryEstimate ?? null,
                cultureRating: data.cultureRating,
                worklifeRating: data.worklifeRating,
                facilityRating: data.facilityRating,
                careerRating: data.careerRating,
                comment: data.comment ?? null
            },
            select: {
                id: true,
                position: true,
                salaryEstimate: true,
                cultureRating: true,
                worklifeRating: true,
                facilityRating: true,
                careerRating: true,
                comment: true,
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
                    companyId
                }
            },
            select: {
                id: true,
                position: true,
                salaryEstimate: true,
                cultureRating: true,
                worklifeRating: true,
                facilityRating: true,
                careerRating: true,
                comment: true,
                createdAt: true
            },
            orderBy: orderBy,
            take: limit,
            skip: offset
        });
    }
    // Get total count of reviews for a company
    static async getCompanyReviewsCount(companyId) {
        return await prisma_1.prisma.companyReview.count({
            where: {
                employment: {
                    companyId
                }
            }
        });
    }
    // Get company review statistics
    static async getCompanyReviewStats(companyId) {
        const stats = await prisma_1.prisma.companyReview.aggregate({
            where: {
                employment: {
                    companyId
                }
            },
            _count: {
                id: true
            },
            _avg: {
                cultureRating: true,
                worklifeRating: true,
                facilityRating: true,
                careerRating: true
            }
        });
        // Calculate overall average rating
        const avgRatings = stats._avg;
        const overallRating = avgRatings.cultureRating && avgRatings.worklifeRating &&
            avgRatings.facilityRating && avgRatings.careerRating
            ? (Number(avgRatings.cultureRating) + Number(avgRatings.worklifeRating) +
                Number(avgRatings.facilityRating) + Number(avgRatings.careerRating)) / 4
            : 0;
        // Get rating distribution
        const ratingDistribution = await prisma_1.prisma.$queryRaw `
      SELECT 
        ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0) as rating,
        COUNT(*) as count
      FROM company_review cr
      JOIN employment e ON cr.employment_id = e.id
      WHERE e.company_id = ${companyId}
      GROUP BY ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0)
      ORDER BY rating DESC
    `;
        return {
            totalReviews: stats._count.id,
            avgCultureRating: avgRatings.cultureRating?.toFixed(1),
            avgWorklifeRating: avgRatings.worklifeRating?.toFixed(1),
            avgFacilityRating: avgRatings.facilityRating?.toFixed(1),
            avgCareerRating: avgRatings.careerRating?.toFixed(1),
            avgOverallRating: overallRating.toFixed(1),
            ratingDistribution: ratingDistribution.map(item => ({
                rating: Number(item.rating),
                count: Number(item.count)
            }))
        };
    }
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        const estimates = await prisma_1.prisma.$queryRaw `
      SELECT 
        position,
        COUNT(*) as count,
        AVG(salary_estimate) as average_salary,
        MIN(salary_estimate) as min_salary,
        MAX(salary_estimate) as max_salary
      FROM company_review cr
      JOIN employment e ON cr.employment_id = e.id
      WHERE e.company_id = ${companyId} AND cr.salary_estimate IS NOT NULL
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