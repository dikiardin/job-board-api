import { prisma } from "../../config/prisma";

export class ReviewStatsQueryRepository {
  // Get company review statistics
  public static async getCompanyReviewStats(companyId: number | string) {
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

    const stats = await prisma.companyReview.aggregate({
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

    const totalReviews = await prisma.companyReview.count({
      where: { companyId: cid },
    });

    // Calculate overall average rating
    const avgRatings = stats._avg as any;
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
  public static async getCompanyRating(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;

    // Get company info and average rating
    const result = await prisma.company.findUnique({
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
  private static calculateOverallRating(avgRatings: any): number {
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

  private static formatRating(rating: any): string {
    return rating ? Number(rating).toFixed(1) : "0.0";
  }

  private static async getRatingDistribution(cid: number) {
    return (await prisma.$queryRaw`
      SELECT 
        ROUND(("ratingCulture" + "ratingWorkLife" + "ratingFacilities" + "ratingCareer") / 4.0) as rating,
        COUNT(*) as count
      FROM "CompanyReview" cr
      WHERE cr."companyId" = ${cid}
      GROUP BY ROUND(("ratingCulture" + "ratingWorkLife" + "ratingFacilities" + "ratingCareer") / 4.0)
      ORDER BY rating DESC
    `) as Array<{ rating: number; count: bigint }>;
  }

  private static getValidRatings(reviews: any[]): number[] {
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
            return (
              individualRatings.reduce(
                (sum, rating) => sum + Number(rating),
                0
              ) / 4
            );
          }
          return null;
        }
        return Number(review.companyRating);
      })
      .filter((rating) => rating !== null);
  }

  private static calculateAverageRating(validRatings: number[]): number {
    return validRatings.length > 0
      ? validRatings.reduce((sum, rating) => sum + rating, 0) /
          validRatings.length
      : 0;
  }
}
