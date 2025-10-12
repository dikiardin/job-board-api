import { prisma } from "../../config/prisma";

export class PaymentMutationRepo {
  // Create payment
  public static async createPayment(data: {
    subscriptionId: number;
    paymentMethod: "TRANSFER" | "GATEWAY";
    amount: number;
    paymentProof?: string;
    expiresAt?: Date;
  }) {
    try {
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

      return result;
    } catch (error) {
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

  // Upload payment proof by slug
  public static async uploadPaymentProofBySlug(
    slug: string,
    paymentProof: string
  ) {
    return prisma.payment.update({
      where: { slug },
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

  // Update payment status by slug
  public static async updatePaymentStatusBySlug(
    slug: string,
    status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED",
    approvedAt?: Date
  ) {
    return prisma.payment.update({
      where: { slug },
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
}
