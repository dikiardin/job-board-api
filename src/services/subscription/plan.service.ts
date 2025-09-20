import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { CustomError } from "../../utils/customError";

export class PlanService {
  public static async getAllPlans() {
    return await PlanRepo.getAllPlans();
  }

  public static async getPlanById(id: number) {
    const plan = await PlanRepo.getPlanById(id);
    if (!plan) {
      throw new CustomError("Subscription plan not found", 404);
    }
    return plan;
  }

  public static async createPlan(data: {
    planName: string;
    planPrice: number;
    planDescription: string;
  }) {
    // Check if plan name already exists
    const existingPlan = await PlanRepo.getAllPlans();
    const isNameExists = existingPlan.some(
      (plan) => plan.planName.toLowerCase() === data.planName.toLowerCase()
    );

    if (isNameExists) {
      throw new CustomError("Plan name already exists", 409);
    }

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
    // Check if plan exists
    const existingPlan = await PlanRepo.getPlanById(id);
    if (!existingPlan) {
      throw new CustomError("Subscription plan not found", 404);
    }

    // Check if new plan name conflicts with existing plans
    if (data.planName) {
      const allPlans = await PlanRepo.getAllPlans();
      const isNameExists = allPlans.some(
        (plan) =>
          plan.id !== id &&
          plan.planName.toLowerCase() === data.planName!.toLowerCase()
      );

      if (isNameExists) {
        throw new CustomError("Plan name already exists", 409);
      }
    }

    return await PlanRepo.updatePlan(id, data);
  }

  public static async deletePlan(id: number) {
    // Check if plan exists
    const existingPlan = await PlanRepo.getPlanById(id);
    if (!existingPlan) {
      throw new CustomError("Subscription plan not found", 404);
    }

    // Check if plan is being used by any subscription
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

    return await PlanRepo.deletePlan(id);
  }
}
