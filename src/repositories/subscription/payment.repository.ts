import { prisma } from "../../config/prisma";

export class PaymentRepo {
  // Get all pending payments
  public static async getPendingPayments() {
    return prisma.payment.findMany({
      where: { status: "PENDING" },
      include: {
        subscription: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            plan: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get payment by ID
  public static async getPaymentById(id: number) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            plan: true,
          },
        },
      },
    });
  }

  // Create payment
  public static async createPayment(data: {
    subscriptionId: number;
    paymentMethod: "TRANSFER" | "GATEWAY";
    amount: number;
    paymentProof?: string;
    expiresAt?: Date;
  }) {
    try {
      console.log("PaymentRepo.createPayment called with data:", data);
      
      const result = await prisma.payment.create({
        data,
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      });
      
      console.log("PaymentRepo.createPayment result:", result);
      return result;
    } catch (error) {
      console.error("Error in PaymentRepo.createPayment:", error);
      throw error;
    }
  }

  // Upload payment proof
  public static async uploadPaymentProof(
    paymentId: number,
    paymentProof: string
  ) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { paymentProof },
    });
  }

  // Update payment status
  public static async updatePaymentStatus(
    paymentId: number,
    status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED",
    approvedAt?: Date
  ) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        ...(approvedAt && { approvedAt }),
      },
      include: {
        subscription: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            plan: true,
          },
        },
      },
    });
  }

  // Get payments by subscription ID
  public static async getPaymentsBySubscriptionId(subscriptionId: number) {
    return prisma.payment.findMany({
      where: { subscriptionId },
      orderBy: { createdAt: "desc" },
    });
  }

  // Approve payment
  public static async approvePayment(id: number) {
    return this.updatePaymentStatus(id, "APPROVED", new Date());
  }

  // Reject payment
  public static async rejectPayment(id: number) {
    return this.updatePaymentStatus(id, "REJECTED");
  }
}
