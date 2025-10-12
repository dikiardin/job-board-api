import { PaymentMutationRepo } from "./paymentMutation.repository";

export class PaymentActionRepo {
  // Approve payment
  public static async approvePayment(id: number) {
    return PaymentMutationRepo.updatePaymentStatus(id, "APPROVED", new Date());
  }

  // Reject payment
  public static async rejectPayment(id: number) {
    return PaymentMutationRepo.updatePaymentStatus(id, "REJECTED");
  }

  // Approve payment by slug
  public static async approvePaymentBySlug(slug: string) {
    return PaymentMutationRepo.updatePaymentStatusBySlug(
      slug,
      "APPROVED",
      new Date()
    );
  }

  // Reject payment by slug
  public static async rejectPaymentBySlug(slug: string) {
    return PaymentMutationRepo.updatePaymentStatusBySlug(slug, "REJECTED");
  }
}
