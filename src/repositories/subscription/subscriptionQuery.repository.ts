import { prisma } from "../../config/prisma";

export class SubscriptionQueryRepo {
  public static async getAllSubscriptions() {
    return prisma.subscription.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        plan: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getSubscriptionById(id: number) {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        plan: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  public static async getUserSubscriptions(userId: number) {
    return prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getUserActiveSubscription(userId: number) {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: { gte: new Date() },
      },
      include: {
        plan: true,
      },
    });
  }
}
