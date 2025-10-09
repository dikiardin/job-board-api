import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { DateHelper } from "../../utils/dateHelper";

export class RenewalPaymentService {
  public static async createPayment(subscriptionId: number, amount: number) {
    return await PaymentRepo.createPayment({
      subscriptionId,
      paymentMethod: "TRANSFER",
      amount,
      expiresAt: DateHelper.getPaymentExpiration()
    });
  }

  public static async getPendingPayment(userId: number, subscriptionIds: number[]) {
    if (subscriptionIds.length === 0) return null;
    
    const payments = await PaymentRepo.getPendingPayments();
    return payments.find(payment => 
      subscriptionIds.includes(payment.subscriptionId) &&
      payment.subscription.userId === userId
    ) || null;
  }
}
