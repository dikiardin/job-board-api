import { CompanyReviewRepository } from "../../../repositories/companyReview/companyReview.repository";
import { CustomError } from "../../../utils/customError";

export class CompanyValidationService {
  public static async validateCompanyExists(companyId: string): Promise<void> {
    const companyExists = await CompanyReviewRepository.checkCompanyExists(companyId);
    if (!companyExists) {
      throw new CustomError("Company not found", 404);
    }
  }

  public static async validateUserEmployment(userId: number, companyId: string): Promise<any> {
    const verifiedEmployment = await CompanyReviewRepository.getUserVerifiedEmployment(
      userId,
      companyId
    );
    if (!verifiedEmployment) {
      throw new CustomError("You must have verified employment with this company", 404);
    }
    return verifiedEmployment;
  }

  public static async validateExistingReview(userId: number, companyId: string): Promise<any> {
    const existingReview = await CompanyReviewRepository.getExistingReviewByUserAndCompany(
      userId,
      companyId
    );
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }
    return existingReview;
  }
}
