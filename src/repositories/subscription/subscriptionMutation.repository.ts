import { prisma } from "../../config/prisma";

export class SubscriptionMutationRepo {
  public static async createSubscription(data: {
    userId: number;
    subscriptionPlanId: number;
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.subscription.create({
      data,
      include: {
        plan: true,
      },
    });
  }

  public static async updateSubscription(
    id: number,
    data: {
      isActive?: boolean;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return prisma.subscription.update({
      where: { id },
      data,
      include: {
        plan: true,
      },
    });
  }
}
