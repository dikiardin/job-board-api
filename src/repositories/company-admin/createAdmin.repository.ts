import { prisma } from "../../config/prisma";

export class CreateAdminRepo {
  public static async createAdminForCompany(userId: number, companyId: number) {
    return prisma.companyAdmin.create({
      data: {
        userId,
        companyId,
        adminRole: "ADMIN", 
      },
    });
  }
}