import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { SubscriptionStatus } from "../../generated/prisma";
import { CustomError } from "../../utils/customError";
import { RenewalValidationService } from "./renewalValidation.service";
import { RenewalPaymentService } from "./renewalPayment.service";
import { RenewalDateService } from "./renewalDate.service";

export class SubscriptionRenewalService {
  public static async renewSubscription(userId: number, planId?: number) {
    const currentSubscription = await this.getCurrentSubscription(userId);
    const targetPlanId = planId || currentSubscription.planId;
    const plan = await RenewalValidationService.validatePlan(targetPlanId);
    
    const renewalDates = RenewalDateService.calculateRenewalDates(currentSubscription);
    const newSubscription = await this.createRenewalSubscription(userId, targetPlanId, renewalDates);
    const payment = await RenewalPaymentService.createPayment(newSubscription.id, plan.priceIdr);
    
    return this.buildRenewalResponse(newSubscription, payment, plan);
  }

  public static async getRenewalInfo(userId: number) {
    try {
      const currentSubscription = await this.getCurrentSubscription(userId);
      const plan = await RenewalValidationService.validatePlan(currentSubscription.planId);
      const pendingPayment = await this.getPendingRenewalPayment(userId);
      
      return this.buildRenewalInfoResponse(currentSubscription, plan, pendingPayment);
    } catch (error) {
      return this.buildErrorResponse();
    }
  }

  private static async getCurrentSubscription(userId: number) {
    const subscription = await SubscriptionRepo.getUserActiveSubscription(userId);
    
    if (!subscription) {
      const expiredSub = await this.getRecentExpiredSubscription(userId);
      if (expiredSub) return expiredSub;
      throw new CustomError("No subscription found for renewal", 404);
    }
    
    return subscription;
  }

  private static async getRecentExpiredSubscription(userId: number) {
    const subscriptions = await SubscriptionRepo.getUserSubscriptions(userId);
    return subscriptions.find(sub => 
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
      expiresAt: dates.expiresAt
    });
  }

  private static async getPendingRenewalPayment(userId: number) {
    const userSubscriptions = await SubscriptionRepo.getUserSubscriptions(userId);
    const subscriptionIds = userSubscriptions.map(sub => sub.id);
    
    return await RenewalPaymentService.getPendingPayment(userId, subscriptionIds);
  }

  private static buildRenewalResponse(subscription: any, payment: any, plan: any) {
    return {
      subscription,
      payment,
      plan,
      message: "Renewal request created. Please upload payment proof to complete."
    };
  }

  private static buildRenewalInfoResponse(subscription: any, plan: any, pendingPayment: any) {
    return {
      currentSubscription: subscription,
      plan,
      canRenew: !pendingPayment,
      renewalPrice: plan?.priceIdr || 0,
      pendingPayment
    };
  }

  private static buildErrorResponse() {
    return {
      currentSubscription: null,
      plan: null,
      canRenew: false,
      renewalPrice: 0,
      message: "No active or recent subscription found"
    };
  }
}
