"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const customError_1 = require("../../utils/customError");
class PlanService {
    static async getAllPlans() {
        return await plan_repository_1.PlanRepo.getAllPlans();
    }
    static async getPlanById(id) {
        const plan = await plan_repository_1.PlanRepo.getPlanById(id);
        if (!plan) {
            throw new customError_1.CustomError("Subscription plan not found", 404);
        }
        return plan;
    }
    static async createPlan(data) {
        // Check if plan name already exists
        const existingPlan = await plan_repository_1.PlanRepo.getAllPlans();
        const isNameExists = existingPlan.some((plan) => plan.planName.toLowerCase() === data.planName.toLowerCase());
        if (isNameExists) {
            throw new customError_1.CustomError("Plan name already exists", 409);
        }
        return await plan_repository_1.PlanRepo.createPlan(data);
    }
    static async updatePlan(id, data) {
        // Check if plan exists
        const existingPlan = await plan_repository_1.PlanRepo.getPlanById(id);
        if (!existingPlan) {
            throw new customError_1.CustomError("Subscription plan not found", 404);
        }
        // Check if new plan name conflicts with existing plans
        if (data.planName) {
            const allPlans = await plan_repository_1.PlanRepo.getAllPlans();
            const isNameExists = allPlans.some((plan) => plan.id !== id &&
                plan.planName.toLowerCase() === data.planName.toLowerCase());
            if (isNameExists) {
                throw new customError_1.CustomError("Plan name already exists", 409);
            }
        }
        return await plan_repository_1.PlanRepo.updatePlan(id, data);
    }
    static async deletePlan(id) {
        // Check if plan exists
        const existingPlan = await plan_repository_1.PlanRepo.getPlanById(id);
        if (!existingPlan) {
            throw new customError_1.CustomError("Subscription plan not found", 404);
        }
        // Check if plan is being used by any subscription
        const allSubscriptions = await plan_repository_1.PlanRepo.getAllSubscriptions();
        const isPlanInUse = allSubscriptions.some((sub) => sub.subscriptionPlanId === id);
        if (isPlanInUse) {
            throw new customError_1.CustomError("Cannot delete plan that is being used by subscriptions", 400);
        }
        return await plan_repository_1.PlanRepo.deletePlan(id);
    }
}
exports.PlanService = PlanService;
//# sourceMappingURL=plan.service.js.map