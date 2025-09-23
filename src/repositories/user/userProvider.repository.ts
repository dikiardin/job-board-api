import { prisma } from "../../config/prisma";
export class UserProviderRepo {
  static async findByProvider(
    provider: "GOOGLE",
    providerId: string
  ) {
    return prisma.userProvider.findUnique({
      where: { provider_providerId: { provider, providerId } },
      include: { user: true },
    });
  }

  static async createUserWithProvider(data: {
    name: string;
    email: string;
    provider: "GOOGLE";
    providerId: string;
    role: "USER" | "ADMIN";
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: "", 
        role: data.role,
        isVerified: true,
        providers: {
          create: { provider: data.provider, providerId: data.providerId },
        },
      },
      include: { providers: true },
    });
  }
}
