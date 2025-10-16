"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewalValidationService = void 0;
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const customError_1 = require("../../utils/customError");
class RenewalValidationService {
    static async validatePlan(planId) {
        const plan = await plan_repository_1.PlanRepo.getPlanById(planId);
        if (!plan) {
            throw new customError_1.CustomError("Plan not found", 404);
        }
        return plan;
    }
    static validateRenewalEligibility(subscription) {
        if (!subscription) {
            throw new customError_1.CustomError("No subscription found for renewal", 404);
        }
    }
}
exports.RenewalValidationService = RenewalValidationService;
