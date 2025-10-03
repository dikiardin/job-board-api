import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { DateHelper } from "../../utils/dateHelper";

export class PaymentManagementService {
  public static async createPaymentRecord(subscriptionId: number, planPrice: number) {
    const expiredAt = DateHelper.getPaymentExpiration();
    
    return await PaymentRepo.createPayment({
      subscriptionId,
      paymentMethod: "TRANSFER",
      amount: Number(planPrice),
      expiredAt,
    });
  }

  public static async getPendingPayments() {
    return await PaymentRepo.getPendingPayments();
  }

  public static async getPaymentById(id: number) {
    return await PaymentRepo.getPaymentById(id);
  }

  public static async uploadPaymentProof(paymentId: number, proofUrl: string) {
    return await PaymentRepo.uploadPaymentProof(paymentId, proofUrl);
  }

  public static async approvePayment(id: number) {
    return await PaymentRepo.approvePayment(id);
  }

  public static async rejectPayment(id: number) {
    return await PaymentRepo.rejectPayment(id);
  }

  public static async getPaymentsBySubscriptionId(subscriptionId: number) {
    return await PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
  }
}
