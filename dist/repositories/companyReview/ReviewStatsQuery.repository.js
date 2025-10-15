"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewStatsQueryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ReviewStatsQueryRepository {
    // Get company review statistics
    static async getCompanyReviewStats(companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        if (isNaN(cid)) {
            return {
                totalReviews: 0,
                averageRatings: {
                    culture: 0,
                    facilities: 0,
                    workLife: 0,
                    career: 0,
                    overall: 0,
                },
            };
        }
        const stats = await prisma_1.prisma.companyReview.aggregate({
            where: {
                companyId: cid,
            },
            _avg: {
                ratingCulture: true,
                ratingWorkLife: true,
                ratingFacilities: true,
                ratingCareer: true,
                companyRating: true,
            },
        });
        const totalReviews = await prisma_1.prisma.companyReview.count({
            where: { companyId: cid },
        });
        // Calculate overall average rating
        const avgRatings = stats._avg;
        const overallRating = this.calculateOverallRating(avgRatings);
        // Get rating distribution
        const ratingDistribution = await this.getRatingDistribution(cid);
        return {
            totalReviews,
            avgCultureRating: this.formatRating(avgRatings?.ratingCulture),
            avgWorklifeRating: this.formatRating(avgRatings?.ratingWorkLife),
            avgFacilityRating: this.formatRating(avgRatings?.ratingFacilities),
            avgCareerRating: this.formatRating(avgRatings?.ratingCareer),
            avgCompanyRating: this.formatRating(avgRatings?.companyRating),
            avgOverallRating: overallRating.toFixed(1),
            ratingDistribution: ratingDistribution.map((item) => ({
                rating: Number(item.rating),
                count: Number(item.count),
            })),
        };
    }
    // Get overall company rating (average of all companyRating from reviews)
    static async getCompanyRating(companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        // Get company info and average rating
        const result = await prisma_1.prisma.company.findUnique({
            where: { id: cid },
            select: {
                id: true,
                name: true,
                reviews: {
                    select: {
                        id: true,
                        companyRating: true,
                        ratingCulture: true,
                        ratingWorkLife: true,
                        ratingFacilities: true,
                        ratingCareer: true,
                    },
                },
            },
        });
        if (!result) {
            return null;
        }
        // Calculate average companyRating from all reviews
        const validRatings = this.getValidRatings(result.reviews);
        const averageRating = this.calculateAverageRating(validRatings);
        return {
            companyId: result.id,
            companyName: result.name,
            companyRating: Number(averageRating.toFixed(2)),
            totalReviews: validRatings.length,
        };
    }
    // Helper methods
    static calculateOverallRating(avgRatings) {
        return avgRatings?.ratingCulture &&
            avgRatings?.ratingWorkLife &&
            avgRatings?.ratingFacilities &&
            avgRatings?.ratingCareer
            ? (Number(avgRatings?.ratingCulture) +
                Number(avgRatings?.ratingWorkLife) +
                Number(avgRatings?.ratingFacilities) +
                Number(avgRatings?.ratingCareer)) /
                4
            : 0;
    }
    static formatRating(rating) {
        return rating ? Number(rating).toFixed(1) : "0.0";
    }
    static async getRatingDistribution(cid) {
        return (await prisma_1.prisma.$queryRaw `
      SELECT 
        ROUND(("ratingCulture" + "ratingWorkLife" + "ratingFacilities" + "ratingCareer") / 4.0) as rating,
        COUNT(*) as count
      FROM "CompanyReview" cr
      WHERE cr."companyId" = ${cid}
      GROUP BY ROUND(("ratingCulture" + "ratingWorkLife" + "ratingFacilities" + "ratingCareer") / 4.0)
      ORDER BY rating DESC
    `);
    }
    static getValidRatings(reviews) {
        return reviews
            .map((review) => {
            if (review.companyRating === null) {
                const individualRatings = [
                    review.ratingCulture,
                    review.ratingWorkLife,
                    review.ratingFacilities,
                    review.ratingCareer,
                ].filter((rating) => rating !== null);
                if (individualRatings.length === 4) {
                    return (individualRatings.reduce((sum, rating) => sum + Number(rating), 0) / 4);
                }
                return null;
            }
            return Number(review.companyRating);
        })
            .filter((rating) => rating !== null);
    }
    static calculateAverageRating(validRatings) {
        return validRatings.length > 0
            ? validRatings.reduce((sum, rating) => sum + rating, 0) /
                validRatings.length
            : 0;
    }
}
exports.ReviewStatsQueryRepository = ReviewStatsQueryRepository;
//# sourceMappingURL=ReviewStatsQuery.repository.js.map