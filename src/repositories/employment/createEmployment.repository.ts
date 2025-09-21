import { prisma } from "../../config/prisma";

export class CreateEmploymentRepo {
  public static async createEmploymentForUser(userId: number) {
    return prisma.employment.create({
      data: {
        userId,
        companyId: null,
        isVerified: false,
        startDate: null,
        endDate: null,
      },
    });
  }
}