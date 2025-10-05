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
    
    // Check if conversion resulted in NaN
    if (isNaN(id)) {
      return false;
    }
    
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
        positionTitle: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        createdAt: true,
        company: {
          select: {
            id: true,
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
    
    // Check if conversion resulted in NaN
    if (isNaN(cid)) {
      return [];
    }

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
  public static async getCompanyReviewsCount(
    companyId: number | string
  ): Promise<number> {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    
    // Check if conversion resulted in NaN
    if (isNaN(cid)) {
      return 0;
    }
    
    return await prisma.companyReview.count({
      where: {
        companyId: cid,
      },
    });
  }

  // Get company review statistics
  public static async getCompanyReviewStats(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    
    // Check if conversion resulted in NaN
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
        ROUND(("ratingCulture" + "ratingWorkLife" + "ratingFacilities" + "ratingCareer") / 4.0) as rating,
        COUNT(*) as count
      FROM "CompanyReview" cr
      WHERE cr."companyId" = ${cid}
      GROUP BY ROUND(("ratingCulture" + "ratingWorkLife" + "ratingFacilities" + "ratingCareer") / 4.0)
      ORDER BY rating DESC
    `) as Array<{ rating: number; count: bigint }>;

    return {
      totalReviews,
      avgCultureRating: avgRatings?.ratingCulture ? Number(avgRatings.ratingCulture).toFixed(1) : "0.0",
      avgWorklifeRating: avgRatings?.ratingWorkLife ? Number(avgRatings.ratingWorkLife).toFixed(1) : "0.0",
      avgFacilityRating: avgRatings?.ratingFacilities ? Number(avgRatings.ratingFacilities).toFixed(1) : "0.0",
      avgCareerRating: avgRatings?.ratingCareer ? Number(avgRatings.ratingCareer).toFixed(1) : "0.0",
      avgCompanyRating: avgRatings?.companyRating ? Number(avgRatings.companyRating).toFixed(1) : "0.0",
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
    const salaryByPosition = (await prisma.$queryRaw`
      SELECT 
        "positionTitle" as position,
        COUNT(*) as count,
        AVG("salaryEstimateMin") as average_salary,
        MIN("salaryEstimateMin") as min_salary,
        MAX("salaryEstimateMax") as max_salary
      FROM "CompanyReview" cr
      WHERE cr."companyId" = ${cid} AND cr."salaryEstimateMin" IS NOT NULL
      GROUP BY "positionTitle"
      ORDER BY count DESC, average_salary DESC
    `) as Array<{
      position: string;
      count: bigint;
      average_salary: number;
      min_salary: number;
      max_salary: number;
    }>;

    return salaryByPosition.map((estimate) => ({
      position: estimate.position,
      count: Number(estimate.count),
      averageSalary: estimate.average_salary?.toFixed(0),
      minSalary: estimate.min_salary,
      maxSalary: estimate.max_salary,
    }));
  }

  // Get company reviewers (shows who reviewed the company)
  public static async getCompanyReviewers(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    
    // Check if conversion resulted in NaN
    if (isNaN(cid)) {
      return [];
    }

    return await prisma.companyReview.findMany({
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
