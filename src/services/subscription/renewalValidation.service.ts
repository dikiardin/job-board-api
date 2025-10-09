import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { CustomError } from "../../utils/customError";

export class RenewalValidationService {
  public static async validatePlan(planId: number) {
    const plan = await PlanRepo.getPlanById(planId);
    if (!plan) {
      throw new CustomError("Plan not found", 404);
    }
    return plan;
  }

  public static validateRenewalEligibility(subscription: any): void {
    if (!subscription) {
      throw new CustomError("No subscription found for renewal", 404);
    }
  }
}
