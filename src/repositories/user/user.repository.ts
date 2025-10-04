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
      data: { emailVerifiedAt: new Date() },
    });
  }
  public static async updateUser(
    id: number,
    data: Partial<{ email: string; emailVerifiedAt: Date | null }>
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
  public static async findByIdWithPassword(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, passwordHash: true }, 
    });
  }
  public static async updatePassword(id: number, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}
