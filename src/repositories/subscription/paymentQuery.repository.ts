import { prisma } from "../../config/prisma";

export class PaymentQueryRepo {
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

  // Get payment by slug
  public static async getPaymentBySlug(slug: string) {
    return prisma.payment.findUnique({
      where: { slug },
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

  // Get pending payments by user ID (more efficient)
  public static async getPendingPaymentsByUserId(userId: number) {
    return prisma.payment.findMany({
      where: {
        status: "PENDING",
        subscription: { userId },
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
      orderBy: { createdAt: "desc" },
    });
  }
}
