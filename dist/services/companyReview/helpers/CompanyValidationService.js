"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidationService = void 0;
const companyReview_repository_1 = require("../../../repositories/companyReview/companyReview.repository");
const customError_1 = require("../../../utils/customError");
class CompanyValidationService {
    static async validateCompanyExists(companyId) {
        const companyExists = await companyReview_repository_1.CompanyReviewRepository.checkCompanyExists(companyId);
        if (!companyExists) {
            throw new customError_1.CustomError("Company not found", 404);
        }
    }
    static async validateUserEmployment(userId, companyId) {
        const verifiedEmployment = await companyReview_repository_1.CompanyReviewRepository.getUserVerifiedEmployment(userId, companyId);
        if (!verifiedEmployment) {
            throw new customError_1.CustomError("You must have verified employment with this company", 404);
        }
        return verifiedEmployment;
    }
    static async validateExistingReview(userId, companyId) {
        const existingReview = await companyReview_repository_1.CompanyReviewRepository.getExistingReviewByUserAndCompany(userId, companyId);
        if (!existingReview) {
            throw new customError_1.CustomError("Review not found", 404);
        }
        return existingReview;
    }
}
exports.CompanyValidationService = CompanyValidationService;
//# sourceMappingURL=CompanyValidationService.js.map