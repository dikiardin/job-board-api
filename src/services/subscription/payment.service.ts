import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { SubscriptionRepo } from "../../repositories/subscription/subscription.repository";
import { CustomError } from "../../utils/customError";

export class PaymentService {
  public static async getPendingPayments() {
    return await PaymentRepo.getPendingPayments();
  }

  public static async getPaymentById(id: number) {
    const payment = await PaymentRepo.getPaymentById(id);
    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }
    return payment;
  }

  public static async uploadPaymentProof(
    paymentId: number,
    paymentProof: string
  ) {
    const payment = await PaymentRepo.getPaymentById(paymentId);
    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }

    if (payment.status !== "PENDING") {
      throw new CustomError("Payment is not in pending status", 400);
    }

    return await PaymentRepo.uploadPaymentProof(paymentId, paymentProof);
  }

  public static async approvePayment(paymentId: number) {
    const payment = await PaymentRepo.getPaymentById(paymentId);
    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }

    if (payment.status !== "PENDING") {
      throw new CustomError("Payment is not in pending status", 400);
    }

    // Update payment status to approved
    const updatedPayment = await PaymentRepo.updatePaymentStatus(
      paymentId,
      "APPROVED",
      new Date()
    );

    // Set subscription dates based on payment approval date
    const paymentDate = new Date();
    const endDate = new Date(paymentDate);
    endDate.setMinutes(endDate.getMinutes() + 5); // 5 minutes from payment approval date (for testing)

    // Activate subscription with correct dates
    await SubscriptionRepo.updateSubscription(payment.subscriptionId, {
      isActive: true,
      startDate: paymentDate,
      endDate: endDate,
    });

    return updatedPayment;
  }

  public static async rejectPayment(paymentId: number) {
    const payment = await PaymentRepo.getPaymentById(paymentId);
    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }

    if (payment.status !== "PENDING") {
      throw new CustomError("Payment is not in pending status", 400);
    }

    return await PaymentRepo.updatePaymentStatus(paymentId, "REJECTED");
  }

  public static async getPaymentsBySubscriptionId(subscriptionId: number) {
    return await PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
  }
}
