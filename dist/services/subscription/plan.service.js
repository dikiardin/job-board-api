"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanService = void 0;
const plan_repository_1 = require("../../repositories/subscription/plan.repository");
const planValidation_service_1 = require("./planValidation.service");
class PlanService {
    static async getAllPlans() {
        return await plan_repository_1.PlanRepo.getAllPlans();
    }
    static async getPlanById(id) {
        return await planValidation_service_1.PlanValidationService.validatePlanExists(id);
    }
    static async createPlan(data) {
        await planValidation_service_1.PlanValidationService.validatePlanNameUnique(data.planName);
        return await plan_repository_1.PlanRepo.createPlan(data);
    }
    static async updatePlan(id, data) {
        await planValidation_service_1.PlanValidationService.validatePlanExists(id);
        if (data.planName) {
            await planValidation_service_1.PlanValidationService.validatePlanNameUnique(data.planName, id);
        }
        return await plan_repository_1.PlanRepo.updatePlan(id, data);
    }
    static async deletePlan(id) {
        await planValidation_service_1.PlanValidationService.validatePlanExists(id);
        await planValidation_service_1.PlanValidationService.validatePlanNotInUse(id);
        return await plan_repository_1.PlanRepo.deletePlan(id);
    }
}
exports.PlanService = PlanService;
//# sourceMappingURL=plan.service.js.map