"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanValidationService = void 0;
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const customError_1 = require("../../utils/customError");
class PlanValidationService {
    static async validatePlanExists(id) {
        const plan = await plan_repository_1.PlanRepo.getPlanById(id);
        if (!plan) {
            throw new customError_1.CustomError("Subscription plan not found", 404);
        }
        return plan;
    }
    static async validatePlanNameUnique(planName, excludeId) {
        const allPlans = await plan_repository_1.PlanRepo.getAllPlans();
        const isNameExists = allPlans.some((plan) => plan.id !== excludeId &&
            plan.name.toLowerCase() === planName.toLowerCase());
        if (isNameExists) {
            throw new customError_1.CustomError("Plan name already exists", 409);
        }
    }
    static async validatePlanNotInUse(id) {
        const allSubscriptions = await plan_repository_1.PlanRepo.getAllSubscriptions();
        const isPlanInUse = allSubscriptions.some((sub) => sub.planId === id);
        if (isPlanInUse) {
            throw new customError_1.CustomError("Cannot delete plan that is being used by subscriptions", 400);
        }
    }
}
exports.PlanValidationService = PlanValidationService;
