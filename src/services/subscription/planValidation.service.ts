import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { CustomError } from "../../utils/customError";

export class PlanValidationService {
  public static async validatePlanExists(id: number) {
    const plan = await PlanRepo.getPlanById(id);
    if (!plan) {
      throw new CustomError("Subscription plan not found", 404);
    }
    return plan;
  }

  public static async validatePlanNameUnique(planName: string, excludeId?: number) {
    const allPlans = await PlanRepo.getAllPlans();
    const isNameExists = allPlans.some(
      (plan) => 
        plan.id !== excludeId &&
        plan.planName.toLowerCase() === planName.toLowerCase()
    );

    if (isNameExists) {
      throw new CustomError("Plan name already exists", 409);
    }
  }

  public static async validatePlanNotInUse(id: number) {
    const allSubscriptions = await PlanRepo.getAllSubscriptions();
    const isPlanInUse = allSubscriptions.some(
      (sub) => sub.subscriptionPlanId === id
    );

    if (isPlanInUse) {
      throw new CustomError(
        "Cannot delete plan that is being used by subscriptions",
        400
      );
    }
  }
}
