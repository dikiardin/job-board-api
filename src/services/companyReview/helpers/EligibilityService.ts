import { CompanyReviewRepository } from "../../../repositories/companyReview/companyReview.repository";

export class EligibilityService {
  public static async checkUserEligibility(userId: number, companyId: string) {
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      return this.buildNotFoundResponse();
    }

    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(userId, companyId);
    if (!verifiedEmployment) {
      return this.buildNoEmploymentResponse();
    }

    const existingReview = await CompanyReviewRepository.getExistingReviewByUserAndCompany(userId, companyId);
    if (existingReview) {
      return this.buildExistingReviewResponse(existingReview);
    }

    return this.buildEligibleResponse(verifiedEmployment);
  }

  private static buildNotFoundResponse() {
    return { 
      isEligible: false, 
      canReview: false, 
      hasExistingReview: false,
      message: "Company not found" 
    };
  }

  private static buildNoEmploymentResponse() {
    return {
      isEligible: false,
      canReview: false,
      hasExistingReview: false,
      message: "You must have verified employment with this company to leave a review",
    };
  }

  private static buildExistingReviewResponse(existingReview: any) {
    return {
      isEligible: false,
      canReview: false,
      hasExistingReview: true,
      existingReview: existingReview,
      message: "You have already reviewed this company",
    };
  }

  private static buildEligibleResponse(verifiedEmployment: any) {
    return {
      isEligible: true,
      canReview: true,
      hasExistingReview: false,
      employmentId: verifiedEmployment.id,
      employment: {
        id: verifiedEmployment.id,
        positionTitle: verifiedEmployment.positionTitle,
        startDate: verifiedEmployment.startDate,
        endDate: verifiedEmployment.endDate,
        isCurrent: verifiedEmployment.isCurrent,
        company: {
          id: verifiedEmployment.company?.id || 0,
          name: verifiedEmployment.company?.name || "Unknown Company",
        }
      },
      message: "You are eligible to review this company",
    };
  }
}
