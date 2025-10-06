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
  companyRating: number;
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
  companyRating: number;
  body?: string;
}

export class ReviewMutationRepository {
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
}
