import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { DateHelper } from "../../utils/dateHelper";

export class SubscriptionActivationService {
  public static async activateSubscription(subscriptionId: number) {
    const paymentDate = new Date();
    const endDate = DateHelper.getSubscriptionEndDate(paymentDate);

    await SubscriptionRepo.updateSubscription(subscriptionId, {
      isActive: true,
      startDate: paymentDate,
      endDate: endDate,
    });
  }

  public static calculateSubscriptionDates() {
    const paymentDate = new Date();
    const endDate = DateHelper.getSubscriptionEndDate(paymentDate);
    
    return { startDate: paymentDate, endDate };
  }
}
