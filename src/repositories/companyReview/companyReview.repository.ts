import { prisma } from "../../config/prisma";

export interface CreateReviewData {
  employmentId: number;
  position: string;
  salaryEstimate?: number;
  cultureRating: number;
  worklifeRating: number;
  facilityRating: number;
  careerRating: number;
  comment?: string;
}

export interface UpdateReviewData {
  position: string;
  salaryEstimate?: number;
  cultureRating: number;
  worklifeRating: number;
  facilityRating: number;
  careerRating: number;
  comment?: string;
}

export interface GetReviewsParams {
  companyId: number;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
}

export class CompanyReviewRepository {
  // Check if company exists
  public static async checkCompanyExists(companyId: number): Promise<boolean> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true }
    });
    return !!company;
  }

  // Get user's employment record with a company
  public static async getUserEmployment(userId: number, companyId: number) {
    return await prisma.employment.findFirst({
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
  public static async getExistingReview(employmentId: number) {
    return await prisma.companyReview.findUnique({
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
  public static async createReview(data: CreateReviewData) {
    return await prisma.companyReview.create({
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
  public static async updateReview(reviewId: number, data: UpdateReviewData) {
    return await prisma.companyReview.update({
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
  public static async deleteReview(reviewId: number) {
    return await prisma.companyReview.delete({
      where: { id: reviewId }
    });
  }

  // Get company reviews with pagination
  public static async getCompanyReviews(params: GetReviewsParams) {
    const { companyId, limit, offset, sortBy, sortOrder } = params;
    
    const orderBy: any = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'rating') {
      // Sort by overall rating (average of all ratings)
      orderBy.cultureRating = sortOrder;
    }

    return await prisma.companyReview.findMany({
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
  public static async getCompanyReviewsCount(companyId: number): Promise<number> {
    return await prisma.companyReview.count({
      where: {
        employment: {
          companyId
        }
      }
    });
  }

  // Get company review statistics
  public static async getCompanyReviewStats(companyId: number) {
    const stats = await prisma.companyReview.aggregate({
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
      ? (avgRatings.cultureRating + avgRatings.worklifeRating + 
         avgRatings.facilityRating + avgRatings.careerRating) / 4
      : 0;

    // Get rating distribution
    const ratingDistribution = await prisma.$queryRaw`
      SELECT 
        ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0) as rating,
        COUNT(*) as count
      FROM company_review cr
      JOIN employment e ON cr.employment_id = e.id
      WHERE e.company_id = ${companyId}
      GROUP BY ROUND((culture_rating + worklife_rating + facility_rating + career_rating) / 4.0)
      ORDER BY rating DESC
    ` as Array<{ rating: number; count: bigint }>;

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
  public static async getSalaryEstimates(companyId: number) {
    const estimates = await prisma.$queryRaw`
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
    ` as Array<{
      position: string;
      count: bigint;
      average_salary: number;
      min_salary: number;
      max_salary: number;
    }>;

    return estimates.map(estimate => ({
      position: estimate.position,
      count: Number(estimate.count),
      averageSalary: estimate.average_salary?.toFixed(0),
      minSalary: estimate.min_salary,
      maxSalary: estimate.max_salary
    }));
  }
}
