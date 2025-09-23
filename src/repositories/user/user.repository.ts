import { prisma } from "../../config/prisma";

export class UserRepo {
  public static async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "USER" | "ADMIN";
    phone?: string;
  }) {
    return prisma.user.create({
      data,
    });
  }

  public static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  public static async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  public static async verifyUser(id: number) {
    return prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }
}
