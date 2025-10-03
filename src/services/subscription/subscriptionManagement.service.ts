import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { CustomError } from "../../utils/customError";
import { DateHelper } from "../../utils/dateHelper";

export class SubscriptionManagementService {
  public static async getAllSubscriptions() {
    return await SubscriptionRepo.getAllSubscriptions();
  }

  public static async getSubscriptionById(id: number) {
    const subscription = await SubscriptionRepo.getSubscriptionById(id);
    if (!subscription) {
      throw new CustomError("Subscription not found", 404);
    }
    return subscription;
  }

  public static async getUserSubscriptions(userId: number) {
    return await SubscriptionRepo.getUserSubscriptions(userId);
  }

  public static async getUserActiveSubscription(userId: number) {
    return await SubscriptionRepo.getUserActiveSubscription(userId);
  }

  public static async validatePlanExists(planId: number) {
    const plan = await PlanRepo.getPlanById(planId);
    if (!plan) {
      throw new CustomError("Subscription plan not found", 404);
    }
    return plan;
  }

  public static async checkActiveSubscription(userId: number) {
    const activeSubscription = await SubscriptionRepo.getUserActiveSubscription(userId);
    if (activeSubscription) {
      throw new CustomError("User already has an active subscription", 400);
    }
  }

  public static async createSubscription(userId: number, planId: number) {
    const placeholderDate = DateHelper.getPlaceholderDate();
    
    return await SubscriptionRepo.createSubscription({
      userId,
      subscriptionPlanId: planId,
      startDate: placeholderDate,
      endDate: placeholderDate,
    });
  }

  public static async updateSubscription(
    id: number,
    data: {
      isActive?: boolean;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const existingSubscription = await SubscriptionRepo.getSubscriptionById(id);
    if (!existingSubscription) {
      throw new CustomError("Subscription not found", 404);
    }

    return await SubscriptionRepo.updateSubscription(id, data);
  }
}
