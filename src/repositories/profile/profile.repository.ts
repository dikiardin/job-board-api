import { prisma } from "../../config/prisma";

export class ProfileRepository {
  static async getUserProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dob: true,
        education: true,
        address: true,
        profilePicture: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getCompanyProfile(adminId: number) {
    return prisma.company.findUnique({
      where: { adminId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        description: true,
        website: true,
        logo: true,
        adminId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}