import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { PlanValidationService } from "./planValidation.service";

export class PlanService {
  public static async getAllPlans() {
    return await PlanRepo.getAllPlans();
  }

  public static async getPlanById(id: number) {
    return await PlanValidationService.validatePlanExists(id);
  }

  public static async createPlan(data: {
    planName: string;
    planPrice: number;
    planDescription: string;
  }) {
    await PlanValidationService.validatePlanNameUnique(data.planName);
    return await PlanRepo.createPlan(data);
  }

  public static async updatePlan(
    id: number,
    data: {
      planName?: string;
      planPrice?: number;
      planDescription?: string;
    }
  ) {
    await PlanValidationService.validatePlanExists(id);
    
    if (data.planName) {
      await PlanValidationService.validatePlanNameUnique(data.planName, id);
    }

    return await PlanRepo.updatePlan(id, data);
  }

  public static async deletePlan(id: number) {
    await PlanValidationService.validatePlanExists(id);
    await PlanValidationService.validatePlanNotInUse(id);
    return await PlanRepo.deletePlan(id);
  }
}
