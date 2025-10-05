import { prisma } from "../../config/prisma";

export interface CreateReviewData {
  companyId: number;
  employmentId?: number;
  reviewerUserId: number;
  positionTitle: string;
  salaryEstimateMin?: number;
  salaryEstimateMax?: number;
  ratingCulture: number;
  ratingWorkLife: number;
  ratingFacilities: number;
  ratingCareer: number;
  companyRating: number; // Auto-calculated average
  body?: string;
}

export interface UpdateReviewData {
  positionTitle: string;
  salaryEstimateMin?: number;
  salaryEstimateMax?: number;
  ratingCulture: number;
  ratingWorkLife: number;
  ratingFacilities: number;
  ratingCareer: number;
  companyRating: number; // Auto-calculated average
  body?: string;
}

export interface GetReviewsParams {
  companyId: number | string;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
}

export class CompanyReviewRepository {
  // Check if company exists
  public static async checkCompanyExists(
    companyId: number | string
  ): Promise<boolean> {
    const id = typeof companyId === "string" ? Number(companyId) : companyId;
    const company = await prisma.company.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!company;
  }

  // Get user's employment record with a company
  public static async getUserEmployment(
    userId: number,
    companyId: number | string
  ) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return await prisma.employment.findFirst({
      where: {
        userId,
        companyId: cid,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
      },
    });
  }

  // Get user's verified employment with a company (UPDATED LOGIC)
  public static async getUserVerifiedEmployment(
    userId: number,
    companyId: number | string
  ) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return await prisma.employment.findFirst({
      where: {
        userId,
        companyId: cid,
        isVerified: true,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Get existing review for an employment
  public static async getExistingReview(employmentId: number) {
    return await prisma.companyReview.findUnique({
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

  // Get existing review by user and company (NEW LOGIC)
  public static async getExistingReviewByUserAndCompany(
    userId: number,
    companyId: number | string
  ) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return await prisma.companyReview.findFirst({
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

  // Create a new review
  public static async createReview(data: CreateReviewData) {
    return await prisma.companyReview.create({
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
        isVerifiedEmployee: data.employmentId ? true : false, // Set based on employmentId
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
  public static async updateReview(reviewId: number, data: UpdateReviewData) {
    return await prisma.companyReview.update({
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
  public static async deleteReview(reviewId: number) {
    return await prisma.companyReview.delete({
      where: { id: reviewId },
    });
  }

  // Get company reviews with pagination
  public static async getCompanyReviews(params: GetReviewsParams) {
    const { companyId, limit, offset, sortBy, sortOrder } = params;
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;

    const orderBy: any = {};
    if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === "rating") {
      // Sort by overall rating (average of all ratings)
      orderBy.cultureRating = sortOrder;
    }

    return await prisma.companyReview.findMany({
      where: {
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
      orderBy: orderBy,
      take: limit,
      skip: offset,
    });
  }

  // Get total count of reviews for a company
  public static async getCompanyReviewsCount(
    companyId: number | string
  ): Promise<number> {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return await prisma.companyReview.count({
      where: {
        companyId: cid,
      },
    });
  }

  // Get company review statistics
  public static async getCompanyReviewStats(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
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
    const overallRating =
      avgRatings?.ratingCulture &&
      avgRatings?.ratingWorkLife &&
      avgRatings?.ratingFacilities &&
      avgRatings?.ratingCareer
        ? (Number(avgRatings?.ratingCulture) +
            Number(avgRatings?.ratingWorkLife) +
            Number(avgRatings?.ratingFacilities) +
            Number(avgRatings?.ratingCareer)) /
          4
        : 0;

    // Get rating distribution
    const ratingDistribution = (await prisma.$queryRaw`
      SELECT 
        ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0) as rating,
        COUNT(*) as count
      FROM company_review cr
      WHERE cr.company_id = ${cid}
      GROUP BY ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0)
      ORDER BY rating DESC
    `) as Array<{ rating: number; count: bigint }>;

    return {
      totalReviews,
      avgCultureRating: avgRatings?.ratingCulture?.toFixed?.(1),
      avgWorklifeRating: avgRatings?.ratingWorkLife?.toFixed?.(1),
      avgFacilityRating: avgRatings?.ratingFacilities?.toFixed?.(1),
      avgCareerRating: avgRatings?.ratingCareer?.toFixed?.(1),
      avgCompanyRating: avgRatings?.companyRating?.toFixed?.(1), // Average of all companyRating
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
    const validRatings = result.reviews
      .map(review => {
        // If companyRating is null, calculate from individual ratings
        if (review.companyRating === null) {
          const individualRatings = [
            review.ratingCulture,
            review.ratingWorkLife,
            review.ratingFacilities,
            review.ratingCareer
          ].filter(rating => rating !== null);
          
          if (individualRatings.length === 4) {
            return individualRatings.reduce((sum, rating) => sum + Number(rating), 0) / 4;
          }
          return null;
        }
        return Number(review.companyRating);
      })
      .filter(rating => rating !== null);

    const averageRating = validRatings.length > 0 
      ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
      : 0;

    return {
      companyId: result.id,
      companyName: result.name,
      companyRating: Number(averageRating.toFixed(2)),
      totalReviews: validRatings.length,
    };
  }

  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    const estimates = (await prisma.$queryRaw`
      SELECT 
        position_title as position,
        COUNT(*) as count,
        AVG(salary_estimate_min) as average_salary,
        MIN(salary_estimate_min) as min_salary,
        MAX(salary_estimate_max) as max_salary
      FROM company_review cr
      WHERE cr.company_id = ${cid} AND cr.salary_estimate_min IS NOT NULL
      GROUP BY position_title
      ORDER BY count DESC, average_salary DESC
    `) as Array<{
      position: string;
      count: bigint;
      average_salary: number;
      min_salary: number;
      max_salary: number;
    }>;

    return estimates.map((estimate) => ({
      position: estimate.position,
      count: Number(estimate.count),
      averageSalary: estimate.average_salary?.toFixed(0),
      minSalary: estimate.min_salary,
      maxSalary: estimate.max_salary,
    }));
  }
}
