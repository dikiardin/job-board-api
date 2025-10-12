import { SubscriptionManagementService } from "./subscriptionManagement.service";
import { PaymentManagementService } from "./paymentManagement.service";

export class SubscriptionService {
  public static async getAllSubscriptions() {
    return await SubscriptionManagementService.getAllSubscriptions();
  }

  public static async getSubscriptionById(id: number) {
    return await SubscriptionManagementService.getSubscriptionById(id);
  }

  public static async getUserSubscriptions(userId: number) {
    return await SubscriptionManagementService.getUserSubscriptions(userId);
  }

  public static async getUserActiveSubscription(userId: number) {
    return await SubscriptionManagementService.getUserActiveSubscription(userId);
  }

  public static async subscribeUser(userId: number, planId: number) {
    // Validate plan and check active subscription
    const plan = await SubscriptionManagementService.validatePlanExists(planId);
    await SubscriptionManagementService.checkActiveSubscription(userId);
    
    // Create subscription and payment records
    const subscription = await this.createSubscriptionRecord(userId, planId);
    const payment = await this.createPaymentForSubscription(subscription.id, plan.priceIdr);

    return { subscription, payment };
  }

  private static async createSubscriptionRecord(userId: number, planId: number) {
    return await SubscriptionManagementService.createSubscription(userId, planId);
  }

  private static async createPaymentForSubscription(subscriptionId: number, amount: number) {
    return await PaymentManagementService.createPaymentRecord(
      subscriptionId, 
      Number(amount)
    );
  }

  public static async updateSubscription(
    id: number,
    data: {
      status?: any;
      startDate?: Date;
      expiresAt?: Date;
      paidAt?: Date;
      approvedByDeveloperId?: number;
    }
  ) {
    return await SubscriptionManagementService.updateSubscription(id, data);
  }
}
