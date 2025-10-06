import { prisma } from "../../config/prisma";

export interface GetReviewsParams {
  companyId: number | string;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
}

export class ReviewQueryRepository {
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

  // Get existing review by user and company
  public static async getExistingReviewByUserAndCompany(userId: number, companyId: number | string) {
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

  // Get company reviews with pagination
  public static async getCompanyReviews(params: GetReviewsParams) {
    const { companyId, limit, offset, sortBy, sortOrder } = params;
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    
    if (isNaN(cid)) {
      return [];
    }

    const orderBy: any = {};
    if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === "rating") {
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
  public static async getCompanyReviewsCount(companyId: number | string): Promise<number> {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    
    if (isNaN(cid)) {
      return 0;
    }
    
    return await prisma.companyReview.count({
      where: {
        companyId: cid,
      },
    });
  }

  // Get company reviewers (shows who reviewed the company)
  public static async getCompanyReviewers(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    
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
