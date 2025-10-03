import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { PaymentValidationService } from "./paymentValidation.service";
import { SubscriptionActivationService } from "./subscriptionActivation.service";

export class PaymentService {
  public static async getPendingPayments() {
    return await PaymentRepo.getPendingPayments();
  }

  public static async getPaymentById(id: number) {
    return await PaymentValidationService.validatePaymentExists(id);
  }

  public static async uploadPaymentProof(paymentId: number, paymentProof: string) {
    const payment = await PaymentValidationService.validatePaymentExists(paymentId);
    PaymentValidationService.validatePaymentStatus(payment);
    return await PaymentRepo.uploadPaymentProof(paymentId, paymentProof);
  }

  public static async approvePayment(paymentId: number) {
    const payment = await PaymentValidationService.validatePaymentExists(paymentId);
    PaymentValidationService.validatePaymentStatus(payment);

    const updatedPayment = await PaymentRepo.updatePaymentStatus(
      paymentId,
      "APPROVED",
      new Date()
    );

    await SubscriptionActivationService.activateSubscription(payment.subscriptionId);
    return updatedPayment;
  }

  public static async rejectPayment(paymentId: number) {
    const payment = await PaymentValidationService.validatePaymentExists(paymentId);
    PaymentValidationService.validatePaymentStatus(payment);
    return await PaymentRepo.updatePaymentStatus(paymentId, "REJECTED");
  }

  public static async getPaymentsBySubscriptionId(subscriptionId: number) {
    return await PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
  }
}
