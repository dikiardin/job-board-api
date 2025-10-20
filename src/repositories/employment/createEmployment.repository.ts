import { prisma } from "../../config/prisma";

export class CreateEmploymentRepo {
  public static async createEmploymentForUser(userId: number) {
    return prisma.employment.create({
      data: {
        userId,
        companyId: null,
        startDate: null,
        endDate: null,
      },
    });
  }
}
