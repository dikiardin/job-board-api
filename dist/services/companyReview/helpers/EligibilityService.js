"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityService = void 0;
const companyReview_repository_1 = require("../../../repositories/companyReview/companyReview.repository");
class EligibilityService {
    static async checkUserEligibility(userId, companyId) {
        const companyExists = await companyReview_repository_1.CompanyReviewRepository.checkCompanyExists(companyId);
        if (!companyExists) {
            return this.buildNotFoundResponse();
        }
        const verifiedEmployment = await companyReview_repository_1.CompanyReviewRepository.getUserVerifiedEmployment(userId, companyId);
        if (!verifiedEmployment) {
            return this.buildNoEmploymentResponse();
        }
        const existingReview = await companyReview_repository_1.CompanyReviewRepository.getExistingReviewByUserAndCompany(userId, companyId);
        if (existingReview) {
            return this.buildExistingReviewResponse(existingReview);
        }
        return this.buildEligibleResponse(verifiedEmployment);
    }
    static buildNotFoundResponse() {
        return {
            isEligible: false,
            canReview: false,
            hasExistingReview: false,
            message: "Company not found"
        };
    }
    static buildNoEmploymentResponse() {
        return {
            isEligible: false,
            canReview: false,
            hasExistingReview: false,
            message: "You must have verified employment with this company to leave a review",
        };
    }
    static buildExistingReviewResponse(existingReview) {
        return {
            isEligible: false,
            canReview: false,
            hasExistingReview: true,
            existingReview: existingReview,
            message: "You have already reviewed this company",
        };
    }
    static buildEligibleResponse(verifiedEmployment) {
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
exports.EligibilityService = EligibilityService;
//# sourceMappingURL=EligibilityService.js.map