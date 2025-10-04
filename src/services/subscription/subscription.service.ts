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
    const plan = await SubscriptionManagementService.validatePlanExists(planId);
    await SubscriptionManagementService.checkActiveSubscription(userId);
    
    const subscription = await SubscriptionManagementService.createSubscription(userId, planId);
    const payment = await PaymentManagementService.createPaymentRecord(
      subscription.id, 
      Number(plan.priceIdr)
    );

    return { subscription, payment };
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
