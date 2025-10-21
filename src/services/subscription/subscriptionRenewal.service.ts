import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { SubscriptionStatus } from "../../generated/prisma";
import { CustomError } from "../../utils/customError";
import { RenewalValidationService } from "./renewalValidation.service";
import { RenewalPaymentService } from "./renewalPayment.service";
import { RenewalDateService } from "./renewalDate.service";
import { prisma } from "../../config/prisma";

export class SubscriptionRenewalService {
  public static async renewSubscription(userId: number, planId?: number) {
    console.log("=== RENEW SUBSCRIPTION START ===");
    console.log("User ID:", userId);
    console.log("Plan ID:", planId);

    try {
      // Step 1: Test database connection
      console.log("[STEP 1] Testing database connection...");
      await prisma.$queryRaw`SELECT 1`;
      console.log("[STEP 1] ✓ Database connection OK");

      // Step 2: Get current subscription
      console.log("[STEP 2] Getting current subscription for user:", userId);
      const currentSubscription = await this.getCurrentSubscription(userId);
      console.log("[STEP 2] ✓ Current subscription found");
      console.log(
        "Subscription details:",
        JSON.stringify(currentSubscription, null, 2)
      );

      // Step 3: Determine target plan
      console.log("[STEP 3] Determining target plan...");
      const targetPlanId = planId || currentSubscription.planId;
      console.log("[STEP 3] Target plan ID:", targetPlanId);

      // Step 4: Validate plan
      console.log("[STEP 4] Validating plan...");
      const plan = await RenewalValidationService.validatePlan(targetPlanId);
      console.log("[STEP 4] ✓ Plan validated:", plan.name);
      console.log("Plan details:", JSON.stringify(plan, null, 2));

      // Step 5: Calculate renewal dates
      console.log("[STEP 5] Calculating renewal dates...");
      const renewalDates =
        RenewalDateService.calculateRenewalDates(currentSubscription);
      console.log("[STEP 5] ✓ Renewal dates calculated:", renewalDates);

      // Step 6: Create renewal subscription
      console.log("[STEP 6] Creating renewal subscription...");
      console.log("Create data:", {
        userId,
        planId: targetPlanId,
        status: "PENDING",
        startDate: renewalDates.startDate,
        expiresAt: renewalDates.expiresAt,
      });
      const newSubscription = await this.createRenewalSubscription(
        userId,
        targetPlanId,
        renewalDates
      );
      console.log("[STEP 6] ✓ New subscription created:", newSubscription.id);

      // Step 7: Create payment
      console.log("[STEP 7] Creating payment...");
      console.log("Payment data:", {
        subscriptionId: newSubscription.id,
        amount: plan.priceIdr,
      });
      const payment = await RenewalPaymentService.createPayment(
        newSubscription.id,
        plan.priceIdr
      );
      console.log("[STEP 7] ✓ Payment created:", payment.id);

      console.log("=== RENEW SUBSCRIPTION SUCCESS ===");
      return this.buildRenewalResponse(newSubscription, payment, plan);
    } catch (error) {
      console.error("=== RENEW SUBSCRIPTION ERROR ===");
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
        error instanceof Error ? error.stack : "No stack trace"
      );
      console.error("User ID:", userId);
      console.error("Plan ID:", planId);
      console.error("Full error object:", error);
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
    console.log("Getting active subscription for user:", userId);
    const subscription = await SubscriptionRepo.getUserActiveSubscription(
      userId
    );
    console.log("Active subscription result:", subscription ? "FOUND" : "NOT FOUND");

    if (!subscription) {
      console.log("Checking for recent expired subscription...");
      const expiredSub = await this.getRecentExpiredSubscription(userId);
      console.log(
        "Expired subscription result:",
        expiredSub ? "FOUND" : "NOT FOUND"
      );

      if (expiredSub) {
        console.log("Using expired subscription within grace period");
        return expiredSub;
      }

      console.error("No valid subscription found for renewal");
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
