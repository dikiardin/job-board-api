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

  public static async getPaymentBySlug(slug: string) {
    const payment = await PaymentRepo.getPaymentBySlug(slug);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  }

  // Fallback method that tries slug first, then ID for backward compatibility
  public static async getPaymentBySlugOrId(slugOrId: string) {
    // Try slug first
    const payment = await PaymentRepo.getPaymentBySlug(slugOrId);
    if (payment) {
      return payment;
    }

    // If not found and looks like a number, try ID
    const numericId = parseInt(slugOrId, 10);
    if (!isNaN(numericId)) {
      return await PaymentValidationService.validatePaymentExists(numericId);
    }

    throw new Error("Payment not found");
  }

  public static async uploadPaymentProof(paymentId: number, paymentProof: string) {
    const payment = await PaymentValidationService.validatePaymentExists(paymentId);
    PaymentValidationService.validatePaymentStatus(payment);
    return await PaymentRepo.uploadPaymentProof(paymentId, paymentProof);
  }

  public static async uploadPaymentProofBySlug(slug: string, paymentProof: string) {
    const payment = await this.getPaymentBySlug(slug);
    PaymentValidationService.validatePaymentStatus(payment);
    return await PaymentRepo.uploadPaymentProofBySlug(slug, paymentProof);
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

  public static async approvePaymentBySlug(slug: string) {
    const payment = await this.getPaymentBySlug(slug);
    PaymentValidationService.validatePaymentStatus(payment);

    const updatedPayment = await PaymentRepo.updatePaymentStatusBySlug(
      slug,
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

  public static async rejectPaymentBySlug(slug: string) {
    const payment = await this.getPaymentBySlug(slug);
    PaymentValidationService.validatePaymentStatus(payment);
    return await PaymentRepo.updatePaymentStatusBySlug(slug, "REJECTED");
  }

  public static async getPaymentsBySubscriptionId(subscriptionId: number) {
    return await PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
  }
}
