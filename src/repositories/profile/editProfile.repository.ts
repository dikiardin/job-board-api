import { prisma } from "../../config/prisma";

export class EditProfileRepository {
  public static async updateUserProfile(userId: number, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
  public static async updateCompanyProfile(adminId: number, data: any) {
    return prisma.company.update({
      where: { adminId:adminId },
      data,
    });
  }
  public static async findUserById(userId: number) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
}
