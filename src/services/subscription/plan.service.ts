import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { PlanValidationService } from "./planValidation.service";
import { SubscriptionPlanCode } from "../../generated/prisma";

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
    planCode?: any;
    perks?: string[];
    monthlyAssessmentQuota?: number;
  }) {
    await PlanValidationService.validatePlanNameUnique(data.planName);
    
    const planData: any = {
      code: data.planCode || SubscriptionPlanCode.STANDARD,
      name: data.planName,
      priceIdr: data.planPrice,
      description: data.planDescription,
      perks: data.perks || [],
    };
    
    if (data.monthlyAssessmentQuota !== undefined) {
      planData.monthlyAssessmentQuota = data.monthlyAssessmentQuota;
    }
    
    return await PlanRepo.createPlan(planData);
  }

  public static async updatePlan(
    id: number,
    data: {
      planName?: string;
      planPrice?: number;
      planDescription?: string;
      perks?: string[];
      monthlyAssessmentQuota?: number;
    }
  ) {
    await PlanValidationService.validatePlanExists(id);
    
    if (data.planName) {
      await PlanValidationService.validatePlanNameUnique(data.planName, id);
    }

    const updateData: any = {};
    if (data.planName) updateData.name = data.planName;
    if (data.planPrice) updateData.priceIdr = data.planPrice;
    if (data.planDescription) updateData.description = data.planDescription;
    if (data.perks) updateData.perks = data.perks;
    if (data.monthlyAssessmentQuota !== undefined) updateData.monthlyAssessmentQuota = data.monthlyAssessmentQuota;

    return await PlanRepo.updatePlan(id, updateData);
  }

  public static async deletePlan(id: number) {
    await PlanValidationService.validatePlanExists(id);
    await PlanValidationService.validatePlanNotInUse(id);
    return await PlanRepo.deletePlan(id);
  }
}
