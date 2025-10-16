"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const planValidation_service_1 = require("./planValidation.service");
const prisma_1 = require("../../generated/prisma");
class PlanService {
    static async getAllPlans() {
        return await plan_repository_1.PlanRepo.getAllPlans();
    }
    static async getPlanById(id) {
        return await planValidation_service_1.PlanValidationService.validatePlanExists(id);
    }
    static async createPlan(data) {
        await planValidation_service_1.PlanValidationService.validatePlanNameUnique(data.planName);
        const planData = {
            code: data.planCode || prisma_1.SubscriptionPlanCode.STANDARD,
            name: data.planName,
            priceIdr: data.planPrice,
            description: data.planDescription,
            perks: data.perks || [],
        };
        if (data.monthlyAssessmentQuota !== undefined) {
            planData.monthlyAssessmentQuota = data.monthlyAssessmentQuota;
        }
        return await plan_repository_1.PlanRepo.createPlan(planData);
    }
    static async updatePlan(id, data) {
        await planValidation_service_1.PlanValidationService.validatePlanExists(id);
        if (data.planName) {
            await planValidation_service_1.PlanValidationService.validatePlanNameUnique(data.planName, id);
        }
        const updateData = {};
        if (data.planName)
            updateData.name = data.planName;
        if (data.planPrice)
            updateData.priceIdr = data.planPrice;
        if (data.planDescription)
            updateData.description = data.planDescription;
        if (data.perks)
            updateData.perks = data.perks;
        if (data.monthlyAssessmentQuota !== undefined)
            updateData.monthlyAssessmentQuota = data.monthlyAssessmentQuota;
        return await plan_repository_1.PlanRepo.updatePlan(id, updateData);
    }
    static async deletePlan(id) {
        await planValidation_service_1.PlanValidationService.validatePlanExists(id);
        await planValidation_service_1.PlanValidationService.validatePlanNotInUse(id);
        return await plan_repository_1.PlanRepo.deletePlan(id);
    }
}
exports.PlanService = PlanService;
