import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { DateHelper } from "../../utils/dateHelper";

export class RenewalPaymentService {
  public static async createPayment(subscriptionId: number, amount: number) {
    return await PaymentRepo.createPayment({
      subscriptionId,
      paymentMethod: "TRANSFER",
      amount,
      expiresAt: DateHelper.getPaymentExpiration(),
    });
  }

  public static async getPendingPayment(
    userId: number,
    subscriptionIds: number[]
  ) {
    if (subscriptionIds.length === 0) return null;

    console.log("Getting pending payment for user:", userId);
    console.log("Subscription IDs:", subscriptionIds);

    // Use more efficient query
    const payments = await PaymentRepo.getPendingPaymentsByUserId(userId);
    console.log("Found pending payments:", payments.length);

    const payment =
      payments.find((payment) =>
        subscriptionIds.includes(payment.subscriptionId)
      ) || null;

    console.log("Matching payment found:", payment ? "YES" : "NO");
    return payment;
  }
}
