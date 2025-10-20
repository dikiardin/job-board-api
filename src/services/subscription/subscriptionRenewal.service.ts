import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { SubscriptionStatus } from "../../generated/prisma";
import { CustomError } from "../../utils/customError";
import { RenewalValidationService } from "./renewalValidation.service";
import { RenewalPaymentService } from "./renewalPayment.service";
import { RenewalDateService } from "./renewalDate.service";

export class SubscriptionRenewalService {
  public static async renewSubscription(userId: number, planId?: number) {
    console.log("=== RENEW SUBSCRIPTION START ===");
    console.log("User ID:", userId);
    console.log("Plan ID:", planId);

    try {
      const currentSubscription = await this.getCurrentSubscription(userId);
      console.log(
        "Current subscription:",
        JSON.stringify(currentSubscription, null, 2)
      );

      const targetPlanId = planId || currentSubscription.planId;
      console.log("Target plan ID:", targetPlanId);

      const plan = await RenewalValidationService.validatePlan(targetPlanId);
      console.log("Plan validated:", plan.name);

      const renewalDates =
        RenewalDateService.calculateRenewalDates(currentSubscription);
      console.log("Renewal dates:", renewalDates);

      const newSubscription = await this.createRenewalSubscription(
        userId,
        targetPlanId,
        renewalDates
      );
      console.log("New subscription created:", newSubscription.id);

      const payment = await RenewalPaymentService.createPayment(
        newSubscription.id,
        plan.priceIdr
      );
      console.log("Payment created:", payment.id);

      console.log("=== RENEW SUBSCRIPTION SUCCESS ===");
      return this.buildRenewalResponse(newSubscription, payment, plan);
    } catch (error) {
      console.error("=== RENEW SUBSCRIPTION ERROR ===");
      console.error("Error:", error);
      throw error;
    }
  }

  public static async getRenewalInfo(userId: number) {
    try {
      console.log("=== RENEWAL INFO START ===");
      console.log("User ID:", userId);

      const currentSubscription = await this.getCurrentSubscription(userId);
      console.log(
        "Current subscription found:",
        currentSubscription ? "YES" : "NO"
      );
      console.log(
        "Subscription details:",
        JSON.stringify(currentSubscription, null, 2)
      );

      const plan = await RenewalValidationService.validatePlan(
        currentSubscription.planId
      );
      console.log("Plan found:", plan ? "YES" : "NO");

      const pendingPayment = await this.getPendingRenewalPayment(userId);
      console.log("Pending payment found:", pendingPayment ? "YES" : "NO");

      const response = this.buildRenewalInfoResponse(
        currentSubscription,
        plan,
        pendingPayment
      );
      console.log("=== RENEWAL INFO SUCCESS ===");
      return response;
    } catch (error) {
      console.error("=== RENEWAL INFO ERROR ===");
      console.error(
        "Error type:",
        error instanceof Error ? error.constructor.name : typeof error
      );
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : undefined
      );
      console.error("User ID:", userId);
      return this.buildErrorResponse();
    }
  }

  private static async getCurrentSubscription(userId: number) {
    const subscription = await SubscriptionRepo.getUserActiveSubscription(
      userId
    );

    if (!subscription) {
      const expiredSub = await this.getRecentExpiredSubscription(userId);
      if (expiredSub) return expiredSub;
      throw new CustomError("No subscription found for renewal", 404);
    }

    return subscription;
  }

  private static async getRecentExpiredSubscription(userId: number) {
    const subscriptions = await SubscriptionRepo.getUserSubscriptions(userId);
    return subscriptions.find(
      (sub) =>
        sub.status === SubscriptionStatus.EXPIRED &&
        sub.expiresAt &&
        RenewalDateService.isWithinGracePeriod(new Date(sub.expiresAt))
    );
  }

  private static async createRenewalSubscription(
    userId: number,
    planId: number,
    dates: { startDate: Date; expiresAt: Date }
  ) {
    return await SubscriptionRepo.createSubscription({
      userId,
      planId,
      status: SubscriptionStatus.PENDING,
      startDate: dates.startDate,
      expiresAt: dates.expiresAt,
    });
  }

  private static async getPendingRenewalPayment(userId: number) {
    const userSubscriptions = await SubscriptionRepo.getUserSubscriptions(
      userId
    );
    const subscriptionIds = userSubscriptions.map((sub) => sub.id);

    return await RenewalPaymentService.getPendingPayment(
      userId,
      subscriptionIds
    );
  }

  private static buildRenewalResponse(
    subscription: any,
    payment: any,
    plan: any
  ) {
    return {
      subscription,
      payment,
      plan,
      message:
        "Renewal request created. Please upload payment proof to complete.",
    };
  }

  private static buildRenewalInfoResponse(
    subscription: any,
    plan: any,
    pendingPayment: any
  ) {
    return {
      currentSubscription: subscription,
      plan,
      canRenew: !pendingPayment,
      renewalPrice: plan?.priceIdr || 0,
      pendingPayment,
    };
  }

  private static buildErrorResponse() {
    return {
      currentSubscription: null,
      plan: null,
      canRenew: false,
      renewalPrice: 0,
      message: "No active or recent subscription found",
    };
  }
}
