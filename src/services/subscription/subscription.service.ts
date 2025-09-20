import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { PlanRepo } from "../../repositories/subscription/plan.repository";
import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { CustomError } from "../../utils/customError";

export class SubscriptionService {
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

  public static async subscribeUser(userId: number, planId: number) {
    // Check if plan exists
    const plan = await PlanRepo.getPlanById(planId);
    if (!plan) {
      throw new CustomError("Subscription plan not found", 404);
    }

    // Check if user already has active subscription
    const activeSubscription = await SubscriptionRepo.getUserActiveSubscription(
      userId
    );
    if (activeSubscription) {
      throw new CustomError("User already has an active subscription", 400);
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    // Create subscription
    const subscription = await SubscriptionRepo.createSubscription({
      userId,
      subscriptionPlanId: planId,
      startDate,
      endDate,
    });

    // Create payment record
    const payment = await PaymentRepo.createPayment({
      subscriptionId: subscription.id,
      paymentMethod: "TRANSFER",
      amount: Number(plan.planPrice),
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    return {
      subscription,
      payment,
    };
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
