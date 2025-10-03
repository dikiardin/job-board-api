import { SubscriptionQueryRepo } from "./subscriptionQuery.repository";
import { SubscriptionMutationRepo } from "./subscriptionMutation.repository";
import { SubscriptionExpiryRepo } from "./subscriptionExpiry.repository";

export class SubscriptionRepo {
  // Query operations
  public static async getAllSubscriptions() {
    return SubscriptionQueryRepo.getAllSubscriptions();
  }

  public static async getSubscriptionById(id: number) {
    return SubscriptionQueryRepo.getSubscriptionById(id);
  }

  public static async getUserSubscriptions(userId: number) {
    return SubscriptionQueryRepo.getUserSubscriptions(userId);
  }

  public static async getUserActiveSubscription(userId: number) {
    return SubscriptionQueryRepo.getUserActiveSubscription(userId);
  }

  // Mutation operations
  public static async createSubscription(data: {
    userId: number;
    subscriptionPlanId: number;
    startDate: Date;
    endDate: Date;
  }) {
    return SubscriptionMutationRepo.createSubscription(data);
  }

  public static async updateSubscription(
    id: number,
    data: {
      isActive?: boolean;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return SubscriptionMutationRepo.updateSubscription(id, data);
  }

  // Expiry operations
  public static async getSubscriptionsExpiringTomorrow() {
    return SubscriptionExpiryRepo.getSubscriptionsExpiringTomorrow();
  }

  public static async getSubscriptionsExpiringInMinutes(minutes: number) {
    return SubscriptionExpiryRepo.getSubscriptionsExpiringInMinutes(minutes);
  }

  public static async getExpiredSubscriptions() {
    return SubscriptionExpiryRepo.getExpiredSubscriptions();
  }
}
