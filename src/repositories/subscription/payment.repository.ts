import { PaymentQueryRepo } from "./paymentQuery.repository";
import { PaymentMutationRepo } from "./paymentMutation.repository";
import { PaymentActionRepo } from "./paymentAction.repository";

export class PaymentRepo {
  // Get all pending payments
  public static async getPendingPayments() {
    return PaymentQueryRepo.getPendingPayments();
  }

  // Get payment by ID
  public static async getPaymentById(id: number) {
    return PaymentQueryRepo.getPaymentById(id);
  }

  // Get payment by slug
  public static async getPaymentBySlug(slug: string) {
    return PaymentQueryRepo.getPaymentBySlug(slug);
  }

  // Create payment
  public static async createPayment(data: {
    subscriptionId: number;
    paymentMethod: "TRANSFER" | "GATEWAY";
    amount: number;
    paymentProof?: string;
    expiresAt?: Date;
  }) {
    return PaymentMutationRepo.createPayment(data);
  }

  // Upload payment proof
  public static async uploadPaymentProof(
    paymentId: number,
    paymentProof: string
  ) {
    return PaymentMutationRepo.uploadPaymentProof(paymentId, paymentProof);
  }

  // Upload payment proof by slug
  public static async uploadPaymentProofBySlug(
    slug: string,
    paymentProof: string
  ) {
    return PaymentMutationRepo.uploadPaymentProofBySlug(slug, paymentProof);
  }

  // Update payment status
  public static async updatePaymentStatus(
    paymentId: number,
    status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED",
    approvedAt?: Date
  ) {
    return PaymentMutationRepo.updatePaymentStatus(
      paymentId,
      status,
      approvedAt
    );
  }

  // Update payment status by slug
  public static async updatePaymentStatusBySlug(
    slug: string,
    status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED",
    approvedAt?: Date
  ) {
    return PaymentMutationRepo.updatePaymentStatusBySlug(
      slug,
      status,
      approvedAt
    );
  }

  // Get payments by subscription ID
  public static async getPaymentsBySubscriptionId(subscriptionId: number) {
    return PaymentQueryRepo.getPaymentsBySubscriptionId(subscriptionId);
  }

  // Approve payment
  public static async approvePayment(id: number) {
    return PaymentActionRepo.approvePayment(id);
  }

  // Reject payment
  public static async rejectPayment(id: number) {
    return PaymentActionRepo.rejectPayment(id);
  }

  // Approve payment by slug
  public static async approvePaymentBySlug(slug: string) {
    return PaymentActionRepo.approvePaymentBySlug(slug);
  }

  // Reject payment by slug
  public static async rejectPaymentBySlug(slug: string) {
    return PaymentActionRepo.rejectPaymentBySlug(slug);
  }
}
